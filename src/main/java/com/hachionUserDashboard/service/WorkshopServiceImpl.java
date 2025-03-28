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

//		try {
//
//			sendToAdmin(workshopRequest);
//			sendToUser(workshopRequest);

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
//		} catch (MessagingException e) {
//
//			WorkshopResponse errorResponse = new WorkshopResponse();
//			errorResponse.setMessage("Email sending failed. Registration not saved: " + e.getMessage());
//			return errorResponse;
//		}
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

	public void sendToUser(WorkshopRequest formRequest) throws MessagingException {
	    MimeMessage message = mailSender.createMimeMessage();
	    MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

	    helper.setTo(formRequest.getEmailId());
	    helper.setCc("trainings@hachion.co");
	    helper.setSubject("Your Registration for " + formRequest.getCourseName() + " Workshop is Successful!");

	    String emailContent = "<html><head><style>"
	            + "body { font-family: Arial, sans-serif; margin: 0; padding: 0; background-color: #e0e0e0; }"
	            + ".email-container { max-width: 600px; margin: 20px auto; background-color: #ffffff; border-radius: 10px; overflow: hidden; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); }"
	            + ".strip { padding: 20px; border-bottom: 2px solid #f2f2f2; }"
	            + ".header-strip, .footer-strip { background-color: #4CAF50; color: #ffffff; text-align: center; }"  // Green color for both header and footer
	            + ".header-strip h1 { font-size: 50px; font-weight: bold; margin: 0; text-transform: uppercase; }"  // Hachion in capital letters
	            + ".header-strip p { font-size: 18px; font-weight: bold; margin: 10px 0; }" // Added "Welcome Registration Successful"
	            + ".content-strip { background-color: #f9f9f9; color: #333333; text-align: left; }"
	            + ".content-strip p { margin: 10px 0; line-height: 1.6; }"
	            + ".highlight { color: #4CAF50; font-weight: bold; }"
	            + ".footer-strip p { margin: 5px 0; font-weight: bold; color: white; }"  // White color for text in footer
	            + "</style></head><body>"
	            + "<div class='email-container'>"
	            
	            // Header Strip (HACHION + Welcome Registration Successful)
	            + "<div class='strip header-strip'>"
	            + "    <h1>HACHION</h1>"  // Hachion in capital letters
	            + "    <p>Welcome! Registration Successful</p>"  // Added "Welcome Registration Successful"
	            + "</div>"
	            
	            // Content Strip (Welcome message)
	            + "<div class='strip content-strip'>"
	            + "    <p>Dear <span class='highlight'>" + formRequest.getFullName() + "</span>,</p>"
	            + "    <p>Thank you for registering for our <span class='highlight'>" + formRequest.getCourseName() + "</span> Workshop! We’re excited to have you join us.</p>"
	            + "    <p>Your registration has been successfully completed. Keep an eye on your inbox for further details and reminders as we approach the event date.</p>"
	            + "    <p>If you have any questions, feel free to contact us at <a class='highlight' href='mailto:trainings@hachion.co'>trainings@hachion.co</a>.</p>"
	            + "    <p>We look forward to seeing you at the workshop!</p>"
	            + "</div>"
	            
	            // Footer Strip (Best Regards + Team Hachion)
	            + "<div class='strip footer-strip'>"
	            + "    <p>Best Regards,</p>"
	            + "    <p>Team Hachion</p>"
	            + "</div>"
	            
	            + "</div>"
	            + "</body></html>";


	    helper.setText(emailContent, true);
	    mailSender.send(message);
	}



}
