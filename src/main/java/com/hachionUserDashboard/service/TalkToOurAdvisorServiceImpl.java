package com.hachionUserDashboard.service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.hachionUserDashboard.dto.TalkToOurAdvisorRequest;
import com.hachionUserDashboard.entity.TalkToOurAdvisor;
import com.hachionUserDashboard.repository.TalkToOurAdvisorRepository;

import Response.TalkToOurAdvisorResponse;
import Service.TalkToOurAdvisorServiceInterface;

@Service
public class TalkToOurAdvisorServiceImpl implements TalkToOurAdvisorServiceInterface {

	@Autowired
	private TalkToOurAdvisorRepository repository;

	@Override
	public TalkToOurAdvisorResponse createTalkToOurAdvisor(TalkToOurAdvisorRequest ourAdvisor) {
		TalkToOurAdvisor entity = new TalkToOurAdvisor(null, ourAdvisor.getFullName(), ourAdvisor.getEmailId(),
				ourAdvisor.getNoOfPeople(), ourAdvisor.getCompanyName(), ourAdvisor.getMobileNumber(),
				ourAdvisor.getTrainingCourse(), ourAdvisor.getComments());
		TalkToOurAdvisor savedEntity = repository.save(entity);
		return mapToResponse(savedEntity);
	}

	@Override
	public List<TalkToOurAdvisorResponse> getAllTalkToOurAdvisor() {
		return repository.findAll().stream().map(this::mapToResponse).collect(Collectors.toList());
	}

	private TalkToOurAdvisorResponse mapToResponse(TalkToOurAdvisor entity) {
		return new TalkToOurAdvisorResponse(entity.getId(), entity.getFullName(), entity.getEmailId(),
				entity.getNoOfPeople(), entity.getCompanyName(), entity.getMobileNumber(), entity.getTrainingCourse(),
				entity.getComments());
	}

	@Override
	public Optional<TalkToOurAdvisorResponse> getById(Long id) {
		return repository.findById(id).map(this::mapToResponse);
	}

	@Override
	public String deleteTalkToAdvisor(Long id) {
		if (repository.existsById(id)) {
			repository.deleteById(id);
			return "Advisor successfully deleted.";
		} else {
			return "Advisor not found.";
		}
	}
}
