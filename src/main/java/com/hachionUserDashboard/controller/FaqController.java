package com.hachionUserDashboard.controller;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.hachionUserDashboard.entity.Faq;
import com.hachionUserDashboard.repository.FaqRepository;

import jakarta.annotation.PostConstruct;

@CrossOrigin
@RestController
public class FaqController {

	@Autowired
	private FaqRepository repo;

	@Value("${file.upload-dir}")
	private String upload;

	private String uploadDir;

	@PostConstruct
	public void initUploadDir() {
		this.uploadDir = upload + "faq/";
	}

	@GetMapping("/faq/{id}")
	public ResponseEntity<Faq> getFaq(@PathVariable Integer id) {
		return repo.findById(id).map(ResponseEntity::ok).orElse(ResponseEntity.status(HttpStatus.NOT_FOUND).build());
	}

	@GetMapping("/faq")
	public List<Faq> getAllFaq() {
		return repo.findAll();
	}

//	private final String uploadDir = upload + "faq/";

	private String saveFile(MultipartFile file, String subFolder) throws IOException {
		if (file != null && !file.isEmpty()) {
			System.out.println("Saving file: " + file.getOriginalFilename());
			File directory = new File(uploadDir + subFolder);
			if (!directory.exists()) {
				directory.mkdirs();
			}

			Path filePath = Paths.get(directory.getAbsolutePath(), file.getOriginalFilename());
			System.out.println("in save file path" + filePath);
			Files.write(filePath, file.getBytes());
			return subFolder + "/" + file.getOriginalFilename();
		}
		return null;
	}

	@PostMapping("faq/add")
	public ResponseEntity<?> addFaq(@RequestPart("faqData") String faqData,
			@RequestPart(value = "faqPdf", required = false) MultipartFile faqPdf) {
		try {
			ObjectMapper objectMapper = new ObjectMapper();
			objectMapper.registerModule(new JavaTimeModule());
			Faq faq = objectMapper.readValue(faqData, Faq.class);
			System.out.println("Upload path :" + uploadDir);

			if (faqPdf != null && !faqPdf.isEmpty()) {
				String originalFileName = faqPdf.getOriginalFilename();
				if (!originalFileName.matches("[a-zA-Z0-9_&\\-\\s/\\.]*")) {
					return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(
							"Invalid file name. Only letters, numbers, hyphens (-), underscores (_), ampersands (&), slashes (/), dots (.), and spaces are allowed.");
				}

				String normalizedPdfName = "pdfs/" + originalFileName;
				Optional<Faq> existingFaq = repo.findPdfByExactName(normalizedPdfName);
				if (existingFaq.isPresent()) {
					return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("This PDF already exists.");
				}

				String pdfPath = saveFile(faqPdf, "pdfs");

				faq.setFaq_pdf(pdfPath != null ? pdfPath : "");
			} else {
				faq.setFaq_pdf("");
			}

			Faq savedFaq = repo.save(faq);
			return ResponseEntity.status(HttpStatus.CREATED).body(savedFaq);
		} catch (Exception e) {
			e.printStackTrace();
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
		}
	}

	@PutMapping(value = "/faq/update/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
	public ResponseEntity<?> updateFaq(@PathVariable int id, @RequestPart("faqData") String faqData,
			@RequestPart(value = "faqPdf", required = false) MultipartFile faqPdf) {
		try {
			Optional<Faq> optionalFaq = repo.findById(id);
			if (!optionalFaq.isPresent()) {
				return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Faq not found");
			}

			Faq existing = optionalFaq.get();

			ObjectMapper objectMapper = new ObjectMapper();
			objectMapper.registerModule(new JavaTimeModule());
			Faq updatedData = objectMapper.readValue(faqData, Faq.class);

			if (updatedData.getCategory_name() != null)
				existing.setCategory_name(updatedData.getCategory_name());
			if (updatedData.getCourse_name() != null)
				existing.setCourse_name(updatedData.getCourse_name());
			if (updatedData.getFaq_title() != null)
				existing.setFaq_title(updatedData.getFaq_title());
			if (updatedData.getDescription() != null)
				existing.setDescription(updatedData.getDescription());

			System.out.println("EC2 Instance Upload Path: " + uploadDir);

			if (faqPdf != null && !faqPdf.isEmpty()) {
				String originalFileName = faqPdf.getOriginalFilename();
				if (!originalFileName.matches("[a-zA-Z0-9_&\\-\\s/\\.]*")) {
					return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(
							"Invalid file name. Only letters, numbers, hyphens (-), underscores (_), ampersands (&), slashes (/), dots (.), and spaces are allowed.");
				}

				String normalizedPdfName = "pdfs/" + originalFileName;

				Optional<Faq> existingFaqWithSamePdf = repo.findPdfByExactName(normalizedPdfName);
				if (existingFaqWithSamePdf.isPresent() && existingFaqWithSamePdf.get().getFaq_id() != id) {
					return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("This PDF already exists.");
				}

				String oldPdfPath = existing.getFaq_pdf();
				if (oldPdfPath != null && !oldPdfPath.isEmpty()) {
					File oldFile = new File(uploadDir + oldPdfPath);

					if (oldFile.exists()) {
						boolean deleted = oldFile.delete();
						System.out.println("Old file deleted: " + deleted);
					} else {
						System.out.println("Old file not found at: " + oldFile.getAbsolutePath());
					}
				}

				String pdfPath = saveFile(faqPdf, "pdfs");
				if (pdfPath != null) {
					System.out.println("New file saved at: " + uploadDir + pdfPath);
					existing.setFaq_pdf(pdfPath);
				}
			}

			Faq saved = repo.save(existing);
			return ResponseEntity.ok(saved);

		} catch (Exception e) {
			e.printStackTrace();
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
					.body("Error updating faq: " + e.getMessage());
		}
	}

	@PostMapping("/faq/delete")
	public ResponseEntity<String> deleteMultipleFaqs(@RequestBody List<Integer> ids) {
	    List<String> failedDeletes = new ArrayList<>();

	    for (Integer id : ids) {
	        Optional<Faq> optionalFaq = repo.findById(id);
	        if (!optionalFaq.isPresent()) {
	            failedDeletes.add("FAQ with ID " + id + " not found.");
	            continue;
	        }

	        Faq faq = optionalFaq.get();
	        String pdfFileName = faq.getFaq_pdf();
	        if (pdfFileName != null && !pdfFileName.trim().isEmpty()) {
	            String filePath = uploadDir + pdfFileName;
	            File file = new File(filePath);
	            if (file.exists() && !file.delete()) {
	                failedDeletes.add("Failed to delete PDF for ID " + id);
	                continue;
	            }
	        }

	        repo.delete(faq);
	    }

	    if (!failedDeletes.isEmpty()) {
	        return ResponseEntity.status(HttpStatus.MULTI_STATUS)
	                .body("Some deletions failed:\n" + String.join("\n", failedDeletes));
	    }

	    return ResponseEntity.ok("All selected FAQs deleted successfully.");
	}



	@GetMapping("/faq/pdf/{filename}")
	public ResponseEntity<Resource> getPdf(@PathVariable String filename) {
		try {

//			Path filePath = Paths.get(System.getProperty("user.home") + "/uploads/faq/pdfs/" + filename);
			Path filePath = Paths.get(uploadDir + "pdfs/" + filename);

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