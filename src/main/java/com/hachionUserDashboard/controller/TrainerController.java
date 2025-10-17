package com.hachionUserDashboard.controller;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Optional;

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
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.hachionUserDashboard.dto.TrainerRequest;
import com.hachionUserDashboard.entity.Trainer;
import com.hachionUserDashboard.repository.TrainerRepository;

import Service.TrainerService;

//@CrossOrigin(origins = {"http://localhost:3000", "http://hachion.co"}) 
@CrossOrigin
@RestController

public class TrainerController {

	@Autowired
	private TrainerService trainerservice;

	@Autowired
	TrainerRepository repo;

	public TrainerController(TrainerService userService) {
		this.setTrainerservice(userService);
	}

	@GetMapping("/trainers/{id}")
	public Trainer getTrainer(@PathVariable Integer id) {
		Trainer trainer = repo.findById(id).get();
		return trainer;
	}

//	@GetMapping("/trainers")
//	public List<Trainer> getAllCourse() {
//		return repo.findAll();
//	}

	@GetMapping("/trainers")
	public List<TrainerRequest> getAllCourse() {
		return repo.findAll().stream().map(trainerservice::toDtoWithBlended).toList();
	}

	@GetMapping("/trainersnames-unique")

	public List<Trainer> getAllTrainers() {
		List<Trainer> trainers = repo.findDistinctTrainersOrdered();
		Map<String, Trainer> uniqueByName = new LinkedHashMap<>();
		for (Trainer t : trainers) {
			if (t.getTrainer_name() == null || t.getTrainer_name().isBlank()) {
				continue;
			}
			String key = t.getTrainer_name().trim().toLowerCase(Locale.ROOT);
			uniqueByName.putIfAbsent(key, t);
		}

		return new ArrayList<>(uniqueByName.values());
	}

	@PostMapping("/trainer/add")
	public ResponseEntity<?> createTrainer(@RequestBody Trainer trainer) {
		boolean exists = repo.existsByNameAndCategoryAndCourse(trainer.getTrainer_name(), trainer.getCategory_name(),
				trainer.getCourse_name());

		if (exists) {
			return ResponseEntity.status(HttpStatus.CONFLICT)
					.body("Trainer with the same name, category, and course already exists.");
		}

		Trainer savedTrainer = repo.save(trainer);
		return ResponseEntity.status(HttpStatus.CREATED).body(savedTrainer);
	}
	/*
	 * @PutMapping("trainer/update/{id}") public Trainer
	 * updateTrainers(@PathVariable int id) { Trainer trainer=
	 * repo.findById(id).get(); trainer.setTrainer_name("");
	 * trainer.setCategory_name(""); repo.save(trainer); return trainer; }
	 */

	@PutMapping("/trainer/update/{id}")
	public ResponseEntity<Trainer> updateTrainer(@PathVariable int id, @RequestBody Trainer updatedTrainer) {
		Optional<Trainer> optionalTrainer = repo.findById(id);

		if (optionalTrainer.isPresent()) {
			Trainer trainer = optionalTrainer.get();

			// Set the new values for the trainer
			trainer.setTrainer_name(updatedTrainer.getTrainer_name());
			trainer.setCategory_name(updatedTrainer.getCategory_name());
			trainer.setCourse_name(updatedTrainer.getCourse_name());
			trainer.setSummary(updatedTrainer.getSummary());
			trainer.setDemo_link_1(updatedTrainer.getDemo_link_1());
			trainer.setDemo_link_2(updatedTrainer.getDemo_link_2());
			trainer.setDemo_link_3(updatedTrainer.getDemo_link_3());
			trainer.setDate(LocalDate.now());
			trainer.setTrainerRating(updatedTrainer.getTrainerRating());
			repo.save(trainer);

			return ResponseEntity.ok(trainer);
		} else {

			return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
		}
	}

	@DeleteMapping("trainer/delete/{id}")
	public ResponseEntity<?> deleteTrainer(@PathVariable int id) {
		Trainer trainer = repo.findById(id).get();
		repo.delete(trainer);
		return null;

	}

	@GetMapping("/trainernames")
	public ResponseEntity<List<String>> getTrainerNames(@RequestParam String categoryName,
			@RequestParam String courseName) {

		List<String> trainerNames = repo.gettingTrainerNames(categoryName, courseName);
		return ResponseEntity.ok(trainerNames);
	}

	public TrainerService getTrainerservice() {
		return trainerservice;
	}

	public void setTrainerservice(TrainerService trainerservice) {
		this.trainerservice = trainerservice;
	}
}