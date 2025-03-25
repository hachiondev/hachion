package com.hachionUserDashboard.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.hachionUserDashboard.dto.WorkshopRequest;
import com.hachionUserDashboard.exception.ResourceNotFoundException;

import Response.WorkshopResponse;
import Service.WorkshopServiceInterface;

@CrossOrigin
@RestController
@RequestMapping("/workshops")
public class WorkshopController {

	@Autowired
	private WorkshopServiceInterface workshopService;

	@PostMapping
	public ResponseEntity<WorkshopResponse> createWorkshop(@RequestBody WorkshopRequest workshopRequest) {
		WorkshopResponse response = workshopService.createWorkshop(workshopRequest);
		return ResponseEntity.status(HttpStatus.CREATED).body(response);
	}

	@GetMapping("/{workshopId}")
	public ResponseEntity<WorkshopResponse> getWorkshopById(@PathVariable Long workshopId) {
		Optional<WorkshopResponse> response = workshopService.getByWorkshopId(workshopId);
		return response.map(ResponseEntity::ok)
				.orElseThrow(() -> new ResourceNotFoundException("Workshop not found with ID: " + workshopId));
	}

	@GetMapping
	public ResponseEntity<List<WorkshopResponse>> getAllWorkshops() {
		List<WorkshopResponse> responses = workshopService.getFindByAllWorkshops();
		return ResponseEntity.ok(responses);
	}

	@PutMapping("/{id}")
	public ResponseEntity<WorkshopResponse> updateWorkshop(@PathVariable Long id, // Now expecting a Long
			@RequestBody WorkshopRequest workshopRequest) {

		workshopRequest.setWorkshopId(id);

		WorkshopResponse response = workshopService.updateWorkshop(workshopRequest);
		return ResponseEntity.ok(response);
	}

	@DeleteMapping("/{workshopId}")
	public ResponseEntity<?> deleteWorkshop(@PathVariable Long workshopId) {
		workshopService.deleteById(workshopId);
		return ResponseEntity.ok("Successfully deleted workshop");
	}

//	@PostMapping("/submit")
//	public ResponseEntity<?> userWorkshopRegistration(@RequestBody WorkshopRequest formRequest) {
//		try {
//			WorkshopResponse userWorkshopRegistration = workshopService.userWorkshopRegistration(formRequest);
//			return ResponseEntity.ok(userWorkshopRegistration);
//		} catch (MessagingException e) {
//			return ResponseEntity.status(500).body("Error sending email: " + e.getMessage());
//		}
//	}

//	@GetMapping("/users-workshop")
//	public List<Workshop> getAllUsers() {
//		return workshopService.getAllUsers();
//	}
}
