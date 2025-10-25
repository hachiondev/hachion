package com.hachionUserDashboard.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import com.hachionUserDashboard.dto.FaqQueryRequest;
import com.hachionUserDashboard.dto.FaqQueryResponse;
import com.hachionUserDashboard.entity.FaqQuery;
import com.hachionUserDashboard.repository.FaqQueryRepository;

import Service.FaqQueryService;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class FaqQueryServiceImpl implements FaqQueryService {

	@Autowired
	private FaqQueryRepository faqQueryRepository;

	public FaqQueryServiceImpl(FaqQueryRepository faqQueryRepository) {
		this.faqQueryRepository = faqQueryRepository;
	}

	@Override
	public FaqQueryResponse create(FaqQueryRequest request) {
		FaqQuery entity = new FaqQuery();
		entity.setName(request.getName());
		entity.setEmailId(request.getEmailId());
		entity.setMessage(request.getMessage());
		entity.setDate(LocalDate.now()); // always current date

		FaqQuery saved = faqQueryRepository.save(entity);
		return toResponse(saved);
	}

	@Override
	public FaqQueryResponse update(Long id, FaqQueryRequest request) {
		FaqQuery entity = faqQueryRepository.findById(id)
				.orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "FaqQuery not found"));

		entity.setName(request.getName());
		entity.setEmailId(request.getEmailId());
		entity.setMessage(request.getMessage());
		entity.setDate(LocalDate.now()); // always current date on update

		FaqQuery updated = faqQueryRepository.save(entity);
		return toResponse(updated);
	}

	@Override
	@Transactional(readOnly = true)
	public FaqQueryResponse get(Long id) {
		FaqQuery entity = faqQueryRepository.findById(id)
				.orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "FaqQuery not found"));
		return toResponse(entity);
	}

	@Override
	@Transactional(readOnly = true)
	public List<FaqQueryResponse> getAll() {
		return faqQueryRepository.findAll().stream().map(this::toResponse).collect(Collectors.toList());
	}

	@Override
	public void delete(Long id) {
		if (!faqQueryRepository.existsById(id)) {
			throw new ResponseStatusException(HttpStatus.NOT_FOUND, "FaqQuery not found");
		}
		faqQueryRepository.deleteById(id);
	}

	private FaqQueryResponse toResponse(FaqQuery entity) {
		FaqQueryResponse resp = new FaqQueryResponse();
		resp.setFaqQueryId(entity.getFaqQueryId());
		resp.setName(entity.getName());
		resp.setEmailId(entity.getEmailId());
		resp.setMessage(entity.getMessage());
		resp.setDate(entity.getDate());
		return resp;
	}
}