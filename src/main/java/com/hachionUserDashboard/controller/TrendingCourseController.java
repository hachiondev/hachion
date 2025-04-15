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

import com.hachionUserDashboard.entity.TrendingCourse;
import com.hachionUserDashboard.repository.TrendingCourseRepository;

@CrossOrigin
@RestController
public class TrendingCourseController {

	@Autowired
	private TrendingCourseRepository repo;

	@GetMapping("/trendingcourse/{id}")
	public ResponseEntity<TrendingCourse> getTrendingCourse(@PathVariable Integer id) {
		return repo.findById(id).map(ResponseEntity::ok).orElse(ResponseEntity.status(HttpStatus.NOT_FOUND).build());
	}

	@GetMapping("/trendingcourse")
	public List<TrendingCourse> getAllTrendingCourse() {
		return repo.findAll();
	}

	@PostMapping("/trendingcourse/add")
	@ResponseStatus(code = HttpStatus.CREATED)
	public ResponseEntity<String> createTrendingCourse(@RequestBody TrendingCourse trendingcourse) {
		repo.save(trendingcourse);
		return ResponseEntity.status(HttpStatus.CREATED).body("Trending course added successfully.");
	}

	@PutMapping("/trendingcourse/update/{id}")
	public ResponseEntity<TrendingCourse> updatedTrendingCourse(@PathVariable int id,
			@RequestBody TrendingCourse updatedTrendingCourse) {
		return repo.findById(id).map(trendingcourse -> {
			trendingcourse.setCategory_name(updatedTrendingCourse.getCategory_name());
			trendingcourse.setCourse_name(updatedTrendingCourse.getCourse_name());
			trendingcourse.setStatus(updatedTrendingCourse.isStatus());

			repo.save(trendingcourse);
			return ResponseEntity.ok(trendingcourse);
		}).orElse(ResponseEntity.status(HttpStatus.NOT_FOUND).build());
	}

	@DeleteMapping("trendingcourse/delete/{id}")
	public ResponseEntity<?> deleteTrendingCourse(@PathVariable int id) {
		TrendingCourse trendingcourse = repo.findById(id).get();
		repo.delete(trendingcourse);
		return null;

	}
}