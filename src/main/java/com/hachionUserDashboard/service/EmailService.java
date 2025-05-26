package com.hachionUserDashboard.service;
import java.io.File;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.FileSystemResource;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    public void sendEmail(String to, String subject, String text) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(to);
        message.setSubject(subject);
        message.setText(text);
        message.setFrom("hachion.trainings@gmail.com");

        mailSender.send(message);
    }
    public void sendEmailWithAttachment(String to, byte[] attachmentBytes, String subject, String body)
            throws MessagingException {
        
        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true);
        
        helper.setTo(to);
        helper.setSubject(subject);
        helper.setText(body);
        helper.addAttachment("Certificate.pdf", new ByteArrayResource(attachmentBytes));

        mailSender.send(message);
    }
    public void sendInvoiceEmail(String toEmail, String studentName, String invoicePath) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true);

            helper.setTo(toEmail);
            helper.setSubject("Invoice from Hachion");
            helper.setText("Dear " + studentName + ",\n\nPlease find your invoice attached.\n\nRegards,\nHachion");

            FileSystemResource file = new FileSystemResource(new File(invoicePath));
            helper.addAttachment("Invoice.pdf", file);

            mailSender.send(message);
            System.out.println("Invoice email sent to: " + toEmail);
        } catch (MessagingException e) {
            System.err.println("Failed to send email: " + e.getMessage());
            throw new RuntimeException("Email sending failed", e);
        }
    }
}
