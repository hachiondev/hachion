package com.hachionUserDashboard.controller;

import java.util.List;
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
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import com.hachionUserDashboard.entity.Trainer;
import com.hachionUserDashboard.repository.TrainerRepository;

import Service.TrainerService;

//@CrossOrigin(origins = {"http://localhost:3000", "http://hachion.co"}) 
@CrossOrigin
@RestController

public class TrainerController {

	private TrainerService trainerservice = null;

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

	@GetMapping("/trainers")

//	    @GetMapping("/trainers/{id}")
//	    public Trainer getTrainer(@PathVariable int id) {
//	    Trainer trainer=	repo.findById(id).get()	;
//		return null;
//	    	}
	public List<Trainer> getAllTrainers() {
		List<Trainer> trainers = repo.findAll();
		return trainers;
	}

//	@PostMapping("/trainer/add")
//	@ResponseStatus(code = HttpStatus.CREATED)
//	public void createTrainer(@RequestBody Trainer trainer) {
//		repo.save(trainer);
//	}

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

			// Save the updated trainer to the repository
			repo.save(trainer);

			return ResponseEntity.ok(trainer); // Return the updated trainer and 200 OK
		} else {
			// Return 404 Not Found if the trainer ID does not exist
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

	/*
	 * @DeleteMapping("trainer/delete/{id}") public ResponseEntity<?>
	 * deleteTrainer(@PathVariable Long id) {
	 * System.out.println("Received trainerId: " + id); // Log to console return
	 * ResponseEntity.ok("Trainer deleted successfully"); }
	 * 
	 */
	public TrainerService getTrainerservice() {
		return trainerservice;
	}

	public void setTrainerservice(TrainerService trainerservice) {
		this.trainerservice = trainerservice;
	}
}