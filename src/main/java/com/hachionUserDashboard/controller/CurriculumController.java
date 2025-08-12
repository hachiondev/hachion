
package com.hachionUserDashboard.controller;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.hachionUserDashboard.entity.Curriculum;
import com.hachionUserDashboard.repository.CurriculumRepository;

import jakarta.annotation.PostConstruct;

@CrossOrigin
@RestController
public class CurriculumController {

	@Autowired
	private CurriculumRepository repo;

	@Value("${file.upload-dir}")
	private String upload;

	private String uploadDir;

	@PostConstruct
	public void initUploadDir() {
		this.uploadDir = upload + "curriculum/";
	}

	@GetMapping("/curriculum/{id}")
	public ResponseEntity<Curriculum> getCurriculum(@PathVariable Integer id) {
		return repo.findById(id).map(ResponseEntity::ok).orElse(ResponseEntity.status(HttpStatus.NOT_FOUND).build());
	}

	@GetMapping("/curriculum")
	public List<Curriculum> getAllCurriculum() {
		return repo.findAll();
	}

//	private final String uploadDir = upload + "curriculum/";

//	private final String uploadDir = System.getProperty("user.home") + "/uploads/curriculum/";

	private String saveFile(MultipartFile file, String subFolder) throws IOException {
		if (file != null && !file.isEmpty()) {

			File directory = new File(uploadDir + subFolder);
			if (!directory.exists()) {
				directory.mkdirs();
			}

			Path filePath = Paths.get(directory.getAbsolutePath(), file.getOriginalFilename());
			Files.write(filePath, file.getBytes());
			return subFolder + "/" + file.getOriginalFilename();
		}
		return null;
	}

	@PostMapping("curriculum/add")
	public ResponseEntity<?> addCurriculum(@RequestPart("curriculumData") String curriculumData,
			@RequestPart(value = "curriculumPdf", required = false) MultipartFile curriculumPdf,
			@RequestPart(value = "assessmentPdf", required = false) MultipartFile assessmentPdf) {

		try {
			ObjectMapper objectMapper = new ObjectMapper();
			objectMapper.registerModule(new JavaTimeModule());
			Curriculum curriculum = objectMapper.readValue(curriculumData, Curriculum.class);

			if (curriculumPdf != null && !curriculumPdf.isEmpty()) {
				String originalFileName = curriculumPdf.getOriginalFilename();

				if (!originalFileName.matches("[a-zA-Z0-9_&\\-\\s/\\.]*")) {
					return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(
							"Invalid file name. Only letters, numbers, hyphens (-), underscores (_), ampersands (&), slashes (/), dots (.), and spaces are allowed.");
				}

				String pdfPath = saveFile(curriculumPdf, "pdfs");
				curriculum.setCurriculum_pdf(pdfPath != null ? pdfPath : "");
			} else {
				curriculum.setCurriculum_pdf("");
			}

			if (assessmentPdf != null && !assessmentPdf.isEmpty()) {
				String assessmentFileName = assessmentPdf.getOriginalFilename();

				if (!assessmentFileName.matches("[a-zA-Z0-9_&\\-\\s/\\.]*")) {
					return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(
							"Invalid Assessment PDF name. Only letters, numbers, hyphens (-), underscores (_), ampersands (&), slashes (/), dots (.), and spaces are allowed.");
				}

				String assessmentPath = saveFile(assessmentPdf, "pdfs/assessments");
				curriculum.setAssessment_pdf(assessmentPath != null ? assessmentPath : "");
			} else {
				curriculum.setAssessment_pdf("");
			}

			Curriculum saved = repo.save(curriculum);

			if (curriculumPdf != null && !curriculumPdf.isEmpty()) {
				String extractedText = extractTextFromPdf(curriculumPdf);
				parseAndSaveModules(extractedText, saved, repo);
			}

			return ResponseEntity.status(HttpStatus.CREATED).body("Curriculum and modules saved successfully.");

		} catch (Exception e) {
			e.printStackTrace();
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
					.body("Error adding curriculum: " + e.getMessage());
		}
	}

	private String extractTextFromPdf(MultipartFile pdfFile) throws IOException {
		try (PDDocument document = PDDocument.load(pdfFile.getInputStream())) {
			PDFTextStripper stripper = new PDFTextStripper();
			return stripper.getText(document);
		}
	}

