package com.hachionUserDashboard.service;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.hachionUserDashboard.entity.InstructorApplication;
import com.hachionUserDashboard.repository.InstructorApplicationRepository;

import Service.InstructorApplicationService;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class InstructorApplicationServiceImpl implements InstructorApplicationService {

	@Autowired
	private InstructorApplicationRepository repo;

	private final ObjectMapper mapper = new ObjectMapper().registerModule(new JavaTimeModule());

	@Value("${file.upload.instructor.resume.path}")
	private String resumeUploadPath;

	private String saveResume(MultipartFile file) throws IOException {
		if (file == null || file.isEmpty())
			return null;

		File dir = new File(resumeUploadPath);
		if (!dir.exists())
			dir.mkdirs();

		String original = Path.of(file.getOriginalFilename()).getFileName().toString();
		String cleanName = original.replaceAll("[\\s]+", "_");

		Path path = Paths.get(dir.getAbsolutePath(), cleanName);

		int counter = 1;
		while (Files.exists(path)) {
			int dotIndex = cleanName.lastIndexOf('.');
			String namePart = (dotIndex == -1) ? cleanName : cleanName.substring(0, dotIndex);
			String extPart = (dotIndex == -1) ? "" : cleanName.substring(dotIndex);
			String newName = namePart + "_" + counter + extPart;
			path = Paths.get(dir.getAbsolutePath(), newName);
			counter++;
		}

		Files.write(path, file.getBytes());
		return "resumes/" + path.getFileName().toString();
	}

	private void deleteResumeIfExists(String storedPath) throws IOException {
		if (storedPath == null || storedPath.isBlank())
			return;

		String fileOnly = storedPath.replaceFirst("^resumes/", "");
		Path full = Paths.get(resumeUploadPath).resolve(fileOnly).normalize();
		Files.deleteIfExists(full);
	}

	@Override
	public InstructorApplication create(String json, MultipartFile resume) throws IOException {
		InstructorApplication app = mapper.readValue(json, InstructorApplication.class);

		if (resume != null && !resume.isEmpty()) {
			String saved = saveResume(resume);
			if (saved == null)
				throw new IOException("Failed to save resume");
			app.setResumePath(saved);
		} else {

			app.setResumePath("");
		}

		return repo.save(app);
	}

	@Override
	public Optional<InstructorApplication> get(Integer id) {
		return repo.findById(id);
	}

	@Override
	public List<InstructorApplication> getAll() {
		return repo.findAll();
	}

	@Override
	public void delete(Integer id) throws IOException {
		repo.findById(id).ifPresentOrElse(app -> {
			try {
				deleteResumeIfExists(app.getResumePath());
				repo.delete(app);
			} catch (IOException e) {
				throw new RuntimeException(e);
			}
		}, () -> {
			throw new IllegalArgumentException("InstructorApplication not found: " + id);
		});
	}

	@Override
	public byte[] getResumeBytes(String filename) throws IOException {
		Path file = Paths.get(resumeUploadPath).resolve(filename).normalize();
		return Files.readAllBytes(file);
	}

	@Override
	public String getResumeContentType(String filename) throws IOException {
		Path file = Paths.get(resumeUploadPath).resolve(filename).normalize();
		String contentType = Files.probeContentType(file);
		return contentType != null ? contentType : "application/octet-stream";
	}
}