package com.hachionUserDashboard.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.hachionUserDashboard.dto.JobApplicationRequestAboutUs;
import com.hachionUserDashboard.dto.JobApplicationResponseAboutUs;
import com.hachionUserDashboard.service.JobApplicationService;

@RestController
public class JobApplicationController {

	@Autowired
	private JobApplicationService jobApplicationService;

	@PostMapping(value = "/job-application-aboutus", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
	public ResponseEntity<JobApplicationResponseAboutUs> createJobApplication(

			@RequestPart("data") JobApplicationRequestAboutUs request, @RequestPart("resume") MultipartFile resume) {

		JobApplicationResponseAboutUs response = jobApplicationService.createJobApplication(request, resume);

		return ResponseEntity.ok(response);
	}

	@GetMapping("/job-application-aboutus")
	public ResponseEntity<List<JobApplicationResponseAboutUs>> getAllApplications() {

		List<JobApplicationResponseAboutUs> applications = jobApplicationService.getAllApplications();

		return ResponseEntity.ok(applications);
	}
	@DeleteMapping("/job-application-aboutus/{id}")
	public ResponseEntity<String> deleteJobApplication(@PathVariable Long id) {

		jobApplicationService.deleteJobApplication(id);

		return ResponseEntity.ok("Job application deleted successfully");
	}
}
