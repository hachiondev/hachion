package com.hachionUserDashboard.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.hachionUserDashboard.dto.FaqQueryRequest;
import com.hachionUserDashboard.dto.FaqQueryResponse;

import Service.FaqQueryService;

import java.util.List;

@RestController
@RequestMapping("/faq-queries")
public class FaqQueryController {

	@Autowired
	private FaqQueryService faqQueryService;

	
	@PostMapping
	public ResponseEntity<FaqQueryResponse> create(@RequestBody FaqQueryRequest request) {
		return ResponseEntity.ok(faqQueryService.create(request));
	}

	
	@PutMapping("/{id}")
	public ResponseEntity<FaqQueryResponse> update(@PathVariable Long id, @RequestBody FaqQueryRequest request) {
		return ResponseEntity.ok(faqQueryService.update(id, request));
	}

	
	@GetMapping("/{id}")
	public ResponseEntity<FaqQueryResponse> get(@PathVariable Long id) {
		return ResponseEntity.ok(faqQueryService.get(id));
	}

	
	@GetMapping
	public ResponseEntity<List<FaqQueryResponse>> getAll() {
		return ResponseEntity.ok(faqQueryService.getAll());
	}

	
	@DeleteMapping("/{id}")
	public ResponseEntity<Void> delete(@PathVariable Long id) {
		faqQueryService.delete(id);
		return ResponseEntity.noContent().build();
	}
}