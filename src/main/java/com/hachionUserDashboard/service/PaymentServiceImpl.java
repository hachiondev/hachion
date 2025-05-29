package com.hachionUserDashboard.service;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.OutputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.ui.Model;
import org.springframework.web.multipart.MultipartFile;
import org.thymeleaf.context.Context;
import org.thymeleaf.spring6.SpringTemplateEngine;

import com.hachionUserDashboard.dto.PaymentInstallmentRequest;
import com.hachionUserDashboard.dto.PaymentInstallmentResponse;
import com.hachionUserDashboard.dto.PaymentRequest;
import com.hachionUserDashboard.dto.PaymentResponse;
import com.hachionUserDashboard.dto.StudentCourseInfo;
import com.hachionUserDashboard.entity.Payment;
import com.hachionUserDashboard.entity.PaymentInstallment;
import com.hachionUserDashboard.exception.ResourceNotFoundException;
import com.hachionUserDashboard.repository.CourseRepository;
import com.hachionUserDashboard.repository.EnrollRepository;
import com.hachionUserDashboard.repository.PaymentRepository;
import com.openhtmltopdf.pdfboxout.PdfRendererBuilder;

import Service.PaymentService;

@Service
public class PaymentServiceImpl implements PaymentService {

	@Autowired
	private PaymentRepository paymentRepository;

	@Autowired
	private EnrollRepository enrollRepository;

	@Autowired
	private CourseRepository courseRepository;

	@Autowired
	private EmailService emailService;

	@Autowired
	private SpringTemplateEngine templateEngine;

//	private static final String UPLOAD_DIR = "uploads/images/";

	@Value("${payments.upload.path}")
	private String paymentsUploadPath;

	@Value("${invoice.path}")
	private String invoiceDirectoryPath;

	@Override
	public PaymentResponse addPayment(PaymentRequest paymentRequest, List<MultipartFile> files) {
		Payment payment = new Payment();

		payment.setStudentId(paymentRequest.getStudentId());
		payment.setStudentName(paymentRequest.getStudentName());
		payment.setEmail(paymentRequest.getEmail());
		payment.setMobile(paymentRequest.getMobile());
		payment.setCourseName(paymentRequest.getCourseName());
		payment.setCourseFee(paymentRequest.getCourseFee());
		payment.setTax(paymentRequest.getTax());
		payment.setDiscount(paymentRequest.getDiscount());
		payment.setNumberOfInstallments(paymentRequest.getNoOfInstallments());
		payment.setNumberOfDays(paymentRequest.getNoOfDays());
		payment.setTotalAmount(paymentRequest.getTotalAmount());
		payment.setBalancePay(paymentRequest.getBalancePay());

		List<PaymentInstallment> installmentEntities = new ArrayList<>();
		int numberOfDays = paymentRequest.getNoOfDays();
		int noOfInstallments = paymentRequest.getNoOfInstallments();

		LocalDate currentDueDate = LocalDate.now();

		List<PaymentInstallmentRequest> installmentRequests = paymentRequest.getInstallments();

		for (int i = 0; i < installmentRequests.size(); i++) {
			PaymentInstallmentRequest instReq = installmentRequests.get(i);
			PaymentInstallment installment = new PaymentInstallment();

			installment.setNumberOfInstallments(instReq.getNumberOfInstallments());
			installment.setPayDate(instReq.getPayDate());
			installment.setActualPay(instReq.getActualPay());
			installment.setReceivedPay(instReq.getReceivedPay());
			installment.setPaymentMethod(instReq.getPaymentMethod());

			if (files != null && files.size() > i && !files.get(i).isEmpty()) {
				MultipartFile file = files.get(i);
				try {
					Path dirPath = Paths.get(paymentsUploadPath);
					System.out.println("Creating directories at: " + dirPath.toAbsolutePath());
					Files.createDirectories(dirPath);

					Path filePath = dirPath.resolve(file.getOriginalFilename());
					System.out.println("Resolved file path: " + filePath.toAbsolutePath());
					System.out.println("Parent exists: " + Files.exists(filePath.getParent()));
					System.out.println("Writing file: " + file.getOriginalFilename());

					Files.write(filePath, file.getBytes());

					System.out.println("File successfully written to: " + filePath.toAbsolutePath());

					installment.setProof(file.getOriginalFilename());

				} catch (IOException e) {
					System.err.println("IOException while writing file: " + e.getMessage());
					throw new RuntimeException("Failed to save file for installment " + (i + 1));
				}
			}

			if ((installment.getProof() == null || installment.getProof().isBlank()) && instReq.getProof() != null) {
				installment.setProof(instReq.getProof());
			}

			installment.setReference(instReq.getReference());

			if (i == 0) {

				installment.setDueDate(instReq.getPayDate());
				currentDueDate = installment.getDueDate();
			} else if (i < noOfInstallments) {
				currentDueDate = currentDueDate.plusDays(numberOfDays);
				installment.setDueDate(currentDueDate);
			}

			installment.setPayment(payment);
			installmentEntities.add(installment);
		}

		payment.setInstallments(installmentEntities);
		Payment savedPayment = paymentRepository.save(payment);

		String courseName = savedPayment.getCourseName();
		String courseAbbreviation = courseName.replaceAll("[^A-Za-z]", "").toUpperCase();
		courseAbbreviation = courseAbbreviation.length() > 5 ? courseAbbreviation.substring(0, 5) : courseAbbreviation;

		String formattedDate = new SimpleDateFormat("MMddyyyy").format(new Date());
		String invoiceNumber = "HACH" + courseAbbreviation + formattedDate + "-" + savedPayment.getPaymentId();
		System.out.println(invoiceNumber);

		savedPayment.setInvoiceNumber(invoiceNumber);
		paymentRepository.save(savedPayment);

		return createPaymentResponse(savedPayment);
	}

