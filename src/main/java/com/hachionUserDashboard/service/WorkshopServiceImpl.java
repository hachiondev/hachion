package com.hachionUserDashboard.service;

import java.io.File;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.FileSystemResource;
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

	@Value("${image.upload.path}")
	private String imageUploadPath;

	private final String ADMIN_EMAIL = "trainings@hachion.co";

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
			workshop.setCountry(workshopRequest.getCountry());
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
			workshopResponse.setCountry(savedWorkshop.getCountry());
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
		workshopResponse.setCountry(savedWorkshop.getCountry());
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

		if (workshopRequest.isCountryUpdated()) {
			workshop.setCountry(workshopRequest.getCountry());
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
		helper.setSubject("Your Registration for " + formRequest.getCourseName() + " Workshop is Successful!");

		String emailContent = "<html><head><style>"
				+ "body { font-family: Arial, sans-serif; margin: 0; padding: 0; background-color: #f5f5f5; text-align: center; }"
				+ ".email-container { max-width: 600px; margin: 20px auto; background-color: #ffffff; border-radius: 10px; "
				+ "box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); padding: 20px; text-align: center; }"
				+ ".header img { width: 100%; height: auto; border-radius: 10px 10px 0 0; }"
				+ ".content { padding: 20px; font-size: 16px; color: #333333; text-align: left; }"
				+ ".content p { margin: 10px 0; line-height: 1.6; }"
				+ ".highlight { color: #4CAF50; font-weight: bold; }" + ".list { padding-left: 20px; }"
				+ ".footer { background-color: #011538; padding: 20px; color: white; font-size: 14px; border-radius: 0 0 10px 10px; }"
//	            + ".footer { background-color: #0077b6; padding: 20px; color: white; font-size: 14px; border-radius: 0 0 10px 10px; }"
//	            + ".footer p { margin: 10px 0; font-size: 16px; text-align: center; }"
				+ ".footer p { margin: 10px 0; font-size: 16px; text-align: center; color: white; }"

				+ ".social-icons { text-align: center; margin-top: 10px; }"
				+ ".social-icons a { margin: 0 10px; text-decoration: none; display: inline-block; }"
				+ ".social-icons img { width: 30px; height: 30px; }" + "</style></head><body>"

				+ "<div class='email-container'>"

				// Header Image
				+ "<div class='header'><img src='cid:headerImage' alt='Workshop Header'/></div>"

				// Middle Content
				+ "<div class='content'>"
				+ "<p>The future of cloud technology is here, and <span class='highlight'>Salesforce expertise</span> is your ticket to a rewarding career!</p>"
				+ "<p>At Hachion, we’ve already helped hundreds of professionals like you transition into high-demand Salesforce roles through our hands-on Workshop Program. Here’s what awaits you:</p>"
				+ "<ul style='list-style-type: none; padding: 0; margin: 0;'>"
				+ "<li>✅ Master Salesforce fundamentals (Admin, Development, Lightning)</li>"
				+ "<li>✅ Build real-world projects for your portfolio</li>"
				+ "<li>✅ Get certified with personal coaching</li>"
				+ "<li>✅ Connect with top employers in our network</li>" + "</ul>"
				+ "<p><b>Limited seats available!</b></p>" + "<p>📅 <b>Next batch starts:</b> (Every week)</p>"
				+ "<p>⏰ <b>Duration:</b> 25 weeks | 10 AM EST</p>" + "<p>Ready to transform your career?</p>"
				+ "<p>📩 <b>Start attending a couple of free sessions</b></p>"
				+ "<p>✉️ <b>Let’s connect with the training coordinator</b> to get session access:</p>"
				+ "<p>📞 1-732-485-2499 | 📧 <a href='mailto:trainings@hachion.co'>trainings@hachion.co</a></p>"
				+ "<p>Best Regards,</p>" + "<p><b>Hachion Support Team</b></p>" + "</div>"

				// Footer with Social Media Links
				+ "<div class='footer'>"
				+ "<p>Follow us on social media for exclusive summer career tips and inspiration that's as refreshing as a beach day!</p>"
				+ "<div class='social-icons'>"
				+ "    <a href='https://www.instagram.com/hachion_trainings' target='_blank'><img src='cid:instagramIcon' alt='Instagram'/></a>"
				+ "    <a href='https://www.facebook.com/hachion.co' target='_blank'><img src='cid:facebookIcon' alt='Facebook'/></a>"
				+ "    <a href='https://www.youtube.com/@hachion' target='_blank'><img src='cid:youtubeIcon' alt='YouTube'/></a>"
				+ "    <a href='https://x.com/hachion_co' target='_blank'><img src='cid:twitterIcon' alt='Twitter'/></a>"
				+ "    <a href='https://www.linkedin.com/company/hachion' target='_blank'><img src='cid:linkedinIcon' alt='LinkedIn'/></a>"
				+ "</div>" + "</div>"

				+ "</div></body></html>";

		helper.setText(emailContent, true);

		// Attach Header Image
		FileSystemResource headerRes = new FileSystemResource(new File(imageUploadPath + "SF Workshop.jpg"));
		helper.addInline("headerImage", headerRes);

		// Attach Instagram icon
		FileSystemResource instagramRes = new FileSystemResource(new File(imageUploadPath + "instagram.png"));
		helper.addInline("instagramIcon", instagramRes);

		// Attach Facebook icon
		FileSystemResource facebookRes = new FileSystemResource(new File(imageUploadPath + "facebook.png"));
		helper.addInline("facebookIcon", facebookRes);

		// Attach YouTube icon
		FileSystemResource youtubeRes = new FileSystemResource(new File(imageUploadPath + "youtube.png"));
		helper.addInline("youtubeIcon", youtubeRes);

		// Attach Twitter (X) icon
		FileSystemResource twitterRes = new FileSystemResource(new File(imageUploadPath + "twitter.png"));
		helper.addInline("twitterIcon", twitterRes);

		// Attach LinkedIn icon
		FileSystemResource linkedinRes = new FileSystemResource(new File(imageUploadPath + "linkedin.png"));
		helper.addInline("linkedinIcon", linkedinRes);

		// Attach header image
//		FileSystemResource headerRes = new FileSystemResource(
//				new File("C:/Users/laksh/git/hachion/uploads/images/SF Workshop.jpg"));
//		helper.addInline("headerImage", headerRes);

		// Attach social media icons
//		FileSystemResource instagramRes = new FileSystemResource(
//				new File("C:/Users/laksh/git/hachion/uploads/images/instagram.png"));
//		helper.addInline("instagramIcon", instagramRes);
//
//		FileSystemResource facebookRes = new FileSystemResource(
//				new File("C:/Users/laksh/git/hachion/uploads/images/facebook.png"));
//		helper.addInline("facebookIcon", facebookRes);
//
//		FileSystemResource youtubeRes = new FileSystemResource(
//				new File("C:/Users/laksh/git/hachion/uploads/images/youtube.png"));
//		helper.addInline("youtubeIcon", youtubeRes);
//
//		// Attach Twitter (X) icon
//		FileSystemResource twitterRes = new FileSystemResource(
//				new File("C:/Users/laksh/git/hachion/uploads/images/twitter.png"));
//		helper.addInline("twitterIcon", twitterRes);
//
//		// Attach LinkedIn icon
//		FileSystemResource linkedinRes = new FileSystemResource(
//				new File("C:/Users/laksh/git/hachion/uploads/images/linkedin.png"));
//		helper.addInline("linkedinIcon", linkedinRes);

		mailSender.send(message);
		System.out.println("Email sent successfully!");
	}

}
