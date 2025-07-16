package com.hachionUserDashboard.controller;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.MediaType;
import org.springframework.http.MediaTypeFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.hachionUserDashboard.dto.HireFromUsRequest;
import com.hachionUserDashboard.dto.HireFromUsResponse;

import Service.HireFromUsService;

@RestController
@RequestMapping("/hire-from-us")
public class HireFromUsController {

	@Autowired
	private HireFromUsService hireFromUsService;
	

//	private static final String UPLOAD_DIR = "D:/HachionBackendCode/hachion/uploads/";
	@Value("${hirefromus.upload-dir}")
	private String uploadDir;

	@PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
	public ResponseEntity<HireFromUsResponse> createHireFromUs(@RequestPart("data") HireFromUsRequest request,
			@RequestPart("companyLogo") MultipartFile companyLogo) {

		String originalFilename = saveCompanyLogoWithOriginalName(companyLogo);
		request.setCompanyLogo(originalFilename);

		HireFromUsResponse response = hireFromUsService.createHireFromUs(request);
		return ResponseEntity.ok(response);
	}

	@GetMapping
	public ResponseEntity<List<HireFromUsResponse>> getAllHireFromUs() {
		List<HireFromUsResponse> responseList = hireFromUsService.getAllHireFromUs();
		return ResponseEntity.ok(responseList);
	}
	
	  @GetMapping("/{filename:.+}")
	    public ResponseEntity<Resource> getFile(@PathVariable String filename) {
	        try {
	            Path filePath = Paths.get(uploadDir).resolve(filename).normalize();
	            Resource resource = new UrlResource(filePath.toUri());

	            if (!resource.exists() || !resource.isReadable()) {
	                return ResponseEntity.notFound().build();
	            }

	            return ResponseEntity.ok()
	                    .contentType(MediaTypeFactory.getMediaType(resource)
	                        .orElse(MediaType.APPLICATION_OCTET_STREAM))
	                    .body(resource);

	        } catch (Exception e) {
	            return ResponseEntity.internalServerError().build();
	        }
	    }
	private String saveCompanyLogoWithOriginalName(MultipartFile file) {
		if (file.isEmpty()) {
			throw new RuntimeException("Uploaded file is empty.");
		}

		try {

			File dir = new File(uploadDir);
			if (!dir.exists()) {
				dir.mkdirs();
			}

			String originalFilename = file.getOriginalFilename();
			Path filePath = Paths.get(uploadDir + originalFilename);

			Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

			return originalFilename;
		} catch (IOException e) {
			throw new RuntimeException("Failed to save file: " + e.getMessage(), e);
		}
	}
}
