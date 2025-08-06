package com.hachionUserDashboard.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.hachionUserDashboard.dto.PaymentInstallmentRequest;
import com.hachionUserDashboard.dto.PaymentRequest;
import com.hachionUserDashboard.entity.PaymentTransaction;
import com.hachionUserDashboard.entity.RegisterStudent;
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
			String batchId, Double discount) {
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

			String rawJson = payment.toString();

			PaymentTransaction tx = new PaymentTransaction();
			tx.setOrderId(orderId);
			tx.setTransactionId(paymentId);
			tx.setStatus(status);
			tx.setAmount(amount);
			tx.setDiscount(discount);
			tx.setCurrency(currency);
			tx.setPayerEmail(studentEmail);
			tx.setStudentId(studentId);
			tx.setCourseName(courseName);
			tx.setBatchId(batchId);
			tx.setPaymentDate(LocalDateTime.now());
			tx.setRawResponseJson(rawJson);

			PaymentRequest paymentRequest = convertTransactionToPaymentRequest(tx, studentName, studentEmail);

			// 4. Generate invoice and send
//	        try {
//	            paymentService.generateInvoiceForPaypal(paymentRequest, new ExtendedModelMap());
//	        } catch (Exception ex) {
//	            System.err.println("⚠️ Razorpay invoice email failed: " + ex.getMessage());
//	        }

			paymentTransactionRepository.save(tx);
			return "✅ Razorpay transaction successful: " + paymentId + " (Status: " + status + ")";
		} catch (Exception e) {
			return "❌ Error capturing Razorpay order: " + e.getMessage();
		}
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
}
