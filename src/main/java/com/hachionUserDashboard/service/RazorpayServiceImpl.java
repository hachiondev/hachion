package com.hachionUserDashboard.service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.stream.Collectors;

import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.hachionUserDashboard.dto.InstallmentStatusResponse;
import com.hachionUserDashboard.dto.PaymentInstallmentRequest;
import com.hachionUserDashboard.dto.PaymentRequest;
import com.hachionUserDashboard.dto.PaymentTransactionRequest;
import com.hachionUserDashboard.dto.PaymentTransactionResponse;
import com.hachionUserDashboard.dto.PaymentTransactionSummaryResponse;
import com.hachionUserDashboard.entity.OnlinePaymentInstallments;
import com.hachionUserDashboard.entity.PaymentTransaction;
import com.hachionUserDashboard.entity.RegisterStudent;
import com.hachionUserDashboard.repository.CourseRepository;
import com.hachionUserDashboard.repository.PaymentTransactionRepository;
import com.hachionUserDashboard.repository.RegisterStudentRepository;
import com.razorpay.Order;
import com.razorpay.Payment;
import com.razorpay.RazorpayClient;
import com.razorpay.Utils;

import Service.RazorpayServiceInterface;

@Service
public class RazorpayServiceImpl implements RazorpayServiceInterface {

	@Value("${razorpay.key_id}")
	private String keyId;

	@Value("${razorpay.key_secret}")
	private String keySecret;

	private final RazorpayClient razorpayClient;

	@Autowired
	private PaymentTransactionRepository paymentTransactionRepository;

	@Autowired
	private RegisterStudentRepository registerStudentRepository;

	@Autowired
	private CourseRepository courseRepository;

	public RazorpayServiceImpl(@Value("${razorpay.key_id}") String keyId,
			@Value("${razorpay.key_secret}") String keySecret) throws Exception {
		this.razorpayClient = new RazorpayClient(keyId, keySecret);
	}

	@Override
	public String createOrder(Double amount) {
		try {
			JSONObject orderRequest = new JSONObject();
			int amountInPaise = (int) (amount * 100);
			orderRequest.put("amount", amountInPaise);
			orderRequest.put("currency", "INR");
			orderRequest.put("receipt", "txn_" + System.currentTimeMillis());

			Order order = razorpayClient.orders.create(orderRequest);
			return order.toString();
		} catch (Exception e) {
			e.printStackTrace();
			return "Error creating Razorpay order: " + e.getMessage();
		}
	}

	@Override
	public String captureOrder(String paymentId, String orderId, String signature, String studentId, String courseName,
			String batchId) {
		try {

			JSONObject options = new JSONObject();
			options.put("razorpay_payment_id", paymentId);
			options.put("razorpay_order_id", orderId);
			options.put("razorpay_signature", signature);

			boolean isSignatureValid = Utils.verifyPaymentSignature(options, keySecret);
			if (!isSignatureValid) {
				return "Invalid payment signature. Possible tampering.";
			}

			Payment payment = razorpayClient.payments.fetch(paymentId);
			String status = payment.get("status");
			if (!"captured".equals(status)) {
				return "Payment not captured yet. Status: " + status;
			}

			double amount = ((Number) payment.get("amount")).doubleValue() / 100.0;

			String currency = payment.get("currency");
			String payerEmail = payment.get("email");

			Optional<RegisterStudent> student = registerStudentRepository.findByStudentId(studentId);
			String studentEmail = student.map(RegisterStudent::getEmail).orElse(payerEmail);
			String studentName = student.map(RegisterStudent::getUserName).orElse("Student");

			List<Object[]> result = courseRepository.findCourseFeeByCourseName(courseName);

			Double courseFeeFromDb = null;
			Double discountFromDb = null;

			if (!result.isEmpty()) {
				Object[] row = result.get(0);
				courseFeeFromDb = row[0] != null ? ((Number) row[0]).doubleValue() : null;
				discountFromDb = row[1] != null ? ((Number) row[1]).doubleValue() : null;
			}

			double courseFee = courseFeeFromDb != null ? courseFeeFromDb : amount;
			double discount = discountFromDb != null ? discountFromDb : 0.0;

			double discountAmount = (courseFee * discount) / 100;
			double finalPrice = courseFee - discountAmount;

			String method = payment.get("method");
			System.out.println("payment method : " + method);

			String rawJson = payment.toString();

			PaymentTransaction tx = new PaymentTransaction();
			tx.setOrderId(orderId);
			tx.setTransactionId(paymentId);
			tx.setStatus(status);
			tx.setAmount(amount);
			tx.setCurrency(currency);
			tx.setPayerEmail(studentEmail);
			tx.setStudentId(studentId);
			tx.setCourseName(courseName);
			tx.setBatchId(batchId);
			tx.setPaymentDate(LocalDateTime.now());
			tx.setCourseFee(courseFeeFromDb);
			tx.setRawResponseJson(rawJson);
			tx.setDiscount(discount);
			tx.setCourseFee(finalPrice);
			tx.setPaymentMethod(method);

			PaymentRequest paymentRequest = convertTransactionToPaymentRequest(tx, studentName, studentEmail);

			paymentTransactionRepository.save(tx);
			return "✅ Razorpay transaction successful: " + paymentId + " (Status: " + status + ")";
		} catch (Exception e) {
			return "❌ Error capturing Razorpay order: " + e.getMessage();
		}
	}

