package com.hachionUserDashboard.service;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.hachionUserDashboard.dto.PopupOnboardingRequest;
import com.hachionUserDashboard.dto.PopupOnboardingResponse;
import com.hachionUserDashboard.entity.PopupOnboarding;
import com.hachionUserDashboard.repository.PopupOnboardingRepository;

import Service.PopupOnboardingService;

@Service
public class PopupOnboardingServiceImpl implements PopupOnboardingService {

	@Autowired
	private PopupOnboardingRepository popupOnboardingRepository;

	@Override
	public PopupOnboardingResponse createPopupOnboarding(PopupOnboardingRequest popupOnboardingRequest) {
		PopupOnboarding onboarding = new PopupOnboarding();
		onboarding.setStudentId(popupOnboardingRequest.getStudentId());
		onboarding.setStudentName(popupOnboardingRequest.getStudentName());
		onboarding.setStudentEmail(popupOnboardingRequest.getStudentEmail());
		onboarding.setMobile(popupOnboardingRequest.getMobile());
		onboarding.setCurrentRole(popupOnboardingRequest.getCurrentRole());
		onboarding.setPrimaryGoal(popupOnboardingRequest.getPrimaryGoal());
		onboarding.setAreasOfInterest(popupOnboardingRequest.getAreasOfInterest());
		onboarding.setPreferToLearn(popupOnboardingRequest.getPreferToLearn());
		onboarding.setPreferredTrainingMode(popupOnboardingRequest.getPreferredTrainingMode());
		onboarding.setCurrentSkill(popupOnboardingRequest.getCurrentSkill());
		onboarding.setLookingForJob(popupOnboardingRequest.getLookingForJob());
		onboarding.setRealTimeProjects(popupOnboardingRequest.getRealTimeProjects());
		onboarding.setCertificationOrPlacement(popupOnboardingRequest.getCertificationOrPlacement());
		onboarding.setSpeakToCourseAdvisor(popupOnboardingRequest.getSpeakToCourseAdvisor());
		onboarding.setWhereYouHeard(popupOnboardingRequest.getWhereYouHeard());

		onboarding.setFillingDate(LocalDate.now());

		PopupOnboarding saved = popupOnboardingRepository.save(onboarding);

		PopupOnboardingResponse response = createResponseForPopupOnboarding(saved);

		return response;
	}

	private PopupOnboardingResponse createResponseForPopupOnboarding(PopupOnboarding saved) {
		PopupOnboardingResponse response = new PopupOnboardingResponse();
		response.setPopupOnboardingId(saved.getPopupOnboardingId());
		response.setStudentId(saved.getStudentId());
		response.setStudentName(saved.getStudentName());
		response.setStudentEmail(saved.getStudentEmail());
		response.setMobile(saved.getMobile());
		response.setCurrentRole(saved.getCurrentRole());
		response.setPrimaryGoal(saved.getPrimaryGoal());
		response.setAreasOfInterest(saved.getAreasOfInterest());
		response.setPreferToLearn(saved.getPreferToLearn()); // will be List<String>
		response.setPreferredTrainingMode(saved.getPreferredTrainingMode());
		response.setCurrentSkill(saved.getCurrentSkill());
		response.setLookingForJob(saved.getLookingForJob());
		response.setRealTimeProjects(saved.getRealTimeProjects());
		response.setCertificationOrPlacement(saved.getCertificationOrPlacement());
		response.setSpeakToCourseAdvisor(saved.getSpeakToCourseAdvisor());
		response.setWhereYouHeard(saved.getWhereYouHeard());
		response.setFillingDate(saved.getFillingDate());
		return response;
	}

	@Override
	public PopupOnboardingResponse updatePopupOnboarding(PopupOnboardingRequest popupOnboardingRequest) {

		PopupOnboarding onboarding = popupOnboardingRepository.findById(popupOnboardingRequest.getPopupOnboardingId())
				.orElseThrow(() -> new RuntimeException(
						"PopupOnboarding not found with id: " + popupOnboardingRequest.getPopupOnboardingId()));

		onboarding.setStudentId(popupOnboardingRequest.getStudentId());
		onboarding.setStudentName(popupOnboardingRequest.getStudentName());
		onboarding.setStudentEmail(popupOnboardingRequest.getStudentEmail());
		onboarding.setMobile(popupOnboardingRequest.getMobile());
		onboarding.setCurrentRole(popupOnboardingRequest.getCurrentRole());
		onboarding.setPrimaryGoal(popupOnboardingRequest.getPrimaryGoal());
		onboarding.setAreasOfInterest(popupOnboardingRequest.getAreasOfInterest());
		onboarding.setPreferToLearn(popupOnboardingRequest.getPreferToLearn()); // auto-converted
		onboarding.setPreferredTrainingMode(popupOnboardingRequest.getPreferredTrainingMode());
		onboarding.setCurrentSkill(popupOnboardingRequest.getCurrentSkill());
		onboarding.setLookingForJob(popupOnboardingRequest.getLookingForJob());
		onboarding.setRealTimeProjects(popupOnboardingRequest.getRealTimeProjects());
		onboarding.setCertificationOrPlacement(popupOnboardingRequest.getCertificationOrPlacement());
		onboarding.setSpeakToCourseAdvisor(popupOnboardingRequest.getSpeakToCourseAdvisor());
		onboarding.setWhereYouHeard(popupOnboardingRequest.getWhereYouHeard());
		onboarding.setFillingDate(LocalDate.now());

		PopupOnboarding updated = popupOnboardingRepository.save(onboarding);

		PopupOnboardingResponse response = createResponseForPopupOnboarding(updated);

		return response;
	}

	@Override
	public List<PopupOnboardingResponse> getAllPopupOnboarding() {
		return popupOnboardingRepository.findAll().stream().map(this::createResponseForPopupOnboarding)
				.collect(Collectors.toList());
	}

	@Override
	public void deletePopupOnboarding(Long popupOnboardingId) {
		PopupOnboarding onboarding = popupOnboardingRepository.findById(popupOnboardingId)
				.orElseThrow(() -> new RuntimeException("PopupOnboarding not found with id: " + popupOnboardingId));

		popupOnboardingRepository.delete(onboarding);
	}

}
