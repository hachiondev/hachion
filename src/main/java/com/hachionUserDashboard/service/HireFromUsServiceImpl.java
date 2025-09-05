package com.hachionUserDashboard.service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

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
		hireFromUs.setStatus(hireFromUsRequest.getStatus());
		String jobId = generateJobId();
		hireFromUs.setJobId(jobId);

		HireFromUs saved = hireFromUsRepository.save(hireFromUs);

		HireFromUsResponse response = createHireFromUsResponse(saved);

		return response;
	}

	@Override
	public HireFromUsResponse updateHireFromUs(HireFromUsRequest hireFromUsRequest) {
	    Optional<HireFromUs> optionalHire = hireFromUsRepository.findById(hireFromUsRequest.getHireFromUsId());

	    if (!optionalHire.isPresent()) {
	        throw new RuntimeException("HireFromUs record not found with ID: " + hireFromUsRequest.getHireFromUsId());
	    }

	    HireFromUs hireFromUs = optionalHire.get();

	    // Update fields
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
	    hireFromUs.setStatus(hireFromUsRequest.getStatus());

	   
	    HireFromUs updated = hireFromUsRepository.save(hireFromUs);

	    return createHireFromUsResponse(updated);
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
		response.setStatus(saved.getStatus());
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
	
	public List<HireFromUsResponse> getAllApprovedJobs() {
	    List<HireFromUs> approvedJobs = hireFromUsRepository.findAllByStatus("approved");

	    return approvedJobs.stream()
	            .map(this::createHireFromUsResponse)
	            .collect(Collectors.toList());
	}

}
