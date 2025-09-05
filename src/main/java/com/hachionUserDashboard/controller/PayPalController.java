package com.hachionUserDashboard.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import Service.PayPalServiceInterface;

@RestController
public class PayPalController {

	@Autowired
	private PayPalServiceInterface payPalService;

	@PostMapping("/create-order")
	public String createOrder(@RequestParam Double amount, String returnUrl) {
		return payPalService.createOrder(amount, returnUrl);
	}

	@PostMapping("/capture-order")
	public String captureOrder(@RequestParam String orderId, @RequestParam String studentId,
			@RequestParam String courseName, @RequestParam String batchId,
			@RequestParam(required = false) Double discount) {
		return payPalService.captureOrder(orderId, studentId, courseName, batchId, discount);
	}

}