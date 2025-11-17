package com.hachionUserDashboard.service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.hachionUserDashboard.dto.InterviewTemplateRequest;
import com.hachionUserDashboard.dto.InterviewTemplateResponse;
import com.hachionUserDashboard.entity.InterviewTemplate;
import com.hachionUserDashboard.repository.InterviewTemplateRepository;

import Service.InterviewTemplateService;

@Service
public class InterviewTemplateServiceImpl implements InterviewTemplateService {

	@Autowired
	private InterviewTemplateRepository interviewTemplateRepository;

	@Override
	public InterviewTemplateResponse createTemplate(InterviewTemplateRequest request) {
		InterviewTemplate template = new InterviewTemplate();
		template.setTitle(request.getTitle());
		template.setDescription(request.getDescription());
		template.setType(request.getType());
		template.setCreatedByUserId(request.getCreatedByUserId());
		template.setActive(true);
		template.setCreatedAt(LocalDateTime.now());
		InterviewTemplate saved = interviewTemplateRepository.save(template);
		return mapToResponse(saved);
	}

	@Override
	public List<InterviewTemplateResponse> getAllTemplates() {
		List<InterviewTemplate> list = interviewTemplateRepository.findAll();
		List<InterviewTemplateResponse> result = new ArrayList<>();
		for (InterviewTemplate t : list) {
			result.add(mapToResponse(t));
		}
		return result;
	}

	@Override
	public List<InterviewTemplateResponse> getAllActiveTemplates() {
		List<InterviewTemplate> list = interviewTemplateRepository.findAllActive();
		List<InterviewTemplateResponse> result = new ArrayList<>();
		for (InterviewTemplate t : list) {
			result.add(mapToResponse(t));
		}
		return result;
	}

	@Override
	public InterviewTemplateResponse getTemplateById(Long id) {
		Optional<InterviewTemplate> optional = interviewTemplateRepository.findById(id);
		if (!optional.isPresent()) {
			throw new RuntimeException("InterviewTemplate not found with id: " + id);
		}
		return mapToResponse(optional.get());
	}

	@Override
	public InterviewTemplateResponse updateTemplate(Long id, InterviewTemplateRequest request) {
		Optional<InterviewTemplate> optional = interviewTemplateRepository.findById(id);
		if (!optional.isPresent()) {
			throw new RuntimeException("InterviewTemplate not found with id: " + id);
		}
		InterviewTemplate existing = optional.get();
		existing.setTitle(request.getTitle());
		existing.setDescription(request.getDescription());
		existing.setType(request.getType());
		 if (request.getActive() != null) {
			 existing.setActive(request.getActive());
	        } else {
	        	existing.setActive(true);
	        };
		existing.setUpdatedAt(LocalDateTime.now());
		InterviewTemplate saved = interviewTemplateRepository.save(existing);
		return mapToResponse(saved);
	}

//	@Override
//	public void deactivateTemplate(Long id) {
//		Optional<InterviewTemplate> optional = interviewTemplateRepository.findById(id);
//		if (!optional.isPresent()) {
//			throw new RuntimeException("InterviewTemplate not found with id: " + id);
//		}
//		InterviewTemplate existing = optional.get();
//		existing.setActive(false);
//		existing.setUpdatedAt(LocalDateTime.now());
//		interviewTemplateRepository.save(existing);
//	}

	private InterviewTemplateResponse mapToResponse(InterviewTemplate template) {
		InterviewTemplateResponse dto = new InterviewTemplateResponse();
		dto.setId(template.getId());
		dto.setTitle(template.getTitle());
		dto.setDescription(template.getDescription());
		dto.setType(template.getType());
		dto.setActive(template.isActive());
		dto.setCreatedByUserId(template.getCreatedByUserId());
		dto.setCreatedAt(template.getCreatedAt());
		dto.setUpdatedAt(template.getUpdatedAt());
		return dto;
	}
	@Override
	public void deactivateTemplate(Long id) {
	    if (!interviewTemplateRepository.existsById(id)) {
	        throw new RuntimeException("InterviewTemplate not found with id: " + id);
	    }

	    // 🔥 Hard delete from database
	    interviewTemplateRepository.deleteById(id);
	}

}

