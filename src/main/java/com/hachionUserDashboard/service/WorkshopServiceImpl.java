package com.hachionUserDashboard.service;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import com.hachionUserDashboard.dto.WorkshopRequest;
import com.hachionUserDashboard.entity.Workshop;
import com.hachionUserDashboard.exception.ResourceNotFoundException;
import com.hachionUserDashboard.repository.WorkshopRepository;

import Response.WorkshopResponse;
import Service.WorkshopServiceInterface;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;

@Service
public class WorkshopServiceImpl implements WorkshopServiceInterface {

	@Autowired
	private WorkshopRepository workshopRepository;

	@Autowired
	private JavaMailSender mailSender;

	private final String ADMIN_EMAIL = "hachion.trainings@gmail.com";

	@Override
	public WorkshopResponse createWorkshop(WorkshopRequest workshopRequest) {

		try {

			sendToAdmin(workshopRequest);
			sendToUser(workshopRequest);

			Workshop workshop = new Workshop();
			workshop.setFullName(workshopRequest.getFullName());
			workshop.setEmailId(workshopRequest.getEmailId());
			workshop.setMobileNumber(workshopRequest.getMobileNumber());
			workshop.setTimeZone(workshopRequest.getTimeZone());

			String courseNames = String.join(", ", workshopRequest.getCourseName());
			workshop.setCourseName(courseNames);

			workshop.setCourseCategory(workshopRequest.getCourseCategory());
			workshop.setDate(workshopRequest.getDate());
			workshop.setTime(workshopRequest.getTimeZone());

			Workshop savedWorkshop = workshopRepository.save(workshop);

			WorkshopResponse workshopResponse = new WorkshopResponse();

			workshopResponse.setMessage(
					"Your details have been successfully sent to the team, and you will get a call shortly.");
			workshopResponse.setWorkshopId(savedWorkshop.getWorkshopId());
			workshopResponse.setCourseNames(Arrays.asList(savedWorkshop.getCourseName().split(", ")));
			workshopResponse.setCourseCategory(savedWorkshop.getCourseCategory());
			workshopResponse.setDate(savedWorkshop.getDate());
			workshopResponse.setTime(savedWorkshop.getTime());
			workshopResponse.setTimeZone(savedWorkshop.getTimeZone());
			workshopResponse.setFullName(savedWorkshop.getFullName());
			workshopResponse.setMobileNumber(savedWorkshop.getMobileNumber());
			workshopResponse.setEmailId(savedWorkshop.getEmailId());

			return workshopResponse;
		} catch (MessagingException e) {

			WorkshopResponse errorResponse = new WorkshopResponse();
			errorResponse.setMessage("Email sending failed. Registration not saved: " + e.getMessage());
			return errorResponse;
		}
	}

	private WorkshopResponse createResponseForWorkshop(Workshop savedWorkshop) {
		WorkshopResponse workshopResponse = new WorkshopResponse();
		workshopResponse.setWorkshopId(savedWorkshop.getWorkshopId());
		workshopResponse.setCourseNames(Arrays.asList(savedWorkshop.getCourseName().split(", ")));
		workshopResponse.setCourseCategory(savedWorkshop.getCourseCategory());
		workshopResponse.setDate(savedWorkshop.getDate());
		workshopResponse.setTime(savedWorkshop.getTime());
		workshopResponse.setTimeZone(savedWorkshop.getTimeZone());
		workshopResponse.setFullName(savedWorkshop.getFullName());
		workshopResponse.setMobileNumber(savedWorkshop.getMobileNumber());
		workshopResponse.setEmailId(savedWorkshop.getEmailId());
		return workshopResponse;
	}

	@Override
	public Optional<WorkshopResponse> getByWorkshopId(Long workshopId) {

		Optional<Workshop> byWorkshopId = workshopRepository.getByWorkshopId(workshopId);

		if (byWorkshopId.isEmpty()) {
			throw new ResourceNotFoundException("Workshop not found with ID: " + workshopId);
		}
		WorkshopResponse response = createResponseForWorkshop(byWorkshopId.get());

		return Optional.of(response);
	}

	@Override
	public WorkshopResponse updateWorkshop(WorkshopRequest workshopRequest) {

		Optional<Workshop> byWorkshopId = workshopRepository.getByWorkshopId(workshopRequest.getWorkshopId());

		if (byWorkshopId.isEmpty()) {
			throw new ResourceNotFoundException("Workshop not found");
		}
		Workshop workshop = byWorkshopId.get();
		if (workshopRequest.isCourseNameUpdated()) {
			String courseNames = String.join(", ", workshopRequest.getCourseName());
			workshop.setCourseName(courseNames);
		}
		if (workshopRequest.isCourseCategoryUpdated()) {
			workshop.setCourseCategory(workshopRequest.getCourseCategory());
		}
		if (workshopRequest.isDateUpdated()) {
			workshop.setDate(workshopRequest.getDate());
		}
		if (workshopRequest.isTimeUpdated()) {
			workshop.setTime(workshopRequest.getTime());
		}
		if (workshopRequest.isTimeZoneUpdated()) {
			workshop.setTimeZone(workshopRequest.getTimeZone());
		}
		if (workshopRequest.isFullNameUpdated()) {
			workshop.setFullName(workshopRequest.getFullName());
		}
		if (workshopRequest.isEmailIdUpdated()) {
			workshop.setEmailId(workshopRequest.getEmailId());
		}
		if (workshopRequest.isMobileNumberUpdated()) {
			workshop.setMobileNumber(workshopRequest.getMobileNumber());
		}
		Workshop updateWorkshop = workshopRepository.save(workshop);

		WorkshopResponse workshopResponse = createResponseForWorkshop(updateWorkshop);

		return workshopResponse;
	}

	@Override
	public List<WorkshopResponse> getFindByAllWorkshops() {
		List<Workshop> findByAllWorkshops = workshopRepository.getAllWorkshops();

		if (findByAllWorkshops.isEmpty()) {
			throw new ResourceNotFoundException("No workshops found.");
		}

		return findByAllWorkshops.stream().map(this::createResponseForWorkshop).collect(Collectors.toList());
	}

	@Override
	public void deleteById(Long workshopId) {
		workshopRepository.deleteById(workshopId);
	}

	private void sendToAdmin(WorkshopRequest formRequest) throws MessagingException {
		MimeMessage message = mailSender.createMimeMessage();
		MimeMessageHelper helper = new MimeMessageHelper(message, true);

		helper.setTo(ADMIN_EMAIL);
		helper.setSubject("New Registration - " + formRequest.getCourseName());
		helper.setText("New Registration Details:\n\n" + "Full Name: " + formRequest.getFullName() + "\n" + "Email: "
				+ formRequest.getEmailId() + "\n" + "Mobile: " + formRequest.getMobileNumber() + "\n" + "Time Zone: "
				+ formRequest.getTimeZone() + "\n" + "Course Name: " + formRequest.getCourseName());

		mailSender.send(message);
	}

	private void sendToUser(WorkshopRequest formRequest) throws MessagingException {
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

}
