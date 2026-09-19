package com.hachionUserDashboard.service;

import java.time.LocalDate;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.hachionUserDashboard.dto.EnrollmentWebhookRequest;
import com.hachionUserDashboard.entity.RegisterStudent;
import com.hachionUserDashboard.entity.StudentRemarksHistory;
import com.hachionUserDashboard.repository.RegisterStudentRepository;
import com.hachionUserDashboard.repository.StudentRemarksHistoryRepository;

import jakarta.mail.MessagingException;

@Service
public class EnrollmentService {

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

    public void saveEnrollmentForm(
            EnrollmentWebhookRequest request)
            throws MessagingException {

        RegisterStudent student = null;

        if (request.getEmail() != null) {

            Optional<RegisterStudent> optionalStudent =
                    studentRepo.findByEmailForProfile(
                            request.getEmail());

            if (optionalStudent.isPresent()) {
                student = optionalStudent.get();
            }
        }

        if (student == null) {

            student = new RegisterStudent();

            student.setStudentId(generateNextStudentId());

            student.setUserName(request.getName());

            student.setEmail(request.getEmail());

            String tempPassword = "Hach@123";

            student.setPassword(
                    passwordEncoder.encode(tempPassword));

            student.setMobile(request.getPhone());

            student.setWhatsapp(request.getPhone());

            student.setCourse_name(request.getCourseName());

            student.setMode("Online");

            student.setDate(LocalDate.now());

            student.setStatus("ACTIVE");

            student.setCountry(request.getCountry());

            student = studentRepo.save(student);

            emailService.sendEmailForRegisterOfflineStudent(
                    student.getEmail(),
                    tempPassword,
                    student.getUserName());

            webhookSenderService
                    .sendRegistrationDetailsOffline(student);
        }

        if (request.getRemark() != null
                && !request.getRemark().trim().isEmpty()) {

            StudentRemarksHistory history =
                    new StudentRemarksHistory();

            history.setRemark(request.getRemark());

            history.setCallMadeOn(
                    LocalDate.now().toString());

            history.setStudent(student);

            remarksRepo.save(history);
        }
    }

    private String generateNextStudentId() {

        String prefix = "HACH";

        String lastStudentId =
                studentRepo.findTopByOrderByStudentIdDesc();

        int nextNumber = 1;

        if (lastStudentId != null
                && lastStudentId.startsWith(prefix)) {

            String numberPart =
                    lastStudentId.substring(prefix.length());

            try {
                nextNumber =
                        Integer.parseInt(numberPart) + 1;
            } catch (Exception e) {
                nextNumber = 1;
            }
        }

        return prefix + String.format("%03d", nextNumber);
    }
}