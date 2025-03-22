package com.hachionUserDashboard.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import com.hachionUserDashboard.dto.FormRequest;
import com.hachionUserDashboard.entity.UsersWorkshop;
import com.hachionUserDashboard.repository.UsersWorkshopRepository;

import Response.UserWorkshopResponse;
import Service.UsersWorkshopService;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;

@Service
public class UsersWorkshopServiceimpl implements UsersWorkshopService {

	@Autowired
	private UsersWorkshopRepository usersWorkshopRepository;

	@Autowired
	private JavaMailSender mailSender;

	private final String ADMIN_EMAIL = "hachion.trainings@gmail.com";

	public UserWorkshopResponse userWorkshopRegistration(FormRequest formRequest) {
		try {

			sendToAdmin(formRequest);
			sendToUser(formRequest);

			UsersWorkshop user = new UsersWorkshop();
			user.setFullName(formRequest.getFullName());
			user.setEmailId(formRequest.getEmailId());
			user.setMobileNumber(formRequest.getMobileNumber());
			user.setTimeZone(formRequest.getTimeZone());
			user.setCourseName(formRequest.getCourseName());
			usersWorkshopRepository.save(user);

			UserWorkshopResponse response = new UserWorkshopResponse();
			response.setMessage("Your details has been successfully sent to the team and you will get call shortly.");
			response.setFullName(formRequest.getFullName());
			response.setEmailId(formRequest.getEmailId());
			response.setCourseName(formRequest.getCourseName());
			response.setTimeZone(formRequest.getTimeZone());

			return response;

		} catch (MessagingException e) {

			UserWorkshopResponse errorResponse = new UserWorkshopResponse();
			errorResponse.setMessage("Email sending failed. Registration not saved: " + e.getMessage());
			return errorResponse;
		}
	}

	private void sendToAdmin(FormRequest formRequest) throws MessagingException {
		MimeMessage message = mailSender.createMimeMessage();
		MimeMessageHelper helper = new MimeMessageHelper(message, true);

		helper.setTo(ADMIN_EMAIL);
		helper.setSubject("New Registration - " + formRequest.getCourseName());
		helper.setText("New Registration Details:\n\n" + "Full Name: " + formRequest.getFullName() + "\n" + "Email: "
				+ formRequest.getEmailId() + "\n" + "Mobile: " + formRequest.getMobileNumber() + "\n" + "Time Zone: "
				+ formRequest.getTimeZone() + "\n" + "Course Name: " + formRequest.getCourseName());

		mailSender.send(message);
	}

	private void sendToUser(FormRequest formRequest) throws MessagingException {
		MimeMessage message = mailSender.createMimeMessage();
		MimeMessageHelper helper = new MimeMessageHelper(message, true);

		helper.setTo(formRequest.getEmailId());
		helper.setCc("trainings@hachion.co");

		helper.setSubject("Your Registration for " + formRequest.getCourseName() + " Workshop is Successful!");

		String emailContent = "Dear " + formRequest.getFullName() + ",\n\n" + "Thank you for registering for our "
				+ formRequest.getCourseName() + " Workshop! We’re excited to have you join us.\n\n"
				+ "Your registration has been successfully completed. Keep an eye on your inbox for further details and reminders as we approach the event date.\n\n"
				+ "If you have any questions, feel free to contact us at hachion.trainings@hachion.co.\n\n"
				+ "We look forward to seeing you at the workshop!\n\n" + "Regards,\n" + "Team Hachion";

		helper.setText(emailContent);

		mailSender.send(message);
	}

	@Override
	public List<UsersWorkshop> getAllUsers() {

		return usersWorkshopRepository.findAll();
	}

}
