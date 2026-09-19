package com.hachionUserDashboard.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.hachionUserDashboard.dto.GeoKeywordItem;
import com.hachionUserDashboard.dto.GeoKeywordListResponse;
import com.hachionUserDashboard.dto.GeoKeywordRequest;
import com.hachionUserDashboard.dto.GeoKeywordResponse;
import com.hachionUserDashboard.service.GeoKeywordService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/admin/geo-keywords")
@RequiredArgsConstructor
public class GeoKeywordController {

	@Autowired
	private GeoKeywordService service;

	@PostMapping
	public ResponseEntity<GeoKeywordResponse> addGeoKeywords(@RequestBody GeoKeywordRequest request) {

		GeoKeywordResponse response = service.addGeoKeywords(request);
		return ResponseEntity.ok(response);
	}

	@GetMapping
	public ResponseEntity<List<GeoKeywordListResponse>> getGeoKeywordList() {
		return ResponseEntity.ok(service.getAllGeoKeywords());
	}

	@PutMapping("/update")
	public ResponseEntity<GeoKeywordItem> updateGeoKeyword(@RequestBody GeoKeywordItem request) {

		GeoKeywordItem response = service.updateGeoKeyword(request);
		return ResponseEntity.ok(response);
	}

	@DeleteMapping("/{geoKeywordId}")
	public ResponseEntity<?> deleteGeoKeyword(@PathVariable Long geoKeywordId) {
		service.deleteGeoKeyword(geoKeywordId);
		return ResponseEntity.ok().build();
	}

	@GetMapping("/by-category-course")
	public ResponseEntity<GeoKeywordResponse> getGeoKeywordsByCategoryAndCourse(@RequestParam String categoryName,
			@RequestParam String courseName) {

		return ResponseEntity.ok(service.getGeoKeywordsByCategoryAndCourse(categoryName, courseName));
	}

	@GetMapping("/by-course")
	public ResponseEntity<GeoKeywordResponse> getGeoKeywordsByCourse(@RequestParam String courseName) {
		return ResponseEntity.ok(service.getGeoKeywordsByCourseName(courseName));
	}

}