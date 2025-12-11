package com.hachionUserDashboard.service;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.hachionUserDashboard.dto.ProjectRequest;
import com.hachionUserDashboard.dto.ProjectResponse;
import com.hachionUserDashboard.entity.Project;
import com.hachionUserDashboard.repository.ProjectRepository;

import Service.ProjectServiceInterface;

@Service
public class ProjectServiceImpl implements ProjectServiceInterface {

	@Autowired
	private ProjectRepository projectRepository;

	@Override
	public List<ProjectResponse> createMultiple(List<ProjectRequest> requestList) {

		List<Project> projects = requestList.stream().map(req -> {
			Project p = new Project();
			p.setCourseCategory(req.getCourseCategory());
			p.setCourseName(req.getCourseName());
			p.setProjectName(req.getProjectName());
			p.setDescription(req.getDescription());
			p.setDate(LocalDate.now());
			return p;
		}).collect(Collectors.toList());

		List<Project> saved = projectRepository.saveAll(projects);

		return saved.stream().map(this::toResponse).collect(Collectors.toList());
	}

	@Override
	public ProjectResponse updateProject(Long id, ProjectRequest req) {

		Project project = projectRepository.findById(id)
				.orElseThrow(() -> new RuntimeException("Project not found with id: " + id));

		if (req.getCourseCategory() != null) {
			project.setCourseCategory(req.getCourseCategory());
		}

		if (req.getCourseName() != null) {
			project.setCourseName(req.getCourseName());
		}

		if (req.getProjectName() != null) {
			project.setProjectName(req.getProjectName());
		}

		if (req.getDescription() != null) {
			project.setDescription(req.getDescription());
		}

		Project updated = projectRepository.save(project);

		return toResponse(updated);
	}

	@Override
	public void deleteProject(Long id) {
		if (!projectRepository.existsById(id)) {
			throw new RuntimeException("Project not found with id: " + id);
		}
		projectRepository.deleteById(id);
	}

	@Override
	public List<ProjectResponse> getAllProjects() {
		return projectRepository.findAll().stream().map(this::toResponse).collect(Collectors.toList());
	}

	private ProjectResponse toResponse(Project p) {
		ProjectResponse res = new ProjectResponse();
		res.setProjectId(p.getProjectId());
		res.setCourseCategory(p.getCourseCategory());
		res.setCourseName(p.getCourseName());
		res.setProjectName(p.getProjectName());
		res.setDescription(p.getDescription());
		res.setDate(p.getDate());
		return res;
	}
}
