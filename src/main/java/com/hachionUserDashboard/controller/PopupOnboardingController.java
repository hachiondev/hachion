package com.hachionUserDashboard.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.hachionUserDashboard.dto.PopupOnboardingRequest;
import com.hachionUserDashboard.dto.PopupOnboardingResponse;

import Service.PopupOnboardingService;

import java.util.List;

@RestController
@RequestMapping("/popup-onboarding")
public class PopupOnboardingController {

	@Autowired
	private PopupOnboardingService popupOnboardingService;

	@PostMapping
	public ResponseEntity<PopupOnboardingResponse> createPopupOnboarding(@RequestBody PopupOnboardingRequest request) {
		PopupOnboardingResponse response = popupOnboardingService.createPopupOnboarding(request);
		return ResponseEntity.ok(response);
	}


	@GetMapping("/get-by-email/{email}")
	public ResponseEntity<PopupOnboardingResponse> getPopupOnboardingByEmail(@PathVariable String email) {
		PopupOnboardingResponse response = popupOnboardingService.findByStudentEmail(email);
		return ResponseEntity.ok(response);
	}

	@PutMapping("/update-by-email")
	public ResponseEntity<PopupOnboardingResponse> updatePopupOnboarding(@RequestBody PopupOnboardingRequest request) {

		PopupOnboardingResponse response = popupOnboardingService.updatePopupOnboarding(request);
		return ResponseEntity.ok(response);
	}

	@DeleteMapping("/{id}")
	public ResponseEntity<String> deletePopupOnboarding(@PathVariable Long id) {
		popupOnboardingService.deletePopupOnboarding(id);
		return ResponseEntity.ok("Successfully deleted PopupOnboarding");
	}

	@GetMapping("/getAllOnboarding")
	public ResponseEntity<List<PopupOnboardingResponse>> getAllPopupOnboardings() {
		List<PopupOnboardingResponse> list = popupOnboardingService.getAllPopupOnboardings();
		return ResponseEntity.ok(list);
	}
}