package com.hachionUserDashboard.service;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

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

import Service.PaymentService;

@Service
public class PaymentServiceImpl implements PaymentService {

	@Autowired
	private PaymentRepository paymentRepository;

	@Autowired
	private EnrollRepository enrollRepository;

	@Autowired
	private CourseRepository courseRepository;

	private static final String UPLOAD_DIR = "uploads/images/";

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
					String uploadDir = "uploads/images/";
					String originalFilename = file.getOriginalFilename();
					Path path = Paths.get(uploadDir + originalFilename);
					Files.createDirectories(path.getParent());
					Files.write(path, file.getBytes());
					installment.setProof("images/" + originalFilename);
				} catch (IOException e) {
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
							String uploadDir = "uploads/images/";
							String originalFilename = file.getOriginalFilename();
							Path path = Paths.get(uploadDir + originalFilename);
							Files.createDirectories(path.getParent());
							Files.write(path, file.getBytes());
							installment.setProof("images/" + originalFilename);
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

	public void deletePaymentById(Long id) {
		paymentRepository.deleteById(id);
	}

	@Override
	public byte[] getFileAsBytes(String filename) throws IOException {
		Path filePath = Paths.get(UPLOAD_DIR).resolve(filename).normalize();

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
}
