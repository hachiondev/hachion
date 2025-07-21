package com.hachionUserDashboard.controller;

import java.io.File;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.hachionUserDashboard.dto.ApplyJobDetailsRequest;
import com.hachionUserDashboard.dto.ApplyJobDetailsResponse;
import com.hachionUserDashboard.entity.ApplyJobDetails;
import com.hachionUserDashboard.repository.ApplyJobDetailsRepository;

import Service.ApplyJobDetailsService;

@RestController
@RequestMapping("/apply-job")
public class ApplyJobDetailsController {

	@Autowired
	private ApplyJobDetailsService applyJobDetailsService;

	@Value("${applyjob.resume.upload.dir}")
	private String resumeUploadDir;

	@Autowired
	private ApplyJobDetailsRepository applyJobDetailsRepository;

	@PostMapping("/create")
	public ResponseEntity<ApplyJobDetailsResponse> createApplyJob(@RequestPart("data") ApplyJobDetailsRequest request,
			@RequestPart("resume") MultipartFile resumeFile) {

		ApplyJobDetailsResponse response = applyJobDetailsService.createApplyJobDetails(request, resumeFile);
		return ResponseEntity.status(HttpStatus.CREATED).body(response);
	}

	@GetMapping("/getAll")
	public ResponseEntity<List<ApplyJobDetailsResponse>> getAllApplyJobs() {
		List<ApplyJobDetailsResponse> responses = applyJobDetailsService.getAllApplyJobDetails();
		return ResponseEntity.ok(responses);
	}

	@DeleteMapping("/delete/{id}")
	public ResponseEntity<String> deleteApplyJob(@PathVariable("id") Long id) {
	    applyJobDetailsService.deleteApplyJobDetails(id);
	    return ResponseEntity.ok("Apply job has been successfully deleted.");
	}
	@GetMapping("/downloadResume")
	public ResponseEntity<Resource> downloadResume(@RequestParam String jobId, @RequestParam String email,
			@RequestParam String resumeFileName) {

		ApplyJobDetails details = applyJobDetailsRepository.findByEmailAndResumeAndJobId(email, resumeFileName, jobId);
		if (details == null) {
			return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
		}

		Path path = Paths.get(resumeUploadDir + File.separator + details.getResume());
		if (!Files.exists(path)) {
			return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
		}

		try {
			Resource resource = new UrlResource(path.toUri());
			String contentDisposition = "inline; filename=\"" + details.getResume() + "\"";
			return ResponseEntity.ok().contentType(MediaType.APPLICATION_PDF)
					.header(HttpHeaders.CONTENT_DISPOSITION, contentDisposition).body(resource);
		} catch (MalformedURLException e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
		}
	}

}