	@Override
	public List<PaymentResponse> findAllPaymentdetails() {
		List<Payment> lsitofPayments = paymentRepository.findAll();
		List<PaymentResponse> listofPaymentResponses = new ArrayList<>();

		for (Payment payment : lsitofPayments) {
			PaymentResponse paymentResponse = createPaymentResponse(payment);
			listofPaymentResponses.add(paymentResponse);
		}

		return listofPaymentResponses;
	}

	@Override
	public PaymentResponse updatePayment(Long paymentId, PaymentRequest paymentRequest, MultipartFile file,
			Long proofInstallmentId) {
		Payment payment = paymentRepository.findById(paymentId)
				.orElseThrow(() -> new RuntimeException("Payment not found with ID: " + paymentId));

		if (paymentRequest.getStudentId() != null)
			payment.setStudentId(paymentRequest.getStudentId());
		if (paymentRequest.getStudentName() != null)
			payment.setStudentName(paymentRequest.getStudentName());
		if (paymentRequest.getEmail() != null)
			payment.setEmail(paymentRequest.getEmail());
		if (paymentRequest.getMobile() != null)
			payment.setMobile(paymentRequest.getMobile());
		if (paymentRequest.getCourseName() != null)
			payment.setCourseName(paymentRequest.getCourseName());
		if (paymentRequest.getCourseFee() != null)
			payment.setCourseFee(paymentRequest.getCourseFee());
		if (paymentRequest.getTax() != null)
			payment.setTax(paymentRequest.getTax());
		if (paymentRequest.getDiscount() != null)
			payment.setDiscount(paymentRequest.getDiscount());
		if (paymentRequest.getNoOfInstallments() != null)
			payment.setNumberOfInstallments(paymentRequest.getNoOfInstallments());
		if (paymentRequest.getNoOfDays() != null)
			payment.setNumberOfDays(paymentRequest.getNoOfDays());
		if (paymentRequest.getTotalAmount() != null)
			payment.setTotalAmount(paymentRequest.getTotalAmount());
		if (paymentRequest.getBalancePay() != null)
			payment.setBalancePay(paymentRequest.getBalancePay());

		if (paymentRequest.getInstallments() != null && !paymentRequest.getInstallments().isEmpty()) {
			List<PaymentInstallment> existingInstallments = payment.getInstallments();

			for (PaymentInstallmentRequest instReq : paymentRequest.getInstallments()) {
				PaymentInstallment installment;

				if (instReq.getInstallmentId() != null) {
					installment = existingInstallments.stream()
							.filter(ins -> ins.getInstallmentId().equals(instReq.getInstallmentId())).findFirst()
							.orElseThrow(
									() -> new RuntimeException("Installment not found: " + instReq.getInstallmentId()));
				} else {
					installment = new PaymentInstallment();
					installment.setPayment(payment);
					existingInstallments.add(installment);
				}

				installment.setNumberOfInstallments(instReq.getNumberOfInstallments());
				installment.setPayDate(instReq.getPayDate());
				installment.setActualPay(instReq.getActualPay());
				installment.setReceivedPay(instReq.getReceivedPay());
				installment.setPaymentMethod(instReq.getPaymentMethod());
				installment.setReference(instReq.getReference());
				installment.setDueDate(instReq.getDueDate());

				if (proofInstallmentId != null && file != null && !file.isEmpty()) {
					if (proofInstallmentId.equals(instReq.getInstallmentId())) {
						try {
							String originalFilename = file.getOriginalFilename();
							Path uploadDirPath = Paths.get(paymentsUploadPath);
							Files.createDirectories(uploadDirPath);

							Path filePath = uploadDirPath.resolve(originalFilename);
							Files.write(filePath, file.getBytes());

							installment.setProof(originalFilename);
						} catch (IOException e) {
							throw new RuntimeException(
									"Failed to save file for installment " + instReq.getInstallmentId());
						}
					}
				}

				if ((installment.getProof() == null || installment.getProof().isBlank())
						&& instReq.getProof() != null) {
					installment.setProof(instReq.getProof());
				}
			}

			if (paymentRequest.getBalancePay() != null && paymentRequest.getBalancePay() == 0) {
				List<PaymentInstallment> toKeep = existingInstallments.stream()
						.filter(i -> i.getReceivedPay() != null && i.getReceivedPay() > 0).collect(Collectors.toList());

				payment.getInstallments().clear();
				payment.getInstallments().addAll(toKeep);
			}
		}

		Payment updatedPayment = paymentRepository.save(payment);
		return createPaymentResponse(updatedPayment);
	}

