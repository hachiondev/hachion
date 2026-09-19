package com.hachionUserDashboard.service;

import java.time.LocalDate;
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
		// Persist the lead FIRST. This is the entire business value of the
		// "Corporate Training" / "Contact With Us" forms - a lead captured in
		// the DB for the sales team to follow up on. Previously the two
		// confirmation emails were sent *before* repository.save(), and only
		// the checked jakarta.mail.MessagingException was caught - but
		// javaMailSender.send() (called inside sendToAdmin/sendToUser) throws
		// the *unchecked* org.springframework.mail.MailException family (e.g.
		// MailAuthenticationException when the configured Gmail SMTP app
		// password is rejected, whose own message is literally "Authentication
		// failed"). That exception was never caught here, so it escaped this
		// method entirely, the row was never saved, and the request came back
		// as an uncaught 400 from the app-wide GlobalExceptionHandler with that
		// raw, misleading mail-library text as the body - identical for both
		// "Get Free Consultation" and "Contact With Us", since both POST here.
		TalkToOurAdvisor entity = new TalkToOurAdvisor(null, ourAdvisor.getFullName(), ourAdvisor.getEmailId(),
				ourAdvisor.getNoOfPeople(), ourAdvisor.getCompanyName(), ourAdvisor.getMobileNumber(),
				ourAdvisor.getTrainingCourse(), ourAdvisor.getComments(), ourAdvisor.getCountry(), LocalDate.now());
		TalkToOurAdvisor savedEntity = repository.save(entity);

		TalkToOurAdvisorResponse response = new TalkToOurAdvisorResponse();
		response.setId(savedEntity.getId());
		response.setFullName(savedEntity.getFullName());
		response.setEmailId(savedEntity.getEmailId());
		response.setNoOfPeople(savedEntity.getNoOfPeople());
		response.setCompanyName(savedEntity.getCompanyName());
		response.setMobileNumber(savedEntity.getMobileNumber());
		response.setTrainingCourse(savedEntity.getTrainingCourse());
		response.setComments(savedEntity.getComments());
		response.setCountry(savedEntity.getCountry());
		response.setDate(savedEntity.getDate());

		try {
			sendToAdmin(ourAdvisor);
			sendToUser(ourAdvisor);
			response.setMessage("Your details have been successfully sent to the team, and you will get a call shortly.");
		} catch (Exception e) {
			// Broadened from `catch (MessagingException e)` - see comment above.
			// The lead is already safely saved regardless of this outcome, so
			// this is a warning, not a request failure.
			System.err.println("Advisor confirmation email failed (lead already saved, id=" + savedEntity.getId()
					+ "): " + e.getMessage());
			response.setMessage("Your details have been received. Our team will contact you shortly.");
		}

		return response;
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

		String emailContent = "Hi, " + formRequest.getFullName() + "\n\n" + "Welcome to Hachion\n"
				+ "We have received your query.\n"
				+ "Our Advisor will call you shortly or respond using the details provided by you.\n\n"
				+ "If you have any questions, please contact our support team at trainings@hachion.co or call us at 17324852499.\n"
				+ "We look forward to seeing you there!\n\n" + "Best regards,\n" + "Hachion Business Team\n";

		helper.setText(emailContent);
		mailSender.send(message);
	}

	@Override
	public List<TalkToOurAdvisorResponse> getAllTalkToOurAdvisor() {
		return repository.findAll().stream().map(this::mapToResponse).collect(Collectors.toList());
	}

	private TalkToOurAdvisorResponse mapToResponse(TalkToOurAdvisor entity) {

		TalkToOurAdvisorResponse advisorResponse = new TalkToOurAdvisorResponse();
		advisorResponse.setId(entity.getId());
		advisorResponse.setFullName(entity.getFullName());
		advisorResponse.setEmailId(entity.getEmailId());
		advisorResponse.setNoOfPeople(entity.getNoOfPeople());
		advisorResponse.setCompanyName(entity.getCompanyName());
		advisorResponse.setMobileNumber(entity.getMobileNumber());
		advisorResponse.setTrainingCourse(entity.getTrainingCourse());
		advisorResponse.setComments(entity.getComments());
		advisorResponse.setCountry(entity.getCountry());
		advisorResponse.setDate(entity.getDate());
		return advisorResponse;
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