	@Override
	public String captureInstllmentOrder(String paymentId, String orderId, String signature, String studentId,
			String courseName, String batchId, Integer numSelectedInstallments, Integer checkboxClicked,
			String couponCode) {
		try {

			JSONObject options = new JSONObject();
			options.put("razorpay_payment_id", paymentId);
			options.put("razorpay_order_id", orderId);
			options.put("razorpay_signature", signature);

			boolean isSignatureValid = Utils.verifyPaymentSignature(options, keySecret);
			if (!isSignatureValid) {
				return "Invalid payment signature. Possible tampering.";
			}

			Payment payment = razorpayClient.payments.fetch(paymentId);
			String status = payment.get("status");
			if (!"captured".equals(status)) {
				return "Payment not captured yet. Status: " + status;
			}

			double amount = ((Number) payment.get("amount")).doubleValue() / 100.0;
			String currency = payment.get("currency");
			String payerEmail = payment.get("email");

			String method = payment.get("method");
			System.out.println("payment method : " + method);

			Optional<RegisterStudent> student = registerStudentRepository.findByStudentId(studentId);
			String studentEmail = student.map(RegisterStudent::getEmail).orElse(payerEmail);
			String studentName = student.map(RegisterStudent::getUserName).orElse("Student");

			List<Object[]> result = courseRepository.findCourseFeeByCourseName(courseName);
			Double courseFeeFromDb = null;
			Double discountFromDb = null;

			if (!result.isEmpty()) {
				Object[] row = result.get(0);
				courseFeeFromDb = row[0] != null ? ((Number) row[0]).doubleValue() : null;
				discountFromDb = row[1] != null ? ((Number) row[1]).doubleValue() : null;
			}

			double courseFee = courseFeeFromDb != null ? courseFeeFromDb : amount;
			double discount = discountFromDb != null ? discountFromDb : 0.0;
			double discountAmount = (courseFee * discount) / 100;
			double finalPrice = courseFee - discountAmount;

			Optional<PaymentTransaction> existingTxOpt = paymentTransactionRepository
					.findByStudentIdAndCourseName(studentId, courseName);

			PaymentTransaction tx;
			if (existingTxOpt.isPresent()) {

				tx = existingTxOpt.get();
				tx.setPayerEmail(studentEmail);
				tx.setCurrency(currency);
				tx.setDiscount(discount);
				tx.setPaymentDate(LocalDateTime.now());
				tx.setIsInstallment(true);
				tx.setOrderId(orderId);
				tx.setTransactionId(paymentId);
				tx.setCheckboxClicked(
						(tx.getCheckboxClicked() != null ? tx.getCheckboxClicked() : 0) + checkboxClicked);
				tx.setCouponCode(couponCode);
				tx.setPaymentMethod(method);
			} else {

				tx = new PaymentTransaction();
				tx.setStudentId(studentId);
				tx.setCourseName(courseName);
				tx.setBatchId(batchId);
				tx.setPayerEmail(studentEmail);
				tx.setCurrency(currency);
				tx.setDiscount(discount);
				tx.setPaymentDate(LocalDateTime.now());
				tx.setIsInstallment(true);
				tx.setOrderId(orderId);
				tx.setTransactionId(paymentId);
				tx.setStatus(status);
				tx.setAmount(0.0);
				tx.setCourseFee(finalPrice);
				tx.setInstallmentCount(0);
				tx.setNumSelectedInstallments(numSelectedInstallments);
				tx.setCheckboxClicked(checkboxClicked);
				tx.setCouponCode(couponCode);
				tx.setPaymentMethod(method);
			}

			double totalPaid = amount;
			int installmentsToCreate = (checkboxClicked != null && checkboxClicked > 0) ? checkboxClicked : 1;
			double eachInstallmentAmount = totalPaid / installmentsToCreate;

			int startingInstallmentNumber = tx.getInstallmentCount() + 1;

			for (int i = 0; i < installmentsToCreate; i++) {
				OnlinePaymentInstallments child = new OnlinePaymentInstallments();
				child.setPaymentTransaction(tx);

				int newInstallmentNumber = startingInstallmentNumber + i;
				child.setInstallmentNumber(newInstallmentNumber);
				child.setInstallmentAmount(eachInstallmentAmount);
				child.setPaidAmount(eachInstallmentAmount);
				child.setPaymentDate(LocalDate.now());
				child.setStatus("PAID");
				child.setOrderId(orderId);
				child.setTransactionId(paymentId);
				child.setPaymentMethod(method);
				tx.getOnlinePaymentInstallments().add(child);
				tx.setInstallmentCount(tx.getInstallmentCount() + 1);
			}

			tx.setAmount(tx.getAmount() + totalPaid);
			double balance = finalPrice - tx.getAmount();
			tx.setBalance(balance);

			tx.setStatus(balance <= 0 ? "PAID" : "PARTIALLY_PAID");
			tx.setNumSelectedInstallments(numSelectedInstallments);
			tx.setCourseFee(finalPrice);

			paymentTransactionRepository.save(tx);

			PaymentRequest paymentRequest = convertTransactionToPaymentRequest(tx, studentName, studentEmail);

			return "✅ Razorpay transaction successful: " + paymentId + " (Status: " + tx.getStatus() + ")";

		} catch (Exception e) {
			return "❌ Error capturing Razorpay order: " + e.getMessage();
		}
	}

