package com.hachionUserDashboard.service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.hachionUserDashboard.dto.KidsSummerTrainingRequest;
import com.hachionUserDashboard.entity.KidsSummerTrainingEntity;
import com.hachionUserDashboard.exception.ResourceNotFoundException;
import com.hachionUserDashboard.repository.KidsSummerTrainingRepository;

import Response.KidsSummerTrainingResponse;
import Service.KidsSummerTrainingServiceInterface;

@Service
public class KidsSummerTrainingServiceImpl implements KidsSummerTrainingServiceInterface {

	@Autowired
	private KidsSummerTrainingRepository kidsSummerTrainingRepository;

	@Override
	public KidsSummerTrainingResponse addKidsSummerTrainingDetails(
			KidsSummerTrainingRequest kidsSummerTrainingRequest) {

		if (kidsSummerTrainingRepository.existsByEmail(kidsSummerTrainingRequest.getEmail())) {
			throw new RuntimeException("Email already exists in the system");
		}
		if (kidsSummerTrainingRepository.existsByMobile(kidsSummerTrainingRequest.getMobileNumber())) {
			throw new RuntimeException("Mobile number already exists in the system");
		}

		KidsSummerTrainingEntity kidsSummerTrainingEntity = new KidsSummerTrainingEntity();

		kidsSummerTrainingEntity.setFullName(kidsSummerTrainingRequest.getFullName());
		kidsSummerTrainingEntity.setEmail(kidsSummerTrainingRequest.getEmail());
		kidsSummerTrainingEntity.setMobileNumber(kidsSummerTrainingRequest.getMobileNumber());
		kidsSummerTrainingEntity.setCountry(kidsSummerTrainingRequest.getCountry());
		kidsSummerTrainingEntity.setCourseInterested(kidsSummerTrainingRequest.getCourseInterested());
		kidsSummerTrainingEntity.setBatchTiming(kidsSummerTrainingRequest.getBatchTiming());

		kidsSummerTrainingEntity.setDate(LocalDate.now());

		KidsSummerTrainingEntity savedEntity = kidsSummerTrainingRepository.save(kidsSummerTrainingEntity);

		KidsSummerTrainingResponse response = kidsSummerTrainingResponse(savedEntity);

		return response;
	}

	@Override
	public KidsSummerTrainingResponse updateKidsSummerTrainingDetails(
			KidsSummerTrainingRequest kidsSummerTrainingRequest, Long kidsSummerTrainingId) {

		Optional<KidsSummerTrainingEntity> kidsSummerTrainingOptional = kidsSummerTrainingRepository
				.findById(kidsSummerTrainingId);

		if (kidsSummerTrainingOptional.isPresent()) {
			KidsSummerTrainingEntity entity = kidsSummerTrainingOptional.get();

			entity.setFullName(kidsSummerTrainingRequest.getFullName());
			entity.setEmail(kidsSummerTrainingRequest.getEmail());
			entity.setMobileNumber(kidsSummerTrainingRequest.getMobileNumber());
			entity.setCountry(kidsSummerTrainingRequest.getCountry());
			entity.setCourseInterested(kidsSummerTrainingRequest.getCourseInterested());
			entity.setBatchTiming(kidsSummerTrainingRequest.getBatchTiming());

			KidsSummerTrainingEntity updatedEntity = kidsSummerTrainingRepository.save(entity);

			KidsSummerTrainingResponse response = kidsSummerTrainingResponse(updatedEntity);

			return response;
		} else {
			throw new ResourceNotFoundException("KidsSummerTraining record not found with ID: " + kidsSummerTrainingId);
		}
	}

	@Override
	public List<KidsSummerTrainingResponse> getAllKidsSummerTraining() {
		List<KidsSummerTrainingEntity> entityList = kidsSummerTrainingRepository.findAll();

		List<KidsSummerTrainingResponse> responseList = new ArrayList<>();

		for (KidsSummerTrainingEntity entity : entityList) {

			KidsSummerTrainingResponse kidsSummerTrainingResponse = kidsSummerTrainingResponse(entity);
			responseList.add(kidsSummerTrainingResponse);
		}

		return responseList;
	}

	@Override
	public void deleteKidsSummerTraining(Long kidsSummerTrainingId) {

		kidsSummerTrainingRepository.deleteById(kidsSummerTrainingId);
	}

	private KidsSummerTrainingResponse kidsSummerTrainingResponse(KidsSummerTrainingEntity savedEntity) {
		KidsSummerTrainingResponse response = new KidsSummerTrainingResponse();
		response.setKidsSummerTrainingId(savedEntity.getKidsSummerTrainingId());
		response.setFullName(savedEntity.getFullName());
		response.setEmail(savedEntity.getEmail());
		response.setMobileNumber(savedEntity.getMobileNumber());
		response.setCountry(savedEntity.getCountry());
		response.setCourseInterested(savedEntity.getCourseInterested());
		response.setBatchTiming(savedEntity.getBatchTiming());
		response.setDate(savedEntity.getDate());
		return response;
	}

}
