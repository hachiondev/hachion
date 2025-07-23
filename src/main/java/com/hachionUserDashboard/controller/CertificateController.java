package com.hachionUserDashboard.controller;

import java.io.File;
import java.io.IOException;

import org.springframework.http.ContentDisposition;
import org.springframework.http.HttpHeaders;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.hachionUserDashboard.dto.CertificateRequest;
import com.hachionUserDashboard.entity.Certificate;
import com.hachionUserDashboard.entity.CertificateEntity;
import com.hachionUserDashboard.repository.CertificateDetailsRepository;
import com.hachionUserDashboard.repository.CertificateRepository;

import Service.CertificateService;

@RequestMapping
@CrossOrigin
//@CrossOrigin(origins ="http://localhost:3000")

@RestController
public class CertificateController {

	@Value("${upload.path}")
	private String uploadPath;

	@Autowired
	private CertificateRepository repo;

	@Autowired
	private CertificateDetailsRepository certificateRepository;

	@Autowired
	private CertificateService certificateService;

	@GetMapping("/certificate/{id}")
	public ResponseEntity<Certificate> getCertificate(@PathVariable Integer id) {
		return repo.findById(id).map(ResponseEntity::ok).orElse(ResponseEntity.status(HttpStatus.NOT_FOUND).build());
	}

	@GetMapping("/certificate")
	public List<Certificate> getAllCertificate() {
		return repo.findAll();
	}

	@PostMapping("/certificate/add")
	@ResponseStatus(code = HttpStatus.CREATED)
	public ResponseEntity<String> createCertificate(@RequestParam("certificate_image") MultipartFile file,
			@RequestParam("course_name") String course_name, @RequestParam("category_name") String category_name,
			@RequestParam("title") String title, @RequestParam("description") String description) {

		System.out.println("Upload Path: " + uploadPath);

		String fileName = System.currentTimeMillis() + "_" + file.getOriginalFilename();
		File uploadDir = new File(uploadPath);

		try {

			if (!uploadDir.exists()) {
				boolean created = uploadDir.mkdirs();
				System.out.println("Directory created: " + created);
			}

			File destinationFile = new File(uploadPath + "/" + fileName);
			file.transferTo(destinationFile);
			System.out.println("File saved to: " + destinationFile.getAbsolutePath());

			Certificate certificate = new Certificate();
			certificate.setCertificate_image("/uploads/" + fileName); // Set relative path
			certificate.setTitle(title);
			certificate.setCategory_name(category_name);
			certificate.setCourse_name(course_name);
			certificate.setDescription(description);
			repo.save(certificate);

			return ResponseEntity.status(HttpStatus.CREATED).body("Details addes successfully");
		} catch (IOException e) {
			e.printStackTrace();
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error saving file: " + e.getMessage());
		}
	}

	@PutMapping("/certificate/update/{id}")
	public ResponseEntity<Certificate> updateCertificate(@PathVariable int id,
			@RequestBody Certificate updatedCertificate) {
		return repo.findById(id).map(certificate -> {
			certificate.setCertificate_image(updatedCertificate.getCertificate_image());
			certificate.setCourse_name(updatedCertificate.getCourse_name());
			certificate.setCategory_name(updatedCertificate.getCategory_name());
			certificate.setTitle(updatedCertificate.getTitle());
			certificate.setDescription(updatedCertificate.getDescription());
			repo.save(certificate);
			return ResponseEntity.ok(certificate);
		}).orElse(ResponseEntity.status(HttpStatus.NOT_FOUND).build());
	}

//	@DeleteMapping("/certificate/delete/{id}")
//	public ResponseEntity<String> deleteCertificate(@PathVariable Long id) {
//	    Optional<CertificateEntity> optionalCertificate = certificateRepository.findById(id);
//
//	    if (optionalCertificate.isPresent()) {
//	    	certificateRepository.deleteById(id);
//	        return ResponseEntity.ok("Certificate deleted successfully");
//	    } else {
//	        return ResponseEntity.status(HttpStatus.NOT_FOUND)
//	                .body("Certificate with ID " + id + " not found");
//	    }
//	}
	
	@DeleteMapping("/certificate/delete/{id}")
	public ResponseEntity<String> deleteCertificate(@PathVariable Long id) {
	    Optional<CertificateEntity> optionalCertificate = certificateRepository.findById(id);

	    if (optionalCertificate.isPresent()) {
	        CertificateEntity certificate = optionalCertificate.get();
	        String filePath = certificate.getCertificatePath();

	        // Delete the physical file if it exists
	        File file = new File(filePath);
	        if (file.exists()) {
	            boolean deleted = file.delete();
	            if (!deleted) {
	                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
	                        .body("Failed to delete certificate file from server.");
	            }
	        }

	        // Delete the DB record
	        certificateRepository.deleteById(id);
	        return ResponseEntity.ok("Certificate deleted successfully.");
	    } else {
	        return ResponseEntity.status(HttpStatus.NOT_FOUND)
	                .body("Certificate with ID " + id + " not found.");
	    }
	}