	@Override
	public StudentCourseInfo getStudentCourseInfo(String studentId, String email, String mobile) {
		List<Object[]> results = enrollRepository.findStudentCourseInfo(studentId, email, mobile);

		if (results.isEmpty())
			return null;

		Set<String> courses = new HashSet<>();
		String id = null, name = null, emailId = null, mobileNum = null;

		for (Object[] row : results) {
			id = (String) row[0];
			name = (String) row[1];
			emailId = (String) row[2];
			mobileNum = (String) row[3];
			courses.add((String) row[4]);
		}

		return new StudentCourseInfo(id, name, emailId, mobileNum, new ArrayList<>(courses));
	}

	@Override
	public Double getAmountByCourseName(String courseName) {
		Double amount = courseRepository.findAmountByCourseName(courseName);
		if (amount == null) {
			throw new ResourceNotFoundException("This course is not available in the system");
		}
		return amount;
	}

	@Override
	public void deletePaymentById(Long id) {
		Optional<Payment> optionalPayment = paymentRepository.findById(id);

		if (optionalPayment.isPresent()) {
			Payment payment = optionalPayment.get();

			List<PaymentInstallment> installments = payment.getInstallments();
			if (installments != null) {
				for (PaymentInstallment installment : installments) {
					String proofPath = installment.getProof();
					if (proofPath != null && !proofPath.isBlank()) {
						try {
							Path filePath = Paths.get("uploads", proofPath);
							Files.deleteIfExists(filePath);
						} catch (IOException e) {
							System.err.println("Failed to delete file: " + proofPath);
						}
					}
				}
			}

			paymentRepository.deleteById(id);
		} else {
			throw new RuntimeException("Payment not found with id: " + id);
		}
	}

	@Override
	public byte[] getFileAsBytes(String filename) throws IOException {
		Path filePath = Paths.get(paymentsUploadPath).resolve(filename).normalize();

		if (!Files.exists(filePath)) {
			throw new IOException("File not found: " + filename);
		}

		return Files.readAllBytes(filePath);
	}

	@Override
	public String getContentType(String filename) {
		String ext = "";
		int dotIndex = filename.lastIndexOf('.');
		if (dotIndex > 0) {
			ext = filename.substring(dotIndex + 1).toLowerCase();
		}
		switch (ext) {
		case "png":
			return "image/png";
		case "jpg":
		case "jpeg":
			return "image/jpeg";
		case "gif":
			return "image/gif";
		default:
			return "application/octet-stream";
		}
	}

	private PaymentResponse createPaymentResponse(Payment savedPayment) {
		PaymentResponse response = new PaymentResponse();
		response.setPaymentId(savedPayment.getPaymentId());
		response.setStudentId(savedPayment.getStudentId());
		response.setStudentName(savedPayment.getStudentName());
		response.setEmail(savedPayment.getEmail());
		response.setMobile(savedPayment.getMobile());
		response.setCourseName(savedPayment.getCourseName());
		response.setCourseFee(savedPayment.getCourseFee());
		response.setTax(savedPayment.getTax());
		response.setDiscount(savedPayment.getDiscount());
		response.setNoOfInstallments(savedPayment.getNumberOfInstallments());
		response.setNoOfDays(savedPayment.getNumberOfDays());
		response.setTotalAmount(savedPayment.getTotalAmount());
		response.setBalancePay(savedPayment.getBalancePay());
		response.setInvoiceNumber(savedPayment.getInvoiceNumber());

		List<PaymentInstallmentResponse> installmentResponses = new ArrayList<>();
		for (PaymentInstallment savedInstallment : savedPayment.getInstallments()) {
			PaymentInstallmentResponse installmentResponse = new PaymentInstallmentResponse();
			installmentResponse.setInstallmentId(savedInstallment.getInstallmentId());
			installmentResponse.setNumberOfInstallments(savedInstallment.getNumberOfInstallments());
			installmentResponse.setPayDate(savedInstallment.getPayDate());
			installmentResponse.setDueDate(savedInstallment.getDueDate());
			installmentResponse.setActualPay(savedInstallment.getActualPay());
			installmentResponse.setReceivedPay(savedInstallment.getReceivedPay());
			installmentResponse.setPaymentMethod(savedInstallment.getPaymentMethod());
			installmentResponse.setProof(savedInstallment.getProof());
			installmentResponse.setReference(savedInstallment.getReference());

			installmentResponses.add(installmentResponse);
		}

		response.setInstallments(installmentResponses);
		return response;
	}

