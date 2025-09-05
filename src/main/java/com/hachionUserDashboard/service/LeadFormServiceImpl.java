package com.hachionUserDashboard.service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.hachionUserDashboard.dto.LeadFormRequest;
import com.hachionUserDashboard.dto.LeadFormResponse;
import com.hachionUserDashboard.entity.LeadForm;
import com.hachionUserDashboard.repository.LeadFormRepository;

import Service.LeadFormService;

@Service
public class LeadFormServiceImpl implements LeadFormService {

	@Autowired
	private LeadFormRepository leadFormRepository;

	@Override
	public LeadFormResponse createLeadForm(LeadFormRequest leadFormRequest) {
		LeadForm leadForm = new LeadForm();
		leadForm.setFullName(leadFormRequest.getFullName());
		leadForm.setEmail(leadFormRequest.getEmail());
		leadForm.setMobileNumber(leadFormRequest.getMobileNumber());
		leadForm.setCountry(leadFormRequest.getCountry());
		leadForm.setCourseInterest(leadFormRequest.getCourseInterest());
		leadForm.setMarketerId(leadFormRequest.getMarketerId());
		leadForm.setDate(LocalDate.now());

		LeadForm savedLeadForm = leadFormRepository.save(leadForm);

		LeadFormResponse response = createResponseForLeadForm(savedLeadForm);

		return response;
	}

	private LeadFormResponse createResponseForLeadForm(LeadForm savedLeadForm) {
		LeadFormResponse response = new LeadFormResponse();
		response.setLeadFormId(savedLeadForm.getLeadFormId());
		response.setFullName(savedLeadForm.getFullName());
		response.setEmail(savedLeadForm.getEmail());
		response.setMobileNumber(savedLeadForm.getMobileNumber());
		response.setCountry(savedLeadForm.getCountry());
		response.setCourseInterest(savedLeadForm.getCourseInterest());
		response.setMarketerId(savedLeadForm.getMarketerId());
		response.setDate(savedLeadForm.getDate());
		return response;
	}

	@Override
	public LeadFormResponse updateLeadForm(LeadFormRequest leadFormRequest) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public List<LeadFormResponse> getAllLeadFormDetails() {
		List<LeadForm> leadForms = leadFormRepository.findAll();
		List<LeadFormResponse> responseList = new ArrayList<>();

		for (LeadForm lead : leadForms) {
			LeadFormResponse responseForLeadForm = createResponseForLeadForm(lead);
			responseList.add(responseForLeadForm);
		}

		return responseList;
	}

	@Override
	public void deleteLeadForm(Long leadFormId) {
		// TODO Auto-generated method stub
		if (leadFormRepository.existsById(leadFormId)) {
			leadFormRepository.deleteById(leadFormId);
		} else {
			throw new RuntimeException("LeadForm not found with ID: " + leadFormId);
		}
	}

}
