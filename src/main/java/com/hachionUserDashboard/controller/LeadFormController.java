package com.hachionUserDashboard.controller;

import com.hachionUserDashboard.dto.LeadFormRequest;
import com.hachionUserDashboard.dto.LeadFormResponse;

import Service.LeadFormService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/leadform")
public class LeadFormController {

	@Autowired
	private LeadFormService leadFormService;

	@PostMapping
	public ResponseEntity<LeadFormResponse> createLead(@RequestBody LeadFormRequest leadFormRequest) {
		LeadFormResponse response = leadFormService.createLeadForm(leadFormRequest);
		return new ResponseEntity<>(response, HttpStatus.CREATED);
	}

	@GetMapping
	public ResponseEntity<List<LeadFormResponse>> getAllLeads() {
		List<LeadFormResponse> leadForms = leadFormService.getAllLeadFormDetails();
		return ResponseEntity.ok(leadForms);
	}

	@DeleteMapping("/{leadFormId}")
	public ResponseEntity<String> deleteLead(@PathVariable Long leadFormId) {
		leadFormService.deleteLeadForm(leadFormId);
		return ResponseEntity.ok("Lead form with ID " + leadFormId + " deleted successfully.");
	}

	@PutMapping
	public ResponseEntity<LeadFormResponse> updateLead(@RequestBody LeadFormRequest leadFormRequest) {
		LeadFormResponse updated = leadFormService.updateLeadForm(leadFormRequest);
		return ResponseEntity.ok(updated);
	}
}
