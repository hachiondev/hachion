package com.hachionUserDashboard.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

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
			@RequestParam String batchId, @RequestParam(required = false, defaultValue = "0") Double discount) {
		return razorpayService.captureOrder(paymentId, orderId, signature, studentId, courseName, batchId, discount);
	}
}
