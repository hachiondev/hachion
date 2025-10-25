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
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.Date;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
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
import com.hachionUserDashboard.repository.PaymentInstallmentRepository;
import com.hachionUserDashboard.repository.PaymentRepository;
import com.openhtmltopdf.pdfboxout.PdfRendererBuilder;

import Service.PaymentService;
import com.hachionUserDashboard.service.WhatsAppService;

@Service
public class PaymentServiceImpl implements PaymentService {

	@Autowired
	private PaymentRepository paymentRepository;

	@Autowired
	private EnrollRepository enrollRepository;

	@Autowired
	private PaymentInstallmentRepository paymentInstallmentRepository;

	@Autowired
	private CourseRepository courseRepository;

	@Autowired
	private EmailService emailService;

	@Autowired
	private SpringTemplateEngine templateEngine;

	@Autowired
	private WhatsAppService whatsAppService;

	@Autowired
	private WebhookSenderService webhookSenderService;


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
		if (Double.compare(paymentRequest.getTotalAmount(), paymentRequest.getBalancePay()) == 0) {
			payment.setStatus("Not Paid");
		} else if (Double.compare(paymentRequest.getBalancePay(), 0.0) == 0) {
			payment.setStatus("Paid");
		} else {
			payment.setStatus("Partially Paid");
		}

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

					Files.createDirectories(dirPath);

					Path filePath = dirPath.resolve(file.getOriginalFilename());

					Files.write(filePath, file.getBytes());

