package com.hachionUserDashboard.service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import com.hachionUserDashboard.dto.TalkToOurAdvisorRequest;
import com.hachionUserDashboard.entity.TalkToOurAdvisor;
import com.hachionUserDashboard.repository.TalkToOurAdvisorRepository;

import Response.TalkToOurAdvisorResponse;
import Service.TalkToOurAdvisorServiceInterface;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;

@Service
public class TalkToOurAdvisorServiceImpl implements TalkToOurAdvisorServiceInterface {

	@Autowired
	private TalkToOurAdvisorRepository repository;

	@Autowired
	private JavaMailSender mailSender;

	private final String ADMIN_EMAIL = "hachion.trainings@gmail.com";

	@Override
	public TalkToOurAdvisorResponse createTalkToOurAdvisor(TalkToOurAdvisorRequest ourAdvisor) {
		try {

			sendToAdmin(ourAdvisor);
			sendToUser(ourAdvisor);

			TalkToOurAdvisor entity = new TalkToOurAdvisor(null, ourAdvisor.getFullName(), ourAdvisor.getEmailId(),
					ourAdvisor.getNoOfPeople(), ourAdvisor.getCompanyName(), ourAdvisor.getMobileNumber(),
					ourAdvisor.getTrainingCourse(), ourAdvisor.getComments());
			TalkToOurAdvisor savedEntity = repository.save(entity);

			TalkToOurAdvisorResponse response = new TalkToOurAdvisorResponse();
			response.setMessage("Your details have been successfully sent to the team, and you will get a call shortly.");
			response.setId(savedEntity.getId());
			response.setFullName(savedEntity.getFullName());
			response.setEmailId(savedEntity.getEmailId());
			response.setNoOfPeople(savedEntity.getNoOfPeople());
			response.setCompanyName(savedEntity.getCompanyName());
			response.setMobileNumber(savedEntity.getMobileNumber());
			response.setTrainingCourse(savedEntity.getTrainingCourse());
			response.setComments(savedEntity.getComments());
			return response;
		} catch (MessagingException e) {
		
			TalkToOurAdvisorResponse errorResponse = new TalkToOurAdvisorResponse();
			errorResponse.setMessage("Email sending failed. Request not saved: " + e.getMessage());
			return errorResponse;
		}
	}

	private void sendToAdmin(TalkToOurAdvisorRequest toOurAdvisorRequest) throws MessagingException {
		MimeMessage message = mailSender.createMimeMessage();
		MimeMessageHelper helper = new MimeMessageHelper(message, true);

		helper.setTo(ADMIN_EMAIL);
		helper.setSubject("New Advisor Inquiry - " + toOurAdvisorRequest.getFullName());
		helper.setText("New Inquiry Details:\n\n" + "Full Name: " + toOurAdvisorRequest.getFullName() + "\n" + "Email: "
				+ toOurAdvisorRequest.getEmailId() + "\n" + "Mobile: " + toOurAdvisorRequest.getMobileNumber() + "\n"
				+ "Company Name: " + toOurAdvisorRequest.getCompanyName() + "\n" + "Training Course of Interest: "
				+ toOurAdvisorRequest.getTrainingCourse() + "\n" + "Comments: " + toOurAdvisorRequest.getComments());

		mailSender.send(message);
	}

	public void sendToUser(TalkToOurAdvisorRequest formRequest) throws MessagingException {
	    MimeMessage message = mailSender.createMimeMessage();
	    MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

	    helper.setTo(formRequest.getEmailId());
	    helper.setSubject("Successfully submitted Talk to our advisor form");

	    String emailContent = "Hi, " + formRequest.getFullName() + "\n\n" +
	            "Welcome to Hachion\n" +
	            "We have received your query.\n" +
	            "Our Advisor will call you shortly or respond using the details provided by you.\n\n" +
	            "If you have any questions, please contact our support team at trainings.hachion@gmail.com or call us at 17324852499.\n" +
	            "We look forward to seeing you there!\n\n" +
	            "Best regards,\n" +
	            "Hachion Business Team\n";

	    helper.setText(emailContent);
	    mailSender.send(message);
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
