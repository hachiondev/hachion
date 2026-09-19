
package com.hachionUserDashboard.service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

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

	@Autowired
	public WebhookSenderService webhookSenderService;

	@Autowired
	public EmailService emailService;

//	@Override
//	public UnsubscribeResponse createUnsubscribeDetails(UnsubscribeRequest unsubscribeRequest) {
//		UnsubscribeEntity unsubscribeEntity = new UnsubscribeEntity();
//		unsubscribeEntity.setUserName(unsubscribeRequest.getUserName());
//		unsubscribeEntity.setEmail(unsubscribeRequest.getEmail());
//		unsubscribeEntity.setMobile(unsubscribeRequest.getMobile());
//		unsubscribeEntity.setCountry(unsubscribeRequest.getCountry());
//		unsubscribeEntity.setDate(LocalDate.now());
//		unsubscribeEntity.setReason(unsubscribeRequest.getReason());
//		unsubscribeEntity.setComments(unsubscribeRequest.getComments());
//		unsubscribeEntity.setChooseDuration(unsubscribeRequest.getChooseDuration());
//
//		registerStudentRepository.disableByEmailNative(unsubscribeRequest.getEmail());
//		UnsubscribeEntity unsubscribeEntityResponse = unsubscribeRepository.save(unsubscribeEntity);
//		
//		emailService.sendUnsubscribeConfirmation(
//		        unsubscribeRequest.getEmail(),
//		        unsubscribeRequest.getUserName()
//		);
//		webhookSenderService.sendUnsubscribeNotification(unsubscribeRequest);
//		
//		UnsubscribeResponse unsubscribeResponse = createUnsubscribeEntityResponse(unsubscribeEntityResponse);
//		return unsubscribeResponse;
//	}

	@Override
	public UnsubscribeResponse createUnsubscribeDetails(UnsubscribeRequest unsubscribeRequest) {

		List<Object[]> studentDataList = registerStudentRepository
				.findUserNameAndStatusByEmail(unsubscribeRequest.getEmail());

		// ✅ Email not found
		if (studentDataList == null || studentDataList.isEmpty()) {

			throw new ResponseStatusException(HttpStatus.NOT_FOUND,
					"Email not found. Please check your email address.");
		}

		Object[] studentData = studentDataList.get(0);

		String dbUserName = studentData[0] != null ? studentData[0].toString() : "User";

		String status = studentData[1] != null ? studentData[1].toString() : "";

	
		if ("DISABLED".equalsIgnoreCase(status)) {

			throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Your email subscription is already disabled.");
		}
		UnsubscribeEntity unsubscribeEntity = new UnsubscribeEntity();
		String userName = unsubscribeRequest.getUserName();

		if (userName == null || userName.trim().isEmpty()) {
			userName = dbUserName;
		}
		unsubscribeEntity.setUserName(userName);
		unsubscribeEntity.setEmail(unsubscribeRequest.getEmail());
		unsubscribeEntity.setMobile(unsubscribeRequest.getMobile());
		unsubscribeEntity.setCountry(unsubscribeRequest.getCountry());
		unsubscribeEntity.setDate(LocalDate.now());
		unsubscribeEntity.setReason(unsubscribeRequest.getReason());
		unsubscribeEntity.setComments(unsubscribeRequest.getComments());
		unsubscribeEntity.setChooseDuration(unsubscribeRequest.getChooseDuration());

		registerStudentRepository.disableByEmailNative(unsubscribeRequest.getEmail());

		UnsubscribeEntity unsubscribeEntityResponse = unsubscribeRepository.save(unsubscribeEntity);

//		emailService.sendUnsubscribeConfirmation(unsubscribeRequest.getEmail(), userName);

//		webhookSenderService.sendUnsubscribeNotification(unsubscribeRequest);

		UnsubscribeResponse unsubscribeResponse = createUnsubscribeEntityResponse(unsubscribeEntityResponse);

		return unsubscribeResponse;
	}

	@Override
	public List<UnsubscribeResponse> getAllUnsubscribeDetails() {
		List<UnsubscribeEntity> listOfUnsubscribeEntities = unsubscribeRepository.findAllByOrderByDateDesc();

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
		unsubscribeResponse.setChooseDuration(unsubscribeEntityResponse.getChooseDuration());
		return unsubscribeResponse;
	}

}