					installment.setProof(file.getOriginalFilename());

				} catch (IOException e) {

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

		savedPayment.setInvoiceNumber(invoiceNumber);
		paymentRepository.save(savedPayment);

		PaymentInstallment lastPaid = savedPayment.getInstallments().stream()
				.filter(pi -> pi.getReceivedPay() != null && pi.getReceivedPay() > 0 && pi.getPayDate() != null)
				.max(Comparator.comparing(PaymentInstallment::getPayDate)).orElse(null);

		Double receivedPayment = (lastPaid != null) ? lastPaid.getReceivedPay() : null;

		PaymentInstallment nextDue = savedPayment.getInstallments().stream().filter(pi -> pi.getDueDate() != null)
				.filter(pi -> {
					double actual = pi.getActualPay() == null ? 0.0 : pi.getActualPay();
					double received = pi.getReceivedPay() == null ? 0.0 : pi.getReceivedPay();
					return received < actual;
				}).sorted(Comparator.comparing(PaymentInstallment::getDueDate)).findFirst().orElse(null);

		Double nextPayment = null;
		LocalDate nextPaymentDate = null;
		if (nextDue != null) {
			double actual = nextDue.getActualPay() == null ? 0.0 : nextDue.getActualPay();
			double received = nextDue.getReceivedPay() == null ? 0.0 : nextDue.getReceivedPay();
			double remaining = Math.max(0.0, actual - received);
			nextPayment = remaining > 0.0 ? remaining : null;
			nextPaymentDate = nextDue.getDueDate();
		}

		String trainers = "N/A";
		String batchId = "N/A";
		String batchTiming = "N/A";
		String trainingCoordinator = "N/A";

		webhookSenderService.sendPaymentReceivedOffline(savedPayment.getStudentId(), savedPayment.getStudentName(),
				savedPayment.getEmail(), savedPayment.getMobile(), savedPayment.getCourseName(),
				savedPayment.getInvoiceNumber(), savedPayment.getTotalAmount(), receivedPayment, nextPayment,
				nextPaymentDate, trainers, batchId, batchTiming, trainingCoordinator);

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

		if (Double.compare(paymentRequest.getTotalAmount(), paymentRequest.getBalancePay()) == 0) {
			payment.setStatus("Not Paid");
		} else if (Double.compare(paymentRequest.getBalancePay(), 0.0) == 0) {
			payment.setStatus("Paid");
		} else {
			payment.setStatus("Partially Paid");
		}

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
		response.setStatus(savedPayment.getStatus());

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
			context.setVariable("invoiceDate", payDate.format(formatter));
			context.setVariable("dueDate", dueDate.format(formatter));

			receivedPayAmount = selectedInstallment.getReceivedPay();
			context.setVariable("receivedPay", String.format("%.2f", receivedPayAmount));
		}

		context.setVariable("amountValue", "$" + String.format("%.2f", paymentRequest.getBalancePay()));

		String status = paymentRequest.getStatus();
		String emailStatus = status;

		if (receivedPayAmount > 0.0) {
			if (status == null || status.trim().isEmpty()) {
				status = "PARTIALLY PAID";
			}

			context.setVariable("status", status.trim());

			emailStatus = status.trim();
		} else {

			context.setVariable("status", null);

			emailStatus = "NOT PAID";
		}

		String logoImagePath = "/home/ec2-user/uploads/images/HachionLogo.png";
		context.setVariable("logoPath", "file:///" + logoImagePath.replace("\\", "/"));

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
		} catch (Exception e) {
			e.printStackTrace();
		}

		File pdfFile = new File(pdfFilePath);

		if (pdfFile.exists()) {
			try {
				if ("PARTIALLY PAID".equalsIgnoreCase(emailStatus)) {
					double amountPaid = paymentRequest.getTotalAmount() - paymentRequest.getBalancePay();

					emailService.sendInvoiceEmailForParitialPaid(paymentRequest.getEmail(),
							paymentRequest.getStudentName(), paymentRequest.getCourseName(), amountPaid, pdfFilePath);

				} else if ("PAID".equalsIgnoreCase(emailStatus)) {
					emailService.sendInvoiceEmailForPaid(paymentRequest.getEmail(), paymentRequest.getStudentName(),
							paymentRequest.getCourseName(), paymentRequest.getTotalAmount(), pdfFilePath);

				} else if ("NOT PAID".equalsIgnoreCase(emailStatus)) {
					emailService.sendInvoiceEmail(paymentRequest.getEmail(), paymentRequest.getStudentName(),
							paymentRequest.getCourseName(), paymentRequest.getBalancePay(), pdfFilePath);

				} else {

				}
			} catch (Exception e) {
				e.printStackTrace();
			}
		} else {

		}

		model.addAttribute("studentName", paymentRequest.getStudentName());
		return "invoice_template";
	}

	@Override
	public void sendReminderEmail(PaymentRequest paymentRequest) {
		String to = paymentRequest.getEmail();
		String invoiceNumber = paymentRequest.getInvoiceNumber();
		double balancePay = paymentRequest.getBalancePay();
		double totalAmount = paymentRequest.getTotalAmount();

		String subject = "Reminder from HACHION (" + invoiceNumber + ")";

		String body = "<html><body style='font-family:Arial,sans-serif; color:#000;!important'>"

				+ "<p style='font-size:12px; text-align:center;'>Hello, " + to + "</p>"

				+ "<div style='max-width:600px;margin:0 auto;padding:30px;"
				+ "border-radius:12px;background-color:#f9f9f9;color:#000;font-size:18px;'>"

				+ "<div style='text-align:center; font-size:45px; font-weight:900; line-height:1; letter-spacing:1.5px; margin-bottom:30px;'>"
				+ "Invoice payment<br/>reminder</div>" + "<p style='text-align:center;'>"
				+ "<img src='https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/PayPal.svg/1200px-PayPal.svg.png' "
				+ "alt='PayPal' style='height:40px; width:auto;'/>" + "</p>"

				+ "<p>Reminder: HACHION sent you an invoice.</p>" + "<p><b>Amount due:</b> $"
				+ String.format("%.2f", balancePay) + " USD</p>" + "<p>Due Date: Immediate</p>"

				+ "<div style='background-color:#fff;padding:20px;border-radius:10px;margin:30px 0;color:#000;'>"
				+ "<p style='font-size:20px; font-weight:bold; margin: 0;'>HACHION</p>"
				+ "<p style='margin: 8px 0; font-size:12px;'>"
				+ "<img src='https://cdn-icons-png.flaticon.com/512/561/561127.png' width='16' style='vertical-align:middle;margin-right:6px;'/>"
				+ "<a href='mailto:trainings@hachion.co' style='color:#001f7f;text-decoration:none;font-size:12px;'>trainings@hachion.co</a></p>"
				+ "<p style='margin: 0; font-size:12px;'>You don't have any payments with this seller in the last year.</p>"
				+ "</div>"

				+ "<div style='background-color:#fff;padding:20px;border-radius:10px;margin:30px 0;color:#000;'>"
				+ "<p style='font-size:20px; font-weight:bold; margin-bottom:20px;'>Invoice details</p>"
				+ "<p><b>Amount requested</b><br/><span style='font-weight:bold;'>$" + String.format("%.2f", balancePay)
				+ " USD</span></p>" + "<p><b>Invoice number</b><br/>" + invoiceNumber + "</p>" + "</div>"

				+ "<div style='text-align:center; margin: 40px 0;'>"
				+ "<div style='background-color:#000; color:#fff; padding:14px 32px; "
				+ "border-radius:12px; display:inline-block; font-size:18px; font-weight:bold;'>"
				+ "View and Pay Invoice" + "</div>" + "</div>"

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

//		emailService.sendEmailForReminder(to, subject, body);
		emailService.sendEmailForReminder(paymentRequest);

	}

	@Override
	public String generateInvoiceForPaypal(PaymentRequest paymentRequest, Model model) {
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

		}

		context.setVariable("amountValue", "$" + String.format("%.2f", paymentRequest.getTotalAmount()));
		context.setVariable("receivedPay", String.format("%.2f", paymentRequest.getTotalAmount()));

		String status = paymentRequest.getStatus();
		if (receivedPayAmount > 0.0) {
			if (status == null || status.trim().isEmpty()) {
				status = "PARTIALLY PAID";
			}
			context.setVariable("status", status.trim());
		} else {
			context.setVariable("status", null);
		}

		String logoImagePath = "/home/ec2-user/uploads/images/HachionLogo.png";
		context.setVariable("logoPath", "file:///" + logoImagePath.replace("\\", "/")); // ensure proper file URL

		String renderedHtml = templateEngine.process("invoice_template_paypal", context);

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

		} catch (Exception e) {

		}

		model.addAttribute("studentName", paymentRequest.getStudentName());
		return "invoice_template";
	}


	@Override
	@Transactional
	public void sendAutoRemindersForTomorrowDue() {
		ZoneId IST = ZoneId.of("Asia/Kolkata");
		LocalDate today = LocalDate.now(IST);
		LocalDate headsUpDate = today.plusDays(2);

		List<PaymentInstallment> dueInTwoDays = paymentInstallmentRepository.findUnpaidDueOn(headsUpDate);

		List<PaymentInstallment> overdueAndToday = paymentInstallmentRepository.findUnpaidDueOnOrBefore(today);

		java.util.LinkedHashSet<PaymentInstallment> targetSet = new java.util.LinkedHashSet<>();
		targetSet.addAll(dueInTwoDays);
		targetSet.addAll(overdueAndToday);
		List<PaymentInstallment> allTargets = new java.util.ArrayList<>(targetSet);

		List<PaymentInstallment> sendToday = new java.util.ArrayList<>();

		for (PaymentInstallment pi : allTargets) {
			LocalDate due = pi.getDueDate();
			if (due == null) {

				continue;
			}

			if (!isReminderEnabledParent(pi)) {
				continue;
			}
			if (pi.getLastReminderOn() != null && pi.getLastReminderOn().isEqual(today)) {
				continue;
			}
			if (due.isEqual(headsUpDate)) {
				sendToday.add(pi);
			} else if (due.isEqual(today)) {
				sendToday.add(pi);
			} else if (due.isBefore(today)) {
				if (shouldSendByCadence(pi, today)) {

					sendToday.add(pi);
				} else {

				}
			}
		}

		Map<Long, Payment> uniquePayments = new java.util.LinkedHashMap<>();
		for (PaymentInstallment pi : sendToday) {
			Payment p = pi.getPayment();
			if (p != null)
				uniquePayments.putIfAbsent(p.getPaymentId(), p);
		}
		for (Payment p : uniquePayments.values()) {
			PaymentRequest req = new PaymentRequest();
			req.setEmail(p.getEmail());
			req.setInvoiceNumber(p.getInvoiceNumber());
			req.setBalancePay(p.getBalancePay() == null ? 0.0 : p.getBalancePay());
			req.setTotalAmount(p.getTotalAmount() == null ? 0.0 : p.getTotalAmount());
			req.setStudentName(p.getStudentName());
			req.setCourseName(p.getCourseName());

			try {
				LocalDate dueDate = null;

				for (PaymentInstallment pi : sendToday) {
					if (pi.getPayment() != null && pi.getPayment().getPaymentId().equals(p.getPaymentId())) {
						dueDate = pi.getDueDate();
						break;
					}
				}

				if (dueDate != null) {
					if (dueDate.isEqual(headsUpDate)) {

						emailService.sendEmailForTwoDaysDue(req, dueDate);

					} else if (dueDate.isEqual(today)) {

						emailService.sendEmailForReminder(req);

					} else if (dueDate.isBefore(today)) {
						long daysOverdue = java.time.temporal.ChronoUnit.DAYS.between(dueDate, today);

						if (daysOverdue >= 7) {

							emailService.sendEmailForSevenDaysOverdue(req, dueDate);
						} else {

							emailService.sendEmailForOverdue(req, dueDate);
						}
					}
				}

			} catch (Exception ignore) {
			}

		}


		for (PaymentInstallment duePi : sendToday) {
			Payment p = duePi.getPayment();

			var prevPaidOpt = paymentInstallmentRepository.findLastPaidBefore(p.getPaymentId(), duePi.getDueDate());
			LocalDate lastPayDate = prevPaidOpt.map(PaymentInstallment::getPayDate).orElse(null);
			Double lastReceived = prevPaidOpt.map(PaymentInstallment::getReceivedPay).orElse(null);

			try {
				
				webhookSenderService.sendPaymentReminder(p.getStudentId(), p.getStudentName(), p.getEmail(),
						p.getMobile(), p.getCourseName(), p.getInvoiceNumber(),
						(p.getBalancePay() == null ? 0.0 : p.getBalancePay()),
						(p.getTotalAmount() == null ? 0.0 : p.getTotalAmount()), duePi.getDueDate(), lastReceived,
						lastPayDate);

			

				LocalDate dueDate = duePi.getDueDate();
				if (dueDate != null && dueDate.isEqual(headsUpDate)) {

					
					double amountDue = (p.getBalancePay() == null ? 0.0 : p.getBalancePay());

					whatsAppService.sendTwoDayHeadsUpReminder(p.getMobile(), p.getStudentName(), amountDue, 
							p.getCourseName(), dueDate);
				}


				if (dueDate != null && dueDate.isEqual(today)) {
					
					double amountDue = (p.getBalancePay() == null ? 0.0 : p.getBalancePay());

					whatsAppService.sendPaymentDueTodayReminder(p.getMobile(), p.getStudentName(), amountDue,
							p.getCourseName(), dueDate);
				}

				if (dueDate != null && dueDate.isBefore(today)) {
					long daysOverdue = java.time.temporal.ChronoUnit.DAYS.between(dueDate, today);
					if (daysOverdue == 2) { 
						double amountDue = (p.getBalancePay() == null ? 0.0 : p.getBalancePay());

						
						whatsAppService.sendPaymentOverdue2DaysReminder(p.getMobile(), p.getStudentName(), amountDue,
								p.getCourseName(), dueDate);
					}
				}

				if (dueDate != null && dueDate.isBefore(today)) {
					long daysOverdue = java.time.temporal.ChronoUnit.DAYS.between(dueDate, today);

					
					if (daysOverdue == 7) {
						double amountDue = (p.getBalancePay() == null ? 0.0 : p.getBalancePay());
						whatsAppService.sendPaymentOverdue7DaysReminder(p.getMobile(), p.getStudentName(), amountDue,
								p.getCourseName(), dueDate);
					}
				}

				
				duePi.setLastReminderOn(today);
				Integer c = (duePi.getReminderCount() == null ? 0 : duePi.getReminderCount());
				duePi.setReminderCount(c + 1);
				paymentInstallmentRepository.save(duePi);

			} catch (Exception ignore) {
			}
		}

	}

	private boolean isReminderEnabledParent(PaymentInstallment pi) {
		try {
			Payment p = pi.getPayment();
			if (p == null)
				return true;
			String v = p.getStopReminder();
			if (v == null || v.isBlank())
				return true;
			return "start".equalsIgnoreCase(v.trim());
		} catch (Exception e) {
			return true;
		}
	}

	private boolean shouldSendByCadence(PaymentInstallment pi, LocalDate today) {
		LocalDate due = pi.getDueDate();
		if (due == null)
			return false;

		long daysOverdue = java.time.temporal.ChronoUnit.DAYS.between(due, today);
		if (daysOverdue < 0)
			return false;

		LocalDate last = pi.getLastReminderOn();
		if (last != null && last.isEqual(today))
			return false;

		if (daysOverdue <= 6) {
			return (daysOverdue % 2 == 0);
		}

		return ((daysOverdue - 7) % 7 == 0);
	}

}
