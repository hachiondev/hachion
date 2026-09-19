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
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.hachionUserDashboard.dto.KidsSummerTrainingRequest;

import Response.KidsSummerTrainingResponse;
import Service.KidsSummerTrainingServiceInterface;


@RestController
@CrossOrigin
@RequestMapping("/kids-summer-training")
public class KidsSummerTrainingController {

	@Autowired
	private KidsSummerTrainingServiceInterface kidsSummerTrainingServiceInterface;

	@PostMapping
	public ResponseEntity<KidsSummerTrainingResponse> addKidsSummerTrainingDetails(
			@RequestBody KidsSummerTrainingRequest kidsSummerTrainingRequest) {

		KidsSummerTrainingResponse response = kidsSummerTrainingServiceInterface
				.addKidsSummerTrainingDetails(kidsSummerTrainingRequest);

		return new ResponseEntity<>(response, HttpStatus.CREATED);
	}

	@PutMapping("/{id}")
	public ResponseEntity<KidsSummerTrainingResponse> updateKidsSummerTrainingDetails(
			@RequestBody KidsSummerTrainingRequest kidsSummerTrainingRequest,
			@PathVariable("id") Long kidsSummerTrainingId) {

		KidsSummerTrainingResponse response = kidsSummerTrainingServiceInterface
				.updateKidsSummerTrainingDetails(kidsSummerTrainingRequest, kidsSummerTrainingId);

		return new ResponseEntity<>(response, HttpStatus.OK);
	}

	@GetMapping
	public ResponseEntity<List<KidsSummerTrainingResponse>> getAllKidsSummerTraining() {
		List<KidsSummerTrainingResponse> responseList = kidsSummerTrainingServiceInterface.getAllKidsSummerTraining();
		return new ResponseEntity<>(responseList, HttpStatus.OK);
	}

	@DeleteMapping("/{id}")
	public ResponseEntity<String> deleteKidsSummerTraining(@PathVariable("id") Long kidsSummerTrainingId) {
		kidsSummerTrainingServiceInterface.deleteKidsSummerTraining(kidsSummerTrainingId);
		return new ResponseEntity<>("Kids Summer Training record deleted successfully.", HttpStatus.OK);
	}
}