	private void parseAndSaveModules(String pdfText, Curriculum baseCurriculum, CurriculumRepository repo) {
		String[] lines = pdfText.split("\\r?\\n");
//	    Pattern modulePattern = Pattern.compile("^(Module\\s*\\d+[:\\-]?|\\d+\\.)\\s*(.+)", Pattern.CASE_INSENSITIVE);
		Pattern modulePattern = Pattern.compile("^Module\\s*\\d+[:\\-]?\\s*(.+)", Pattern.CASE_INSENSITIVE);

		Curriculum current = null;
		StringBuilder topicBuilder = new StringBuilder();

		for (String line : lines) {
			line = line.trim();
			Matcher matcher = modulePattern.matcher(line);

			if (matcher.find()) {

				if (current != null) {
					String topicHtml = wrapInHtmlList(topicBuilder.toString());
					current.setTopic(topicHtml);
					repo.save(current);
				}

				current = new Curriculum();
				current.setCategory_name(baseCurriculum.getCategory_name());
				current.setCourse_name(baseCurriculum.getCourse_name());
				current.setCurriculum_pdf("");
				current.setAssessment_pdf("");
				current.setLink("");
				current.setTitle(line);
				current.setDate(LocalDate.now());
				topicBuilder.setLength(0);
			} else if (!line.isEmpty() && current != null) {
				topicBuilder.append(line).append("\n");
			}
		}

		if (current != null) {
			String topicHtml = wrapInHtmlList(topicBuilder.toString());
			current.setTopic(topicHtml);
			repo.save(current);
		}
	}

	private String wrapInHtmlList(String textBlock) {
		StringBuilder html = new StringBuilder("<ul>");
		String[] lines = textBlock.split("\\r?\\n");

		StringBuilder currentItem = new StringBuilder();
		boolean insideSubList = false;

		html.append("<li>");
		for (int i = 0; i < lines.length; i++) {
			String line = lines[i].trim().replace("", "•").replace("\uF0B7", "•").replace("●", "•");

			if (line.matches("^\\d+\\.\\s+.*")) {
				if (!insideSubList) {
					currentItem.append("<ol>");
					insideSubList = true;
				}
				String subPoint = line.replaceFirst("^\\d+\\.\\s*", "");
				currentItem.append("<li>").append(subPoint).append("</li>");
			}

			else if (line.matches("^[•\\-]\\s*.*")) {
				if (currentItem.length() > 0) {
					if (insideSubList) {
						currentItem.append("</ol>");
						insideSubList = false;
					}
					html.append(currentItem.toString().trim()).append("</li><li>");
					currentItem.setLength(0);
				}
				currentItem.append(line.replaceFirst("^[•\\-]\\s*", ""));
			}

			else {
				currentItem.append(" ").append(line);
			}
		}

		if (currentItem.length() > 0) {
			if (insideSubList) {
				currentItem.append("</ol>");
			}
			html.append(currentItem.toString().trim()).append("</li>");
		}

		html.append("</ul>");
		return html.toString();
	}