	@PostMapping("/certificate/generate")
	public ResponseEntity<byte[]> generateCertificate(@RequestBody CertificateRequest request) {
		CertificateEntity saved = certificateService.generateCertificate(request);

		try {
			byte[] pdfBytes = Files.readAllBytes(Paths.get(saved.getCertificatePath()));

			HttpHeaders headers = new HttpHeaders();
			headers.setContentType(MediaType.APPLICATION_PDF);
			headers.setContentDisposition(
					ContentDisposition.inline().filename(saved.getStudentId() + "_Certificate.pdf").build());

			headers.add("Certificate-Id", String.valueOf(saved.getCertificateId()));

			return new ResponseEntity<>(pdfBytes, headers, HttpStatus.OK);
		} catch (IOException e) {
			e.printStackTrace();
			return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	@GetMapping("/certificate/download/{certificateId}")
	public ResponseEntity<byte[]> downloadCertificate(@PathVariable Long certificateId) {
		Optional<CertificateEntity> optional = certificateRepository.findById(certificateId);

		if (optional.isEmpty()) {
			return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
		}

		CertificateEntity certificate = optional.get();
		String filePath = certificate.getCertificatePath();

		File file = new File(filePath);
		if (!file.exists()) {
			return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
		}

		try {
			byte[] pdfBytes = Files.readAllBytes(file.toPath());

			HttpHeaders headers = new HttpHeaders();
			headers.setContentType(MediaType.APPLICATION_PDF);
			headers.setContentDisposition(
					ContentDisposition.attachment().filename(certificate.getStudentId() + "_Certificate.pdf").build());

			return new ResponseEntity<>(pdfBytes, headers, HttpStatus.OK);
		} catch (IOException e) {
			e.printStackTrace();
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
		}
	}
	
	@GetMapping("/certificate/downloadForView/{certificateId}")
	public ResponseEntity<byte[]> downloadCertificateForView(@PathVariable Long certificateId) {
		Optional<CertificateEntity> optional = certificateRepository.findById(certificateId);

		if (optional.isEmpty()) {
			return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
		}

		CertificateEntity certificate = optional.get();
		String filePath = certificate.getCertificatePath();

		File file = new File(filePath);
		if (!file.exists()) {
			return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
		}

		try {
			byte[] pdfBytes = Files.readAllBytes(file.toPath());

			HttpHeaders headers = new HttpHeaders();
			headers.setContentType(MediaType.APPLICATION_PDF);
			headers.setContentDisposition(
					ContentDisposition.inline().filename(certificate.getStudentId() + "_Certificate.pdf").build());

			return new ResponseEntity<>(pdfBytes, headers, HttpStatus.OK);
		} catch (IOException e) {
			e.printStackTrace();
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
		}
	}

	@PostMapping("/certificate/send-email/{certificateId}")
	public ResponseEntity<String> sendCertificateEmail(@PathVariable Long certificateId) {
		try {
			certificateService.sendCertificateByEmail(certificateId);
			return ResponseEntity.ok("Certificate sent successfully!");
		} catch (Exception e) {
			e.printStackTrace();
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to send email.");
		}
	}

	@GetMapping("/certificate/all")
	public ResponseEntity<List<CertificateEntity>> getAllCertificates() {
		List<CertificateEntity> certificates = certificateService.getAllCertificates();
		return new ResponseEntity<>(certificates, HttpStatus.OK);
	}

//	@GetMapping("/download/filename/{fileName}")
//	public ResponseEntity<byte[]> downloadByFileName(@PathVariable String fileName) {
//		String filePath = "certificates/" + fileName;
//
//		File file = new File(filePath);
//		if (!file.exists()) {
//			return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
//		}
//
//		try {
//			byte[] pdfBytes = Files.readAllBytes(file.toPath());
//
//			HttpHeaders headers = new HttpHeaders();
//			headers.setContentType(MediaType.APPLICATION_PDF);
//			headers.setContentDisposition(ContentDisposition.inline().filename(fileName).build());
//
//			return new ResponseEntity<>(pdfBytes, headers, HttpStatus.OK);
//		} catch (IOException e) {
//			e.printStackTrace();
//			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
//		}
//	}

	@GetMapping("/certificate/byname/{studentName}")
	public ResponseEntity<List<CertificateEntity>> getByStudentName(@PathVariable String studentName) {
		List<CertificateEntity> certificates = certificateService.getCertificatesByStudentName(studentName);

		if (certificates.isEmpty()) {
			return ResponseEntity.status(HttpStatus.NOT_FOUND).body(certificates);
		}

		return ResponseEntity.ok(certificates);
	}
	

}