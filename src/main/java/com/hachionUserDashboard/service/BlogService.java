package com.hachionUserDashboard.service;

import java.time.LocalDate;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.hachionUserDashboard.dto.BlogInquiryRequest;
import com.hachionUserDashboard.entity.RegisterStudent;
import com.hachionUserDashboard.entity.StudentRemarksHistory;
import com.hachionUserDashboard.repository.RegisterStudentRepository;
import com.hachionUserDashboard.repository.StudentRemarksHistoryRepository;

import jakarta.mail.MessagingException;

@Service
public class BlogService {

	@Autowired
	private RegisterStudentRepository studentRepo;

	@Autowired
	private StudentRemarksHistoryRepository remarksRepo;
	
	@Autowired
	private PasswordEncoder passwordEncoder;
	
	@Autowired
	private EmailService emailService;
	
	@Autowired
	private WebhookSenderService webhookSenderService;

	public void saveBlogInquiry(BlogInquiryRequest request) throws MessagingException {

	    RegisterStudent student = null;

	    if (request.getEmail() != null) {

	        Optional<RegisterStudent> optionalStudent = studentRepo.findByEmailForProfile(request.getEmail());

	        if (optionalStudent != null && optionalStudent.isPresent()) {
	            student = optionalStudent.get();
	        }
	    }

	    if (student == null) {

	        student = new RegisterStudent();
	        student.setStudentId(generateNextStudentId());
	        student.setEmail(request.getEmail());
	        student.setUserName(request.getName());
	        String tempPassword = "Hach@123";
			String hashedPassword = passwordEncoder.encode(tempPassword);
			student.setPassword(hashedPassword);
	        student.setMobile(request.getPhone());
	        student.setCourse_name(request.getBlogTitle());
	        student.setMode("Online");
	        student.setDate(LocalDate.now());
	        student.setStatus("ACTIVE");
	        student.setTime_zone(request.getTimeZone());
	        student.setCountry(request.getCountry());
	        student.setWhatsapp(request.getPhone());
	        
	        student = studentRepo.save(student);
	        
	        emailService.sendEmailForRegisterOfflineStudent(student.getEmail(), tempPassword, student.getUserName());
	        webhookSenderService.sendRegistrationDetailsOffline(student);
	    }

	    if (request.getQuery() != null && !request.getQuery().trim().isEmpty()) {

	        StudentRemarksHistory history = new StudentRemarksHistory();
	        history.setRemark(request.getQuery());
	        history.setCallMadeOn(LocalDate.now().toString());
	        history.setStudent(student);

	        remarksRepo.save(history);
	    }
	}
	private String generateNextStudentId() {
		String prefix = "HACH";
		String lastStudentId = studentRepo.findTopByOrderByStudentIdDesc();

		int nextNumber = 1;

		if (lastStudentId != null && lastStudentId.startsWith(prefix)) {
			String numberPart = lastStudentId.substring(prefix.length());
			try {
				nextNumber = Integer.parseInt(numberPart) + 1;
			} catch (NumberFormatException e) {
				nextNumber = 1;
			}
		}

		return prefix + String.format("%03d", nextNumber);
	}
}
