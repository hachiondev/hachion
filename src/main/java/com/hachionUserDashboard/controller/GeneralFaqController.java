package com.hachionUserDashboard.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.hachionUserDashboard.dto.GeneralFaqRequest;
import com.hachionUserDashboard.dto.GeneralFaqResponse;

import Service.GeneralFaqService;

import java.util.List;

@RestController
@RequestMapping("/general-faq")
public class GeneralFaqController {

	@Autowired
	private GeneralFaqService service;

	@GetMapping
	public List<GeneralFaqResponse> getAll() {
		return service.getAll();
	}

	@GetMapping("/{id}")
	public GeneralFaqResponse getById(@PathVariable Long id) {
		return service.getById(id);
	}

	@PostMapping(value = "/add", consumes = MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity<GeneralFaqResponse> add(@RequestBody GeneralFaqRequest body) {
		GeneralFaqResponse saved = service.create(body);
		return ResponseEntity.status(HttpStatus.CREATED).body(saved);
	}

	@PutMapping(value = "/update/{id}", consumes = MediaType.APPLICATION_JSON_VALUE)
	public GeneralFaqResponse update(@PathVariable Long id, @RequestBody GeneralFaqRequest body) {
		return service.update(id, body);
	}

	@PostMapping("/delete")
	public ResponseEntity<Void> delete(@RequestBody List<Long> ids) {
		service.deleteByIds(ids);
		return ResponseEntity.ok().build();
	}
}