	@Override
	public String generateInvoice(PaymentRequest paymentRequest, Model model) {
		Context context = new Context();
		context.setVariable("studentName", paymentRequest.getStudentName());
		context.setVariable("studentEmail", paymentRequest.getEmail());
		context.setVariable("studentPhone", paymentRequest.getMobile());
		context.setVariable("courseName", paymentRequest.getCourseName());
		context.setVariable("coursePrice", String.format("%.2f", paymentRequest.getCourseFee()));
		context.setVariable("discount", paymentRequest.getDiscount() + ".00");
		context.setVariable("tax", paymentRequest.getTax() + ".00");
		context.setVariable("totalAmount", String.format("%.2f", paymentRequest.getTotalAmount()));

		SimpleDateFormat sdf = new SimpleDateFormat("MMddyyyy");
		String formattedDate = sdf.format(new Date());
		context.setVariable("invoiceNumber", paymentRequest.getInvoiceNumber());

		List<PaymentInstallmentRequest> installments = paymentRequest.getInstallments();

		PaymentInstallmentRequest selectedInstallment = null;

		double receivedPayAmount = 0.0;

		if (installments != null && !installments.isEmpty()) {
			Long selectedId = paymentRequest.getSelectedInstallmentId();
			if (selectedId != null) {
				for (PaymentInstallmentRequest inst : installments) {
					if (selectedId.equals(inst.getInstallmentId())) {
						selectedInstallment = inst;
						break;
					}
				}
			}
			if (selectedInstallment == null) {
				selectedInstallment = installments.get(0);
			}

			LocalDate payDate = selectedInstallment.getPayDate();
			LocalDate dueDate = selectedInstallment.getDueDate();

			DateTimeFormatter formatter = DateTimeFormatter.ofPattern("MM-dd-yyyy");

			String formattedPayDate = payDate.format(formatter);
			String formattedDueDate = dueDate.format(formatter);

			context.setVariable("invoiceDate", formattedPayDate);
			context.setVariable("dueDate", formattedDueDate);
//			context.setVariable("receivedPay", String.format("%.2f", selectedInstallment.getReceivedPay()));
			receivedPayAmount = selectedInstallment.getReceivedPay();

			receivedPayAmount = selectedInstallment.getReceivedPay();
			context.setVariable("receivedPay", String.format("%.2f", receivedPayAmount));

		}

		context.setVariable("amountValue", "$" + String.format("%.2f", paymentRequest.getBalancePay()));

		String status = paymentRequest.getStatus();
		if (receivedPayAmount > 0.0) {
			if (status == null || status.trim().isEmpty()) {
				status = "PARTIALLY PAID";
			}
			context.setVariable("status", status.trim());
		} else {
			context.setVariable("status", null); // hide status if no payment
		}

		String logoImagePath = "/home/ec2-user/uploads/images/HachionLogo.png";
		context.setVariable("logoPath", "file:///" + logoImagePath.replace("\\", "/")); // ensure proper file URL

		String renderedHtml = templateEngine.process("invoice_template", context);

		File directory = new File(invoiceDirectoryPath);
		if (!directory.exists()) {
			directory.mkdirs();
		}

		String safeFileName = paymentRequest.getStudentName().replaceAll("\\s+", "_") + "_"
				+ paymentRequest.getCourseName().replaceAll("\\s+", "_");

		String pdfFilePath = invoiceDirectoryPath + File.separator + safeFileName + ".pdf";

		try (OutputStream os = new FileOutputStream(pdfFilePath)) {
			PdfRendererBuilder builder = new PdfRendererBuilder();
			builder.useFastMode();

			String baseUri = new File("/home/ec2-user/uploads").toURI().toString();
			builder.withHtmlContent(renderedHtml, baseUri);
			builder.toStream(os);
			builder.run();

			emailService.sendInvoiceEmail(paymentRequest.getEmail(), paymentRequest.getStudentName(), pdfFilePath);
		} catch (Exception e) {

		}

		model.addAttribute("studentName", paymentRequest.getStudentName());
		return "invoice_template";
	}

