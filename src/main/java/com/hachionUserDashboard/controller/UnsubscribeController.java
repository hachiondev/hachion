package com.hachionUserDashboard.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.hachionUserDashboard.dto.UnsubscribeRequest;
import com.hachionUserDashboard.dto.UnsubscribeResponse;

import Service.UnsubscribeService;
import org.springframework.web.bind.annotation.RequestBody;

@RestController
@RequestMapping("/unsubscribe")
public class UnsubscribeController {

	@Autowired
	public UnsubscribeService unsubscribeService;

	@PostMapping
	public ResponseEntity<?> createUnsubscribeDetails(@RequestBody UnsubscribeRequest unsubscribeRequest) {
		UnsubscribeResponse unsubscribeDetailsResponse = unsubscribeService
				.createUnsubscribeDetails(unsubscribeRequest);

		return ResponseEntity.ok(unsubscribeDetailsResponse);
	}

	@GetMapping
	public ResponseEntity<List<UnsubscribeResponse>> getAllUnsubscribeDetails() {

		List<UnsubscribeResponse> allUnsubscribeDetails = unsubscribeService.getAllUnsubscribeDetails();
		return ResponseEntity.ok(allUnsubscribeDetails);

	}

	@DeleteMapping("/{id}")
	public ResponseEntity<String> deleteUnsubscribe(@PathVariable("id") Long id) {
		unsubscribeService.deleteUnsubscribeDetails(id);
		return ResponseEntity.ok("Unsubscribe entry with ID " + id + " deleted successfully.");
	}

}
