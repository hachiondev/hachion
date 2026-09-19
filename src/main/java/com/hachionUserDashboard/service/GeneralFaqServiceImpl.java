package com.hachionUserDashboard.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.hachionUserDashboard.dto.GeneralFaqRequest;
import com.hachionUserDashboard.dto.GeneralFaqResponse;
import com.hachionUserDashboard.entity.GeneralFaq;
import com.hachionUserDashboard.repository.GeneralFaqRepository;

import Service.GeneralFaqService;

import java.time.LocalDate;
import java.util.List;

@Service
@Transactional
public class GeneralFaqServiceImpl implements GeneralFaqService {

	@Autowired
	private GeneralFaqRepository repo;

	@Override
	public GeneralFaqResponse create(GeneralFaqRequest req) {
		GeneralFaq faq = new GeneralFaq();
		faq.setFaqTitle(req.getFaqTitle());
		faq.setDescription(req.getDescription());
		faq.setDate(req.getDate() != null ? req.getDate() : LocalDate.now());
		GeneralFaq saved = repo.save(faq);
		return toResponse(saved);
	}

	@Override
	public GeneralFaqResponse update(Long id, GeneralFaqRequest req) {
		GeneralFaq faq = repo.findById(id).orElseThrow(() -> new IllegalArgumentException("FAQ not found: " + id));
		if (req.getFaqTitle() != null)
			faq.setFaqTitle(req.getFaqTitle());
		if (req.getDescription() != null)
			faq.setDescription(req.getDescription());
		if (req.getDate() != null)
			faq.setDate(req.getDate());
		GeneralFaq updated = repo.save(faq);
		return toResponse(updated);
	}

	@Override
	@Transactional(readOnly = true)
	public List<GeneralFaqResponse> getAll() {
		return repo.findAll().stream().map(this::toResponse).toList();
	}

	@Override
	@Transactional(readOnly = true)
	public GeneralFaqResponse getById(Long id) {
		GeneralFaq faq = repo.findById(id).orElseThrow(() -> new IllegalArgumentException("FAQ not found: " + id));
		return toResponse(faq);
	}

	@Override
	public void deleteByIds(List<Long> ids) {
		repo.deleteAllById(ids);
	}

	private GeneralFaqResponse toResponse(GeneralFaq f) {
		return new GeneralFaqResponse(f.getFaqId(), f.getFaqTitle(), f.getDescription(), f.getDate());
	}

}