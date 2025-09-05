package com.hachionUserDashboard.controller;

import java.util.List;

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
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.hachionUserDashboard.entity.SummerEvents;
import com.hachionUserDashboard.repository.SummerEventsRepository;

@CrossOrigin
@RestController
public class SummerEventsController {

	@Autowired
	private SummerEventsRepository repo;

	@GetMapping("/summerevents/{id}")
	public ResponseEntity<SummerEvents> getSummerEvents(@PathVariable Integer id) {
		return repo.findById(id).map(ResponseEntity::ok).orElse(ResponseEntity.status(HttpStatus.NOT_FOUND).build());
	}

	@GetMapping("/summerevents")
	public List<SummerEvents> getAllSummerEvents() {
		return repo.findAll();
	}

	@PostMapping("/summerevents/add")
	@ResponseStatus(code = HttpStatus.CREATED)
	public ResponseEntity<String> createsSummerEvents(@RequestBody SummerEvents summerEvents) {
		repo.save(summerEvents);
		return ResponseEntity.status(HttpStatus.CREATED).body("Summer events course added successfully.");
	}

	@PutMapping("/summerevents/update/{id}")
	public ResponseEntity<SummerEvents> updatedSummerEvents(@PathVariable int id,
			@RequestBody SummerEvents updatedSummerEvents) {
		return repo.findById(id).map(summerevents -> {
			summerevents.setCategory_name(updatedSummerEvents.getCategory_name());
			summerevents.setCourse_name(updatedSummerEvents.getCourse_name());
			summerevents.setStatus(updatedSummerEvents.isStatus());

			repo.save(summerevents);
			return ResponseEntity.ok(summerevents);
		}).orElse(ResponseEntity.status(HttpStatus.NOT_FOUND).build());
	}

	@DeleteMapping("summerevents/delete/{id}")
	public ResponseEntity<?> deleteSummerEvents(@PathVariable int id) {
		SummerEvents summerEvents = repo.findById(id).get();
		repo.delete(summerEvents);
		return null;

	}
}