package com.hachionUserDashboard.controller;

import java.util.List;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.server.ResponseStatusException;

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

	private static final Logger log = LoggerFactory.getLogger(UnsubscribeController.class);

	private static final String GENERIC_ERROR = "We couldn't process your unsubscribe request. Please try again.";

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

	// Controller-local handlers take precedence over the app-wide
	// GlobalExceptionHandler, whose catch-all turned every exception here into a
	// 400 whose body was the raw ex.getMessage() (e.g. `404 NOT_FOUND "..."` for
	// business errors, and internal/SQL text for real failures). These return the
	// real status code with only a message we wrote ourselves.
	@ExceptionHandler(ResponseStatusException.class)
	public ResponseEntity<Map<String, String>> handleStatus(ResponseStatusException ex) {
		String message = ex.getReason() != null ? ex.getReason() : GENERIC_ERROR;
		return ResponseEntity.status(ex.getStatusCode()).body(Map.of("status", "ERROR", "message", message));
	}

	@ExceptionHandler(HttpMessageNotReadableException.class)
	public ResponseEntity<Map<String, String>> handleUnreadable(HttpMessageNotReadableException ex) {
		return ResponseEntity.badRequest()
				.body(Map.of("status", "ERROR", "message", "Invalid unsubscribe request. Please check your details."));
	}

	@ExceptionHandler(Exception.class)
	public ResponseEntity<Map<String, String>> handleUnexpected(Exception ex) {
		log.error("Unexpected error in /unsubscribe", ex);
		return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
				.body(Map.of("status", "ERROR", "message", GENERIC_ERROR));
	}

}
