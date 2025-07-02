package com.hachionUserDashboard.service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.hachionUserDashboard.dto.UnsubscribeRequest;
import com.hachionUserDashboard.dto.UnsubscribeResponse;
import com.hachionUserDashboard.entity.UnsubscribeEntity;
import com.hachionUserDashboard.repository.RegisterStudentRepository;
import com.hachionUserDashboard.repository.UnsubscribeRepository;

import Service.UnsubscribeService;

@Service
public class UnsubscribeServiceImpl implements UnsubscribeService {

	@Autowired
	public UnsubscribeRepository unsubscribeRepository;

	@Autowired
	public RegisterStudentRepository registerStudentRepository;

	@Override
	public UnsubscribeResponse createUnsubscribeDetails(UnsubscribeRequest unsubscribeRequest) {
		UnsubscribeEntity unsubscribeEntity = new UnsubscribeEntity();
		unsubscribeEntity.setUserName(unsubscribeRequest.getUserName());
		unsubscribeEntity.setEmail(unsubscribeRequest.getEmail());
		unsubscribeEntity.setMobile(unsubscribeRequest.getMobile());
		unsubscribeEntity.setCountry(unsubscribeRequest.getCountry());
		unsubscribeEntity.setDate(LocalDate.now());
		unsubscribeEntity.setReason(unsubscribeRequest.getReason());
		unsubscribeEntity.setComments(unsubscribeRequest.getComments());

		registerStudentRepository.deleteByEmailNative(unsubscribeRequest.getEmail());
		UnsubscribeEntity unsubscribeEntityResponse = unsubscribeRepository.save(unsubscribeEntity);

		UnsubscribeResponse unsubscribeResponse = createUnsubscribeEntityResponse(unsubscribeEntityResponse);
		return unsubscribeResponse;
	}

	@Override
	public List<UnsubscribeResponse> getAllUnsubscribeDetails() {
		List<UnsubscribeEntity> listOfUnsubscribeEntities = unsubscribeRepository.findAll();

		List<UnsubscribeResponse> listOfUnsubscribeResponses = new ArrayList<>();

		for (UnsubscribeEntity unsubscribeEntity : listOfUnsubscribeEntities) {
			UnsubscribeResponse unsubscribeEntityResponse = createUnsubscribeEntityResponse(unsubscribeEntity);

			listOfUnsubscribeResponses.add(unsubscribeEntityResponse);
		}

		return listOfUnsubscribeResponses;
	}

	@Override
	public void deleteUnsubscribeDetails(Long unsubscribeId) {
		unsubscribeRepository.deleteById(unsubscribeId);

	}

	private UnsubscribeResponse createUnsubscribeEntityResponse(UnsubscribeEntity unsubscribeEntityResponse) {
		UnsubscribeResponse unsubscribeResponse = new UnsubscribeResponse();
		unsubscribeResponse.setUnsubscribeId(unsubscribeEntityResponse.getUnsubscribeId());
		unsubscribeResponse.setUserName(unsubscribeEntityResponse.getUserName());
		unsubscribeResponse.setEmail(unsubscribeEntityResponse.getEmail());
		unsubscribeResponse.setMobile(unsubscribeEntityResponse.getMobile());
		unsubscribeResponse.setCountry(unsubscribeEntityResponse.getCountry());
		unsubscribeResponse.setDate(unsubscribeEntityResponse.getDate());
		unsubscribeResponse.setReason(unsubscribeEntityResponse.getReason());
		unsubscribeResponse.setComments(unsubscribeEntityResponse.getComments());
		return unsubscribeResponse;
	}

}