	@Override
	public void sendReminderEmail(PaymentRequest paymentRequest) {
		String to = paymentRequest.getEmail(); // e.g., nagalakshmi.hachion@gmail.com
		String invoiceNumber = paymentRequest.getInvoiceNumber(); // e.g., HACHCYBJBAST02252025-15
		double balancePay = paymentRequest.getBalancePay(); // e.g., 203.75
		double totalAmount = paymentRequest.getTotalAmount();

		String subject = "Reminder from HACH Technologies LLC (" + invoiceNumber + ")";

		String body = "<html><body style='font-family:Arial,sans-serif; color:#000;!important'>"

				+ "<p style='font-size:12px; text-align:center;'>Hello, " + to + "</p>"

				+ "<div style='max-width:600px;margin:0 auto;padding:30px;"
				+ "border-radius:12px;background-color:#f9f9f9;color:#000;font-size:18px;'>"

				+ "<div style='text-align:center; font-size:45px; font-weight:900; line-height:1; letter-spacing:1.5px; margin-bottom:30px;'>"
				+ "Invoice payment<br/>reminder</div>" + "<p style='text-align:center;'>"
				+ "<img src='https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/PayPal.svg/1200px-PayPal.svg.png' "
				+ "alt='PayPal' style='height:40px; width:auto;'/>" + "</p>"

				+ "<p>Reminder: HACH Technologies LLC sent you an invoice.</p>" + "<p><b>Amount due:</b> $"
				+ String.format("%.2f", balancePay) + " USD</p>" + "<p>Due on receipt</p>"

				+ "<div style='background-color:#fff;padding:20px;border-radius:10px;margin:30px 0;color:#000;'>"
				+ "<p style='font-size:20px; font-weight:bold; margin: 0;'>HACH Technologies LLC</p>"
				+ "<p style='margin: 8px 0; font-size:12px;'>"
				+ "<img src='https://cdn-icons-png.flaticon.com/512/561/561127.png' width='16' style='vertical-align:middle;margin-right:6px;'/>"
				+ "<a href='mailto:trainings@hachion.co' style='color:#001f7f;text-decoration:none;font-size:12px;'>trainings@hachion.co</a></p>"
				+ "<p style='margin: 0; font-size:12px;'>You don't have any payments with this seller in the last year.</p>"
				+ "</div>"

				+ "<div style='background-color:#fff;padding:20px;border-radius:10px;margin:30px 0;color:#000;'>"
				+ "<p style='font-size:20px; font-weight:bold; margin-bottom:20px;'>Invoice details</p>"
				+ "<p><b>Amount requested</b><br/><span style='font-weight:bold;'>$"
				+ String.format("%.2f", totalAmount) + " USD</span></p>" + "<p><b>Invoice number</b><br/>"
				+ invoiceNumber + "</p>" + "</div>"

				+ "<div style='text-align:center; margin: 40px 0;'>" + "<a href='https://yourdomain.com/invoice/"
				+ invoiceNumber + "' " + "style='background-color:#000;color:#fff;padding:14px 32px;"
				+ "text-decoration:none;border-radius:50px;font-weight:bold;font-size:18px;display:inline-block;'>"
				+ "View and Pay Invoice</a>" + "</div>"

				+ "<p style='font-size:24px; font-weight:bold; margin-top:40px;'>Don't recognize this invoice?</p>"
				+ "<p style='font-size:12px; font-weight:bold; color:#007bff;'>Report this invoice</p>"

				+ "<p style='font-size:14px;'>Before paying, make sure you recognize this invoice. If you don't, report it. Learn more about common security threats and how to spot them. "
				+ "For example, PayPal would never use an invoice or a money request to ask you for your account credentials.</p><br/>"

				+ "<p style='text-align:center;'>"
				+ "<img src='https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/PayPal.svg/1200px-PayPal.svg.png' "
				+ "alt='PayPal' style='height:40px; width:auto;'/>" + "</p>"
				+ "<hr style='border:0;border-top:1px solid #ccc;margin:20px 0;'/>"

				+ "<p style='font-size:12px; color:#007bff; text-align:center;'>Help & Contact | Security | Apps</p>"
				+ "<p style='text-align:center; margin-top:20px;'>"
				+ "  <a href='https://www.linkedin.com/company/hachion' target='_blank' style='margin:0 8px; display:inline-block;'>"
				+ "    <img src='https://cdn-icons-png.flaticon.com/512/174/174857.png' alt='LinkedIn' style='width:24px; height:24px;'/>"
				+ "  </a>"
				+ "  <a href='https://www.instagram.com/hachion_trainings' target='_blank' style='margin:0 8px; display:inline-block;'>"
				+ "    <img src='https://cdn-icons-png.flaticon.com/512/2111/2111463.png' alt='Instagram' style='width:24px; height:24px;'/>"
				+ "  </a>"
				+ "  <a href='https://www.facebook.com/hachion.co' target='_blank' style='margin:0 8px; display:inline-block;'>"
				+ "    <img src='https://cdn-icons-png.flaticon.com/512/733/733547.png' alt='Facebook' style='width:24px; height:24px;'/>"
				+ "  </a>"
				+ "  <a href='https://www.youtube.com/@hachion' target='_blank' style='margin:0 8px; display:inline-block;'>"
				+ "    <img src='https://cdn-icons-png.flaticon.com/512/1384/1384060.png' alt='YouTube' style='width:24px; height:24px;'/>"
				+ "  </a>"
				+ "  <a href='https://x.com/hachion_co' target='_blank' style='margin:0 8px; display:inline-block;'>"
				+ "    <img src='https://cdn-icons-png.flaticon.com/512/733/733579.png' alt='Twitter' style='width:24px; height:24px;'/>"
				+ "  </a>" + "</p>"

				+ "<p style='font-size:12px;'>PayPal is committed to preventing fraudulent emails. Emails from PayPal will always contain your full name. <span style='color:#007bff;'>Learn to identify phishing.</span></p>"

				+ "<p style='font-size:12px;'>Please don't reply to this email. To get in touch with us, click <span style='color:#007bff;'>Help & Contact</span>.</p>"

				+ "<p style='font-size:12px;'>Not sure why you received this email? <span style='color:#007bff;'>Learn more</span></p>"

				+ "<p style='font-size:12px;'>Copyright © 1999-2025 PayPal, Inc. All rights reserved. "
				+ "PayPal is located at 2211 N. First St., San Jose, CA 95131.</p>"

				+ "<p style='font-size:12px;'>PayPal RT000274:en_US(en-US):1.7.1:f275728125163</p>"

				+ "</div></body></html>";

		emailService.sendEmailForReminder(to, subject, body);
	}
//	@Override
//	public void sendReminderEmail(PaymentRequest paymentRequest) {
//		String to = paymentRequest.getEmail(); // e.g., nagalakshmi.hachion@gmail.com
//		String invoiceNumber = paymentRequest.getInvoiceNumber(); // e.g., HACHCYBJBAST02252025-15
//		double balancePay = paymentRequest.getBalancePay(); // e.g., 203.75
//		double totalAmount = paymentRequest.getTotalAmount();
//
//		String subject = "Reminder from HACH Technologies LLC (" + invoiceNumber + ")";
//
//		// Base64 Encoded Icons
//		String paypalLogo = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAYAAABw4pVUAAAB0ElEQVR4nO3cS07DUBhA0ZxYoAE7QAZ0gA3oAF5AAnSADegAX0AF9ACXK/qc7XbIpgvqSpZ4exfm9nMZMn+PQlEAAAAAAAAAAAAAj3W3KJ8RYD4txBdZxVdYBRPAmzJxUccM7Y9+gH0oAQq2MzOP9X5FXLPUZZz2rK/V1Ksy0d3XwDDf1YvC0m3cbyyfMGXpKq8Gq8YI9FtUKoGq0cVZkzU/BVRiGo2MI0Tq9A1nS4zzGnZdN8jr8MTUqvMwXR7jF6CnL9MZg3m0Gkw+7+EmXR3HZ3l3s+IKyYZ9dxnPau94mN86Z37/wBc7fkpUVs9VwIpr5YurCtwv+Yz7M1PKT7oOj0y/zzOtKy2k+qs4rWcYZ25MZrzHGcmG3B/H2e+kcNYZxlaGv2mtKY8/wAj/n8lF9vUctqxrvMZAAAAAAAAAAAAgP8NVrLeN9UKu3UAAAAASUVORK5CYII=";
//		String mailIcon = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAABDlBMVEUAAABZUl5ZUl5ZUl5ZUl5ZUl5ZUl5ZUl5ZUl5ZUl5ZUl5ZUl5ZUl5ZUl5ZUl5ZUl5ZUl5ZUl5ZUl5ZUl5ZUl5ZUl5ZUl5ZUl5ZUl5ZUl5ZUl5ZUl5ZUl5ZUl5ZUl5ZUl5ZUl5ZUl5ZUl5ZUl5ZUl5ZUl5ZUl5ZUl5ZUl5ZUl5ZUl5ZUl5ZUl5ZUl5ZUl5ZUl5ZUl5ZUl5ZUl5ZUl5ZUl5ZUl5ZUl5ZUl5ZUl5ZUl5ZUl5ZUl7///+HwxtJAAAAKHRSTlMABcNnhvvB+uw7EQmT/Ty/Yl3ck/YzWyMeaK8ChwZtb8Lhg8IF2ZuydaQn4AAADHSURBVBjTVY/ZEoMgDIQb0JWhkFPduPP+XxqUdbuX1Tx4t1IT9QYdE1llDZTltuU/4ic86kq4ybSGFKgLUwDZUGpjKEgjAsEsRxjBxuGU2gwqCKM+GqayheKOxINx2lOV8HdTLnBQjR0tFXK2sfdzk0sqUq7csp3CPxUBDME3swvY0X7T7lHPkCOkEPleBLYnppYAAAAASUVORK5CYII=";
//		String linkedin = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAABk0lEQVRIS+2VvU7DUBCFv1AgCdoAm0AJ0ACdAAfQAQdACXQAXQAXSAX8FMog+jqK6kH6oSzOea58+y2r+vvvIfFeNcEvOAsaOcnMEOwb5ewrckAYZZGbQlSkcAMwAb0BGfhcWJZlxCNOE3cRO95QDSq0ZxdY5Y7nliWShWEcMZ90gksS9ZaDwBk+P4yGIm2gdJ2MRz7MAV1xDLjBh+S++kjYzp4ykp1FkyU2UWNJnZyg05nRFiE9N2cEXsOc77p9gn5E51dPvLzK8Wz3XBxBfrzHwTZcvPykq3f32AhfGhRpa0JD41jxbLuRP+k4oQkS9ihIE45WEJWv1mDc/4Ds+Kgk/Agp3MAAAAASUVORK5CYII=";
//		String instagram = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAABaElEQVRIS+2VsW7CQBBFz5YgASoAEqABKoASqAESqAEKgACqgASqAESoAEKoAxLZC3aWcZtvMvM+3M9klZf89ZVOSmUmOWcBeUlwCKDTQHXgGuwpQQrklGd9yxEc+vwKnO6LQyUAMfOAXMv4eL6/kFWIQjQ1vJ2Aoynct4swqlUrv9gEsFqtrXKW2GeMLhxJ1zvcW5IfRSog+1NOB+FFMLxdgCm1eg4kFJX0C8XKXHeg7F2i6NDoBP89N4qVJUabW+5CyDh6FGLAWDK+d80rhJ7IPG3CHCk2C3ifh8fBR7aL1lY6YRo/h1xT5TLnkL+A1STh3V8BZ51EwG1WI4RcymzZKR9XGy9Od5xchfp9fu4qV5pZWDx81BAAAAAElFTkSuQmCC";
//		String facebook = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAABYUlEQVRIS+2V0U3DMBBFT7kABUgAl6ADlIBbQAmoAboAGqAD1oAR0gGmAEtABlKSTv1tiSPVvu+ey2/M5fs3kKmuoRr7X8iPCkG4GQfAG4Z+9cEwVXw8hwAOP9SmtIfdKzO9J0lVVbdFV0jlix6wMgWWLe0cylZcEWSZo/ijMKUJoaTOWn3HQGzE0MDmbn3AsxXt4K04hyWe7BOrSk1J1AS8dM6NmGp12";
//		String youtube = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAA8klEQVRIS+2U0Q3DIAxFb6kARUAEFQAV0AFdAAWkABXQAakAFVABZ0AF5AApVJoEjKkp1F73vuc85sQBYzsqWyYEL9eyAVFFZRiEqBkTAFzBt/gy1mAtxCl1c9Z4FQNYHvAOvFobTy9sygkoqRySTe5QoLsxrITclXhcqPQGYOmcYDa9Nzk3ehbxBMwW+cvbCimLVNTAj5bpZZNvdqN5XQ0vJjRQOCECmQl0X1AJHvDG7EiqeKJOrPo8Ej5B1v8lxkAAAAASUVORK5CYII=";
//		String twitter = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAAk0lEQVRIS+2UsQ2AIAwDPf//0+2gFrtL40dItVQ4kMwQayAe4oKY7AQa0U2UADznZC7wMSi7WycR7OA0tgDNPzZLtSAGI4PbK43g3qBzCCqH3pYKFxAmQw0OsoQGUzRbT1dyj0cl+UDnvoZzzROnRJ+Icl0QavOytnEKx8oz1npoH/sIl7yJSkYo3MEUAAAAASUVORK5CYII=";
//
//		String body = "<html><body style='font-family:Arial,sans-serif; color:#000;!important'>"
//				+ "<p style='font-size:12px; text-align:center;'>Hello, " + to + "</p>"
//				+ "<div style='max-width:600px;margin:0 auto;padding:30px;"
//				+ "border-radius:12px;background-color:#f9f9f9;color:#000;font-size:18px;'>"
//				+ "<div style='text-align:center; font-size:45px; font-weight:900; line-height:1; letter-spacing:1.5px; margin-bottom:30px;'>"
//				+ "Invoice payment<br/>reminder</div>"
//				+ "<p style='text-align:center;'>"
//				+ "<img src='" + paypalLogo + "' alt='PayPal' style='height:40px; width:auto;'/>"
//				+ "</p>"
//				+ "<p>Reminder: HACH Technologies LLC sent you an invoice.</p>"
//				+ "<p><b>Amount due:</b> $" + String.format("%.2f", balancePay) + " USD</p><p>Due on receipt</p>"
//
//				+ "<div style='background-color:#fff;padding:20px;border-radius:10px;margin:30px 0;color:#000;'>"
//				+ "<p style='font-size:20px; font-weight:bold; margin: 0;'>HACH Technologies LLC</p>"
//				+ "<p style='margin: 8px 0; font-size:12px;'>"
//				+ "<img src='" + mailIcon + "' width='16' style='vertical-align:middle;margin-right:6px;'/>"
//				+ "<a href='mailto:trainings@hachion.co' style='color:#001f7f;text-decoration:none;font-size:12px;'>trainings@hachion.co</a></p>"
//				+ "<p style='margin: 0; font-size:12px;'>You don't have any payments with this seller in the last year.</p>"
//				+ "</div>"
//
//				+ "<div style='background-color:#fff;padding:20px;border-radius:10px;margin:30px 0;color:#000;'>"
//				+ "<p style='font-size:20px; font-weight:bold; margin-bottom:20px;'>Invoice details</p>"
//				+ "<p><b>Amount requested</b><br/><span style='font-weight:bold;'>$" + String.format("%.2f", totalAmount)
//				+ " USD</span></p><p><b>Invoice number</b><br/>" + invoiceNumber + "</p></div>"
//
//				+ "<div style='text-align:center; margin: 40px 0;'>"
//				+ "<a href='https://yourdomain.com/invoice/" + invoiceNumber + "' "
//				+ "style='background-color:#000;color:#fff;padding:14px 32px;"
//				+ "text-decoration:none;border-radius:50px;font-weight:bold;font-size:18px;display:inline-block;'>"
//				+ "View and Pay Invoice</a></div>"
//
//				+ "<p style='font-size:24px; font-weight:bold; margin-top:40px;'>Don't recognize this invoice?</p>"
//				+ "<p style='font-size:12px; font-weight:bold; color:#007bff;'>Report this invoice</p>"
//
//				+ "<p style='font-size:14px;'>Before paying, make sure you recognize this invoice. If you don't, report it. Learn more about common security threats and how to spot them. "
//				+ "For example, PayPal would never use an invoice or a money request to ask you for your account credentials.</p><br/>"
//
//				+ "<p style='text-align:center;'>"
//				+ "<img src='" + paypalLogo + "' alt='PayPal' style='height:40px; width:auto;'/>" + "</p>"
//				+ "<hr style='border:0;border-top:1px solid #ccc;margin:20px 0;'/>"
//				+ "<p style='font-size:12px; color:#007bff; text-align:center;'>Help & Contact | Security | Apps</p>"
//
//				+ "<p style='text-align:center; margin-top:20px;'>"
//				+ "  <a href='https://www.linkedin.com/company/hachion' target='_blank' style='margin:0 8px; display:inline-block;'>"
//				+ "    <img src='" + linkedin + "' alt='LinkedIn' style='width:24px; height:24px;'/>" + "  </a>"
//				+ "  <a href='https://www.instagram.com/hachion_trainings' target='_blank' style='margin:0 8px; display:inline-block;'>"
//				+ "    <img src='" + instagram + "' alt='Instagram' style='width:24px; height:24px;'/>" + "  </a>"
//				+ "  <a href='https://www.facebook.com/hachion.co' target='_blank' style='margin:0 8px; display:inline-block;'>"
//				+ "    <img src='" + facebook + "' alt='Facebook' style='width:24px; height:24px;'/>" + "  </a>"
//				+ "  <a href='https://www.youtube.com/@hachion' target='_blank' style='margin:0 8px; display:inline-block;'>"
//				+ "    <img src='" + youtube + "' alt='YouTube' style='width:24px; height:24px;'/>" + "  </a>"
//				+ "  <a href='https://x.com/hachion_co' target='_blank' style='margin:0 8px; display:inline-block;'>"
//				+ "    <img src='" + twitter + "' alt='Twitter' style='width:24px; height:24px;'/>" + "  </a>" + "</p>"
//
//				+ "<p style='font-size:12px;'>PayPal is committed to preventing fraudulent emails. Emails from PayPal will always contain your full name. <span style='color:#007bff;'>Learn to identify phishing.</span></p>"
//				+ "<p style='font-size:12px;'>Please don't reply to this email. To get in touch with us, click <span style='color:#007bff;'>Help & Contact</span>.</p>"
//				+ "<p style='font-size:12px;'>Not sure why you received this email? <span style='color:#007bff;'>Learn more</span></p>"
//				+ "<p style='font-size:12px;'>Copyright © 1999-2025 PayPal, Inc. All rights reserved. "
//				+ "PayPal is located at 2211 N. First St., San Jose, CA 95131.</p>"
//				+ "<p style='font-size:12px;'>PayPal RT000274:en_US(en-US):1.7.1:f275728125163</p>"
//
//				+ "</div></body></html>";
//
//		emailService.sendEmailForReminder(to, subject, body);
//	}

}
