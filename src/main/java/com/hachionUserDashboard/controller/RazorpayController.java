package com.hachionUserDashboard.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.hachionUserDashboard.dto.PaymentTransactionRequest;
import com.hachionUserDashboard.dto.PaymentTransactionResponse;
import com.hachionUserDashboard.entity.PaymentTransaction;

import Service.RazorpayServiceInterface;

@RestController
@RequestMapping("/razorpay")
public class RazorpayController {

	@Autowired
	private RazorpayServiceInterface razorpayService;

	@PostMapping("/create-razorpay-order")
	public String createOrder(@RequestParam Double amount) {
		return razorpayService.createOrder(amount);
	}

	@PostMapping("/capture-razorpay")
	public String capturePayment(@RequestParam String paymentId, @RequestParam String orderId,
			@RequestParam String signature, @RequestParam String studentId, @RequestParam String courseName,
			@RequestParam String batchId) {
		return razorpayService.captureOrder(paymentId, orderId, signature, studentId, courseName, batchId);
	}

	@PostMapping("/capture-razorpay-installments")
	public String capturePaymentInstallments(@RequestParam String paymentId, @RequestParam String orderId,
			@RequestParam String signature, @RequestParam String studentId, @RequestParam String courseName,
			@RequestParam String batchId,
			@RequestParam(required = false, defaultValue = "0") Integer numSelectedInstallments,
			Integer checkboxClicked) {
		return razorpayService.captureInstllmentOrder(paymentId, orderId, signature, studentId, courseName, batchId,
				numSelectedInstallments, checkboxClicked);
	}

	@GetMapping("/checkbox-status")
	public ResponseEntity<Integer> getCheckboxStatus(@RequestParam String studentId, @RequestParam String courseName,
			@RequestParam String batchId) {

		Integer result = razorpayService.getCheckboxClicked(studentId, courseName, batchId);
		return ResponseEntity.ok(result != null ? result : 0);
	}

	@GetMapping("/getByEmailAndCourse")
	public List<PaymentTransaction> getByEmailAndCourse(@RequestParam String email, @RequestParam String courseName) {
		return razorpayService.getTransactionsByEmailAndCourse(email, courseName);
	}

	@PostMapping("/installment-request")
	public ResponseEntity<PaymentTransactionResponse> createInstallmentRequest(
			@RequestBody PaymentTransactionRequest paymentTransactionRequest) {

		PaymentTransactionResponse response = razorpayService.createRequestInstallment(paymentTransactionRequest);
		return ResponseEntity.ok(response);
	}

	@GetMapping("/request-installments")
	public ResponseEntity<List<PaymentTransactionResponse>> getAllRequestInstallments() {

		List<PaymentTransactionResponse> responses = razorpayService.getAllRequestInstallmetns();
		return ResponseEntity.ok(responses);
	}

	@PutMapping("/update-status/{transactionId}")
	public ResponseEntity<String> updateRequestStatus(@PathVariable Long transactionId, @RequestParam String requestStatus) {

		razorpayService.updateInstallmentRequestStatus(transactionId, requestStatus);
		return ResponseEntity.ok("Request status updated successfully.");
	}
}