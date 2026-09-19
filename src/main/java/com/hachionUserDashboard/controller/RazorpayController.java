package com.hachionUserDashboard.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.hachionUserDashboard.dto.InstallmentStatusResponse;
import com.hachionUserDashboard.dto.PaymentRequest;
import com.hachionUserDashboard.dto.PaymentTransactionRequest;
import com.hachionUserDashboard.dto.PaymentTransactionResponse;
import com.hachionUserDashboard.dto.PaymentTransactionSummaryResponse;
import com.hachionUserDashboard.entity.PaymentTransaction;
import com.hachionUserDashboard.service.EmailService;

import Service.RazorpayServiceInterface;
import jakarta.mail.MessagingException;

@RestController
@RequestMapping("/razorpay")
public class RazorpayController {

	@Autowired
	private RazorpayServiceInterface razorpayService;

	@Autowired
	private EmailService emailService;

//	@PostMapping("/create-razorpay-order")
//	public String createOrder(@RequestParam Double amount) {
//		return razorpayService.createOrder(amount);
//	}

	@PostMapping("/create-razorpay-order")
	public String createOrder(@RequestParam Double amount, @RequestParam String studentId,
			@RequestParam String courseName, @RequestParam String batchId) {
		return razorpayService.createOrder(amount, studentId, courseName, batchId);
	}

	@PostMapping("/capture-razorpay")
	public String capturePayment(@RequestParam String paymentId, @RequestParam String orderId,
			@RequestParam String signature, @RequestParam String studentId, @RequestParam String courseName,
			@RequestParam String batchId, @RequestParam(value = "couponCode", required = false) String couponCode) {
		return razorpayService.captureOrder(paymentId, orderId, signature, studentId, courseName, batchId, couponCode);
	}

	@PostMapping("/capture-razorpay-installments")
	public String capturePaymentInstallments(@RequestParam String paymentId, @RequestParam String orderId,
			@RequestParam String signature, @RequestParam String studentId, @RequestParam String courseName,
			@RequestParam String batchId,
			@RequestParam(required = false, defaultValue = "0") Integer numSelectedInstallments,
			Integer checkboxClicked, @RequestParam(value = "couponCode", required = false) String couponCode) {
		return razorpayService.captureInstllmentOrder(paymentId, orderId, signature, studentId, courseName, batchId,
				numSelectedInstallments, checkboxClicked, couponCode);
	}

	@GetMapping("/checkbox-status")
	public ResponseEntity<Integer> getCheckboxStatus(@RequestParam String studentId, @RequestParam String courseName,
			@RequestParam String batchId) {

		Integer result = razorpayService.getCheckboxClicked(studentId, courseName, batchId);
		return ResponseEntity.ok(result != null ? result : 0);
	}

	@GetMapping("/getByEmailAndCourse")
	public List<PaymentTransaction> getByEmailAndCourse(@RequestParam String email, @RequestParam String courseName,
			@RequestParam String batchId) {
		return razorpayService.getTransactionsByEmailAndCourse(email, courseName, batchId);
	}

	@PostMapping("/installment-request")
	public ResponseEntity<PaymentTransactionResponse> createInstallmentRequest(
			@RequestBody PaymentTransactionRequest paymentTransactionRequest) throws MessagingException {

		PaymentTransactionResponse response = razorpayService.createRequestInstallment(paymentTransactionRequest);

		// Email to USER
		emailService.sendInstallmentRequestSubmittedEmail(paymentTransactionRequest.getPayerEmail(),
				paymentTransactionRequest.getStudentName(), paymentTransactionRequest.getCourseName());

		// Email to ADMIN
		emailService.sendInstallmentRequestAdminEmail(paymentTransactionRequest.getStudentName(),
				paymentTransactionRequest.getPayerEmail(), paymentTransactionRequest.getCourseName());
		return ResponseEntity.ok(response);
	}

	@GetMapping("/request-installments")
	public ResponseEntity<List<PaymentTransactionResponse>> getAllRequestInstallments() {

		List<PaymentTransactionResponse> responses = razorpayService.getAllRequestInstallmetns();
		return ResponseEntity.ok(responses);
	}

	@DeleteMapping("/delete-installment-request")
	public ResponseEntity<String> deleteInstallmentRequest(@RequestParam String studentId, @RequestParam String email,
			@RequestParam String courseName, @RequestParam String batchId) {

		String response = razorpayService.deleteInstallmentRequest(studentId, email, courseName, batchId);
		return ResponseEntity.ok(response);
	}
//	@PutMapping("/update-status/{transactionId}")
//	public ResponseEntity<String> updateRequestStatus(@PathVariable Long transactionId,
//			@RequestParam String requestStatus) {
//
//		razorpayService.updateInstallmentRequestStatus(transactionId, requestStatus);
//		
//		return ResponseEntity.ok("Request status updated successfully.");
//	}

	@PutMapping("/update-status/{transactionId}")
	public ResponseEntity<String> updateRequestStatus(@PathVariable Long transactionId,
			@RequestParam String requestStatus) throws MessagingException {

		razorpayService.updateInstallmentRequestStatus(transactionId, requestStatus);

		PaymentTransaction txn = razorpayService.getTransactionById(transactionId);

		if ("APPROVED".equalsIgnoreCase(txn.getRequestStatus())) {
			emailService.sendInstallmentApprovedEmail(txn.getPayerEmail(), txn.getStudentName(), txn.getCourseName());
		} else if ("REJECTED".equalsIgnoreCase(txn.getRequestStatus())) {
			emailService.sendInstallmentRejectedEmail(txn.getPayerEmail(), txn.getStudentName(), txn.getCourseName());
		}

		return ResponseEntity.ok("Request status updated successfully.");
	}

	@GetMapping("/checkInstallment")
	public ResponseEntity<InstallmentStatusResponse> checkInstallment(@RequestParam String studentId,
			@RequestParam String courseName, @RequestParam String batchId) {

		InstallmentStatusResponse response = razorpayService.getLatestStatus(studentId, courseName, batchId);
		return ResponseEntity.ok(response);
	}

	@GetMapping("/payments")
	public ResponseEntity<List<PaymentTransactionSummaryResponse>> getPayments() {
		List<PaymentTransactionSummaryResponse> payments = razorpayService.getAllPaymentTransactions();
		return ResponseEntity.ok(payments);
	}

	@GetMapping("/orders")
	public ResponseEntity<List<PaymentRequest>> getOrders(@RequestParam String email) {
		return ResponseEntity.ok(razorpayService.getDashboardOrders(email));
	}

	@DeleteMapping("/payments/{id}")
	public ResponseEntity<String> deletePayment(@PathVariable Long id) {
		razorpayService.deletePaymentById(id);
		return ResponseEntity.ok("Payment deleted successfully");
	}
}