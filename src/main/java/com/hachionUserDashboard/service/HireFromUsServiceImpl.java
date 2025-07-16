package com.hachionUserDashboard.service;

import java.sql.Date;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.hachionUserDashboard.dto.HireFromUsRequest;
import com.hachionUserDashboard.dto.HireFromUsResponse;
import com.hachionUserDashboard.entity.HireFromUs;
import com.hachionUserDashboard.repository.HireFromUsRepository;

import Service.HireFromUsService;

@Service
public class HireFromUsServiceImpl implements HireFromUsService {

	@Autowired
	public HireFromUsRepository hireFromUsRepository;

	@Override
	public HireFromUsResponse createHireFromUs(HireFromUsRequest hireFromUsRequest) {

		HireFromUs hireFromUs = new HireFromUs();
		hireFromUs.setFirstName(hireFromUsRequest.getFirstName());
		hireFromUs.setLastName(hireFromUsRequest.getLastName());
		hireFromUs.setEmail(hireFromUsRequest.getEmail());
		hireFromUs.setMobileNumber(hireFromUsRequest.getMobileNumber());
		hireFromUs.setCompany(hireFromUsRequest.getCompany());
		hireFromUs.setCompanyUrl(hireFromUsRequest.getCompanyUrl());
		hireFromUs.setCompanyLogo(hireFromUsRequest.getCompanyLogo());
		hireFromUs.setWorkDays(hireFromUsRequest.getWorkDays());
		hireFromUs.setJobTitle(hireFromUsRequest.getJobTitle());
		hireFromUs.setVacancies(hireFromUsRequest.getVacancies());
		hireFromUs.setExperience(hireFromUsRequest.getExperience());
		hireFromUs.setSalary(hireFromUsRequest.getSalary());
		hireFromUs.setLocation(hireFromUsRequest.getLocation());
		hireFromUs.setNoticePeriod(hireFromUsRequest.getNoticePeriod());
		hireFromUs.setEmploymentType(hireFromUsRequest.getEmploymentType());
		hireFromUs.setJobType(hireFromUsRequest.getJobType());
		hireFromUs.setDescription(hireFromUsRequest.getDescription());
		hireFromUs.setQualification(hireFromUsRequest.getQualification());
		hireFromUs.setDate(LocalDate.now());
		String jobId = generateJobId();
		hireFromUs.setJobId(jobId);

		HireFromUs saved = hireFromUsRepository.save(hireFromUs);

		HireFromUsResponse response = createHireFromUsResponse(saved);

		return response;
	}

	@Override
	public HireFromUsResponse updateHireFromUs(HireFromUsRequest hireFromUsRequest) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public List<HireFromUsResponse> getAllHireFromUs() {
		List<HireFromUs> listOfHireFromUs = hireFromUsRepository.findAll();
		List<HireFromUsResponse> listOfHireFromUsResponse = new ArrayList<>();
		for (HireFromUs hireFromUs : listOfHireFromUs) {

			HireFromUsResponse hireFromUsResponse = createHireFromUsResponse(hireFromUs);
			listOfHireFromUsResponse.add(hireFromUsResponse);

		}

		return listOfHireFromUsResponse;
	}

	@Override
	public void deleteHireFromUs() {
		// TODO Auto-generated method stub

	}

	private HireFromUsResponse createHireFromUsResponse(HireFromUs saved) {
		HireFromUsResponse response = new HireFromUsResponse();
		response.setHireFromUsId(saved.getHireFromUsId());
		response.setFirstName(saved.getFirstName());
		response.setLastName(saved.getLastName());
		response.setEmail(saved.getEmail());
		response.setMobileNumber(saved.getMobileNumber());
		response.setCompany(saved.getCompany());
		response.setCompanyUrl(saved.getCompanyUrl());
		response.setCompanyLogo(saved.getCompanyLogo());
		response.setWorkDays(saved.getWorkDays());
		response.setJobTitle(saved.getJobTitle());
		response.setVacancies(saved.getVacancies());
		response.setExperience(saved.getExperience());
		response.setSalary(saved.getSalary());
		response.setLocation(saved.getLocation());
		response.setNoticePeriod(saved.getNoticePeriod());
		response.setEmploymentType(saved.getEmploymentType());
		response.setJobType(saved.getJobType());
		response.setDescription(saved.getDescription());
		response.setQualification(saved.getQualification());
		response.setDate(saved.getDate());
		response.setJobId(saved.getJobId());
		return response;
	}

	private String generateJobId() {

		String lastJobId = hireFromUsRepository.findMaxJobId();
		int nextNumber = 1000;

		if (lastJobId != null && lastJobId.startsWith("H")) {
			try {
				nextNumber = Integer.parseInt(lastJobId.substring(1)) + 1;
			} catch (NumberFormatException e) {

				nextNumber = 1000;
			}
		}

		return "H" + nextNumber;
	}

}
