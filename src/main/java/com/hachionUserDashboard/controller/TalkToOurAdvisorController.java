package com.hachionUserDashboard.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.hachionUserDashboard.dto.TalkToOurAdvisorRequest;
import com.hachionUserDashboard.service.WebhookSenderService;

import Response.TalkToOurAdvisorResponse;
import Service.TalkToOurAdvisorServiceInterface;

// Was @CrossOrigin(origins = { "http://localhost:3000" }) - a class-level
// annotation restricting CORS on every /advisors endpoint to just the local
// dev frontend. Empirically (curl preflight + POST with
// Origin: https://www.hachion.co) the global CorsConfig bean's wider origin
// list still won for this controller in this Spring Boot version, so it was
// not actually blocking production traffic - but it's misleading dead
// config that contradicts CorsConfig.java's allowed-origins list and is a
// latent risk on any Spring/Spring Security upgrade. Removed so this
// controller relies on the single global CORS source of truth.
@RestController
@RequestMapping("/advisors")
public class TalkToOurAdvisorController {

	@Autowired
	private TalkToOurAdvisorServiceInterface service;

	@Autowired
	private WebhookSenderService webhookSenderService;

	@PostMapping
	public ResponseEntity<TalkToOurAdvisorResponse> createAdvisor(@RequestBody TalkToOurAdvisorRequest request) {
		System.out.println("Backend" + request);
		TalkToOurAdvisorResponse response = service.createTalkToOurAdvisor(request);
		webhookSenderService.sendCorporateTrainingLead(request);
		return ResponseEntity.ok(response);
	}

	@GetMapping
	public ResponseEntity<List<TalkToOurAdvisorResponse>> getAllAdvisors() {
		List<TalkToOurAdvisorResponse> responses = service.getAllTalkToOurAdvisor();
		return ResponseEntity.ok(responses);
	}

	@GetMapping("/{id}")
	public ResponseEntity<TalkToOurAdvisorResponse> getAdvisorById(@PathVariable Long id) {
		Optional<TalkToOurAdvisorResponse> advisorResponse = service.getById(id);
		return advisorResponse.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
	}

	@DeleteMapping("/{id}")
	public ResponseEntity<String> deleteAdvisor(@PathVariable Long id) {
		String responseMessage = service.deleteTalkToAdvisor(id);
		return ResponseEntity.ok(responseMessage);
	}
}
