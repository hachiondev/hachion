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
//					installment.setProof(filePath.toString()); 
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

			if (i < noOfInstallments) {
				currentDueDate = currentDueDate.plusDays(numberOfDays);
				installment.setDueDate(currentDueDate);
			} else {
				installment.setDueDate(null);
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

//	public void deletePaymentById(Long id) {
//		paymentRepository.deleteById(id);
//	}

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

		String status = paymentRequest.getStatus();
		if (status == null || status.trim().isEmpty()) {
			status = "PARTIALLY PAID";
		}
		context.setVariable("status", status.trim());

		SimpleDateFormat sdf = new SimpleDateFormat("MMddyyyy");
		String formattedDate = sdf.format(new Date());
		context.setVariable("invoiceNumber", paymentRequest.getInvoiceNumber());

		List<PaymentInstallmentRequest> installments = paymentRequest.getInstallments();
		PaymentInstallmentRequest selectedInstallment = null;
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
			context.setVariable("receivedPay", String.format("%.2f", selectedInstallment.getReceivedPay()));
		}

		context.setVariable("amountValue", "$" + String.format("%.2f", paymentRequest.getBalancePay()));

		String renderedHtml = templateEngine.process("invoice_template", context);

		File directory = new File(invoiceDirectoryPath);
		System.out.println("Invoice : " + invoiceDirectoryPath);
		System.out.println("directory : " + directory);
		if (!directory.exists()) {
			directory.mkdirs();
		}

		String safeFileName = paymentRequest.getStudentName().replaceAll("\\s+", "_") + "_"
				+ paymentRequest.getCourseName().replaceAll("\\s+", "_") + "_" + formattedDate;
		String pdfFilePath = invoiceDirectoryPath + File.separator + safeFileName + ".pdf";

		try (OutputStream os = new FileOutputStream(pdfFilePath)) {
			PdfRendererBuilder builder = new PdfRendererBuilder();
			builder.useFastMode();
			String baseUri = new File("src/main/resources").toURI().toString();
			builder.withHtmlContent(renderedHtml, baseUri);
			builder.toStream(os);
			builder.run();

			emailService.sendInvoiceEmail(paymentRequest.getEmail(), paymentRequest.getStudentName(), pdfFilePath);
		} catch (Exception e) {

		}

		model.addAttribute("studentName", paymentRequest.getStudentName());
		return "invoice_template";
	}
}
