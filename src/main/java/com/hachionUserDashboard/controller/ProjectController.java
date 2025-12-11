package com.hachionUserDashboard.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
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

import com.hachionUserDashboard.dto.ProjectRequest;
import com.hachionUserDashboard.dto.ProjectResponse;

import Service.ProjectServiceInterface;

@CrossOrigin
@RestController
@RequestMapping("/projects")
public class ProjectController {

	@Autowired
	private ProjectServiceInterface projectService;

	@PostMapping("/bulk")
	public ResponseEntity<List<ProjectResponse>> createMultiple(@RequestBody List<ProjectRequest> requests) {
		return ResponseEntity.ok(projectService.createMultiple(requests));
	}

	@PutMapping("/{id}")
	public ResponseEntity<ProjectResponse> update(@PathVariable Long id, @RequestBody ProjectRequest request) {
		return ResponseEntity.ok(projectService.updateProject(id, request));
	}

	@DeleteMapping("/{id}")
	public ResponseEntity<String> delete(@PathVariable Long id) {
		projectService.deleteProject(id);
		return ResponseEntity.ok("Project deleted successfully");
	}

	@GetMapping
	public ResponseEntity<List<ProjectResponse>> getAll() {
		return ResponseEntity.ok(projectService.getAllProjects());
	}
}