	public Integer getCheckboxClicked(String studentId, String courseName, String batchId) {
		return paymentTransactionRepository.findCheckboxClicked(studentId, courseName, batchId);
	}

	private PaymentRequest convertTransactionToPaymentRequest(PaymentTransaction tx, String studentName,
			String studentEmail) {
		PaymentRequest pr = new PaymentRequest();
		pr.setStudentName(studentName);
		pr.setEmail(studentEmail);
		pr.setCourseName(tx.getCourseName());
		pr.setCourseFee(tx.getAmount());
		pr.setDiscount(0);
		pr.setTax(0);
		pr.setTotalAmount(tx.getAmount());
		pr.setBalancePay(tx.getAmount());
		pr.setInvoiceNumber("INV-" + tx.getTransactionId().substring(0, 8));
		pr.setStatus("PAID");
		pr.setDiscount(tx.getDiscount() != null ? tx.getDiscount().intValue() : 0);

		PaymentInstallmentRequest installment = new PaymentInstallmentRequest();
		installment.setPayDate(tx.getPaymentDate().toLocalDate());
		installment.setDueDate(tx.getPaymentDate().toLocalDate());
		installment.setReceivedPay(tx.getAmount());

		pr.setInstallments(List.of(installment));
		pr.setSelectedInstallmentId(1L);

		return pr;

	}

	public List<PaymentTransaction> getTransactionsByEmailAndCourse(String payerEmail, String courseName) {
		return paymentTransactionRepository.findByPayerEmailAndCourseName(payerEmail, courseName);
	}

	@Override
	public PaymentTransactionResponse createRequestInstallment(PaymentTransactionRequest paymentTransactionRequest) {
		PaymentTransaction paymentTransaction = new PaymentTransaction();

		paymentTransaction.setStudentId(paymentTransactionRequest.getStudentId());
		paymentTransaction.setStudentName(paymentTransactionRequest.getStudentName());
		paymentTransaction.setPayerEmail(paymentTransactionRequest.getPayerEmail());
		paymentTransaction.setMobile(paymentTransactionRequest.getMobile());
		paymentTransaction.setCourseName(paymentTransactionRequest.getCourseName());
		paymentTransaction.setBatchId(paymentTransactionRequest.getBatchId());
		paymentTransaction.setCourseFee(paymentTransactionRequest.getCourseFee());
		paymentTransaction.setNumSelectedInstallments(paymentTransactionRequest.getNumSelectedInstallments());
		paymentTransaction.setRequestDate(LocalDate.now());

		PaymentTransaction savedTransaction = paymentTransactionRepository.save(paymentTransaction);

		PaymentTransactionResponse response = createResponseForPaymentRequest(savedTransaction);
		return response;
	}