	@PutMapping(value = "/curriculum/update/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
	public ResponseEntity<?> updateCurriculum(@PathVariable int id,
			@RequestPart("curriculumData") String curriculumData,
			@RequestPart(value = "curriculumPdf", required = false) MultipartFile curriculumPdf,
			@RequestPart(value = "assessmentPdf", required = false) MultipartFile assessmentPdf) {
		try {
			Optional<Curriculum> optionalCurriculum = repo.findById(id);
			if (!optionalCurriculum.isPresent()) {
				return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Curriculum not found");
			}

			Curriculum existing = optionalCurriculum.get();

			ObjectMapper objectMapper = new ObjectMapper();
			objectMapper.registerModule(new JavaTimeModule());
			Curriculum updatedData = objectMapper.readValue(curriculumData, Curriculum.class);

			if (updatedData.getCategory_name() != null)
				existing.setCategory_name(updatedData.getCategory_name());
			if (updatedData.getCourse_name() != null)
				existing.setCourse_name(updatedData.getCourse_name());
			if (updatedData.getTitle() != null)
				existing.setTitle(updatedData.getTitle());
			if (updatedData.getTopic() != null)
				existing.setTopic(updatedData.getTopic());
			if (updatedData.getLink() != null)
				existing.setLink(updatedData.getLink());

			if (curriculumPdf != null && !curriculumPdf.isEmpty()) {
				String originalFileName = curriculumPdf.getOriginalFilename();

				if (!originalFileName.matches("[a-zA-Z0-9_&\\-\\s/\\.]*")) {
					return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(
							"Invalid file name. Only letters, numbers, hyphens (-), underscores (_), ampersands (&), slashes (/), dots (.), and spaces are allowed.");
				}

				String newPdfFileName = "pdfs/" + originalFileName;

				Optional<Curriculum> existingCurriculum = repo.findPdfByExactName(newPdfFileName);
				if (existingCurriculum.isPresent() && existingCurriculum.get().getCurriculum_id() != id) {
					return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("This PDF already exists.");
				}

				String oldPdfPath = existing.getCurriculum_pdf();
				if (oldPdfPath != null && !oldPdfPath.isEmpty()) {
					File oldFile = new File(uploadDir + oldPdfPath);
					if (oldFile.exists()) {
						System.out.println("Old file path: " + oldFile);
						oldFile.delete();
					}
				}

				String pdfPath = saveFile(curriculumPdf, "pdfs");

				if (pdfPath != null) {
					System.out.println("New file saved at: " + uploadDir + pdfPath);
					existing.setCurriculum_pdf(pdfPath);
				}
			}

			if (assessmentPdf != null && !assessmentPdf.isEmpty()) {
				String assessmentFileName = assessmentPdf.getOriginalFilename();

				if (!assessmentFileName.matches("[a-zA-Z0-9_&\\-\\s/\\.]*")) {
					return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(
							"Invalid assessment PDF name. Only letters, numbers, hyphens (-), underscores (_), ampersands (&), slashes (/), dots (.), and spaces are allowed.");
				}

				String newAssessmentFilePath = "pdfs/assessments/" + assessmentFileName;

				Optional<Curriculum> existingAssessment = repo.findPdfByAssessmentExactName(newAssessmentFilePath);
				if (existingAssessment.isPresent() && existingAssessment.get().getCurriculum_id() != id) {
					return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("This Assessment PDF already exists.");
				}

				String oldAssessmentPath = existing.getAssessment_pdf();
				if (oldAssessmentPath != null && !oldAssessmentPath.isEmpty()) {
					File oldFile = new File(uploadDir + oldAssessmentPath);
					if (oldFile.exists()) {
						oldFile.delete();
					}
				}

				String assessmentPath = saveFile(assessmentPdf, "pdfs/assessments");
				if (assessmentPath != null) {
					existing.setAssessment_pdf(assessmentPath);
				}
			}

			Curriculum saved = repo.save(existing);
			return ResponseEntity.ok(saved);

		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
					.body("Error updating curriculum: " + e.getMessage());
		}
	}

	@DeleteMapping("curriculum/delete/{id}")
	public ResponseEntity<String> deleteCurriculum(@PathVariable int id) {
		Optional<Curriculum> optionalCurriculum = repo.findById(id);
		if (!optionalCurriculum.isPresent()) {
			return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Curriculum not found");
		}

		Curriculum curriculum = optionalCurriculum.get();
		String curriculumPdfPath = curriculum.getCurriculum_pdf();
		if (curriculumPdfPath != null && !curriculumPdfPath.isEmpty()) {
			File curriculumPdfFile = new File(uploadDir + curriculumPdfPath);
			if (curriculumPdfFile.exists()) {
				boolean deleted = curriculumPdfFile.delete();
				if (!deleted) {
					return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
							.body("Failed to delete curriculum PDF file.");
				}
			}
		}

		String assessmentPdfPath = curriculum.getAssessment_pdf();
		if (assessmentPdfPath != null && !assessmentPdfPath.isEmpty()) {
			File assessmentPdfFile = new File(uploadDir + assessmentPdfPath);
			if (assessmentPdfFile.exists()) {
				boolean deleted = assessmentPdfFile.delete();
				if (!deleted) {
					return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
							.body("Failed to delete assessment PDF file.");
				}
			}
		}

		repo.delete(curriculum);
		return ResponseEntity.ok("Curriculum and associated PDFs deleted successfully.");
	}

	@GetMapping("/curriculum/pdfs/{filename}")
	public ResponseEntity<Resource> getPdf(@PathVariable String filename) {
		try {

			Path filePath = Paths.get(uploadDir + "pdfs/" + filename);
//			Path filePath = Paths.get(System.getProperty("user.home") + "/uploads/curriculum/pdfs/" + filename);

			if (!Files.exists(filePath)) {
				return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
			}

			Resource resource = new UrlResource(filePath.toUri());

			return ResponseEntity.ok().contentType(MediaType.APPLICATION_PDF)
					.header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + filename + "\"").body(resource);
		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
		}
	}

	@GetMapping("/curriculum/assessments/{filename}")
	public ResponseEntity<Resource> getAssessmentPdf(@PathVariable String filename) {
		try {
			Path filePath = Paths.get(uploadDir + "pdfs/assessments/" + filename);

			if (!Files.exists(filePath)) {
				return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
			}

			Resource resource = new UrlResource(filePath.toUri());

			return ResponseEntity.ok().contentType(MediaType.APPLICATION_PDF)
					.header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + filename + "\"").body(resource);
		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
		}
	}

}