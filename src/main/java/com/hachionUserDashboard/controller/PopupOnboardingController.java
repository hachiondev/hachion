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

	@PutMapping("/{id}")
	public ResponseEntity<PopupOnboardingResponse> updatePopupOnboarding(@PathVariable Long id,
			@RequestBody PopupOnboardingRequest request) {
		request.setPopupOnboardingId(id); // ensure id is set
		PopupOnboardingResponse response = popupOnboardingService.updatePopupOnboarding(request);
		return ResponseEntity.ok(response);
	}

	@GetMapping
	public ResponseEntity<List<PopupOnboardingResponse>> getAllPopupOnboarding() {
		List<PopupOnboardingResponse> responses = popupOnboardingService.getAllPopupOnboarding();
		return ResponseEntity.ok(responses);
	}

	@DeleteMapping("/{id}")
	public ResponseEntity<String> deletePopupOnboarding(@PathVariable Long id) {
		popupOnboardingService.deletePopupOnboarding(id);
		return ResponseEntity.ok("Successfully deleted PopupOnboarding");
	}
	
	@PutMapping("/update-by-email")
    public ResponseEntity<PopupOnboardingResponse> updatePopupOnboardingByEmail(
            @RequestBody PopupOnboardingRequest request) {

        if (request.getStudentEmail() == null || request.getStudentEmail().isBlank()) {
            return ResponseEntity.badRequest().build();
        }

        PopupOnboardingResponse response = popupOnboardingService
                .updatePopupOnboardingByEmail(request.getStudentEmail(), request);

        return ResponseEntity.ok(response);
    }

}