	private PaymentTransactionResponse createResponseForPaymentRequest(PaymentTransaction savedTransaction) {
		PaymentTransactionResponse response = new PaymentTransactionResponse();
		response.setId(savedTransaction.getId());
		response.setStudentId(savedTransaction.getStudentId());
		response.setStudentName(savedTransaction.getStudentName());
		response.setPayerEmail(savedTransaction.getPayerEmail());
		response.setMobile(savedTransaction.getMobile());
		response.setCourseName(savedTransaction.getCourseName());
		response.setBatchId(savedTransaction.getBatchId());
		response.setCourseFee(savedTransaction.getCourseFee());
		response.setNumSelectedInstallments(savedTransaction.getNumSelectedInstallments());
		response.setRequestDate(savedTransaction.getRequestDate());
		response.setRequestStatus(savedTransaction.getRequestStatus());
		response.setPaymentMethod(savedTransaction.getPaymentMethod());
		return response;
	}

	@Override
	public List<PaymentTransactionResponse> getAllRequestInstallmetns() {

		List<PaymentTransaction> transactions = paymentTransactionRepository.findAll();

		return transactions.stream().map(tx -> {
			PaymentTransactionResponse response = new PaymentTransactionResponse();
			response.setId(tx.getId());
			response.setStudentId(tx.getStudentId());
			response.setStudentName(tx.getStudentName());
			response.setPayerEmail(tx.getPayerEmail());
			response.setMobile(tx.getMobile());
			response.setCourseName(tx.getCourseName());
			response.setBatchId(tx.getBatchId());
			response.setNumSelectedInstallments(tx.getNumSelectedInstallments());
			response.setCourseFee(tx.getCourseFee());
			response.setRequestDate(tx.getRequestDate());
			response.setRequestStatus(tx.getRequestStatus());
			return response;
		}).collect(Collectors.toList());
	}

	@Override
	public void updateInstallmentRequestStatus(Long transactionId, String requestStatus) {
		paymentTransactionRepository.updateRequestStatus(transactionId, requestStatus);
	}

	public InstallmentStatusResponse getLatestStatus(String studentId, String courseName) {
		List<Object[]> results = paymentTransactionRepository
				.findLatestStatusAndInstallmentsByStudentIdAndCourseName(studentId, courseName);

		if (!results.isEmpty()) {
			Object[] row = results.get(0);
			String status = (String) row[0];
			Integer installments = row[1] != null ? ((Number) row[1]).intValue() : 0;

			return new InstallmentStatusResponse(status, installments);
		}

		return new InstallmentStatusResponse("not_found", 0);
	}

	public List<PaymentTransactionSummaryResponse> getAllPaymentTransactions() {
		List<PaymentTransaction> transactions = paymentTransactionRepository.findAll();

		AtomicInteger counter = new AtomicInteger(1);

		return transactions.stream().map(tx -> {
			PaymentTransactionSummaryResponse res = new PaymentTransactionSummaryResponse();
			res.setSerialNo(counter.getAndIncrement());
			res.setStudentId(tx.getStudentId());
			res.setStudentName(tx.getStudentName());
			res.setEmail(tx.getPayerEmail());
			res.setMobile(tx.getMobile());
			res.setCourseName(tx.getCourseName());
			res.setCourseFee(tx.getCourseFee());
			res.setCoupon(tx.getCouponCode());
			res.setNumOfInstallments(tx.getNumSelectedInstallments());
			res.setPaidInstallments(tx.getInstallmentCount());
			res.setBalanceFee(tx.getBalance());
			res.setStatus(tx.getStatus());
			res.setPaymentMethod(tx.getPaymentMethod());
			res.setCreatedDate(tx.getRequestDate());
			return res;
		}).collect(Collectors.toList());
	}

}