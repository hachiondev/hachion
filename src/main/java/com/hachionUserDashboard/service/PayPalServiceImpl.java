package com.hachionUserDashboard.service;

import Service.PayPalServiceInterface;
import com.paypal.orders.OrderRequest;
import com.paypal.orders.OrdersCaptureRequest;
import com.paypal.orders.PurchaseUnitRequest;
import com.paypal.orders.AmountWithBreakdown;
import com.paypal.orders.ApplicationContext;
import com.paypal.orders.OrdersCreateRequest;
import com.paypal.orders.Order;
import com.paypal.orders.LinkDescription;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.hachionUserDashboard.entity.PaymentTransaction;
import com.hachionUserDashboard.repository.PaymentTransactionRepository;
import com.paypal.core.PayPalEnvironment;
import com.paypal.core.PayPalHttpClient;

@Service
public class PayPalServiceImpl implements PayPalServiceInterface {

	private static final String CLIENT_ID = "AQq7I-l3gwXqnQXC22e4l73Jj_opy1L9_Y9tD2ZEg5UDbODXM8HFtYiYGMANEKKNHL_kFq6dHzrpjkxE";
	private static final String CLIENT_SECRET = "EKMLwlZIVTF41YOKkU4pNA3B6WeKfbeXswiUgyG6SsrmQfXAgGXZaaTNcvLmjvB31UZYcArv_lH9epvw";

	private final PayPalHttpClient client;

	@Autowired
	private PaymentTransactionRepository paymentTransactionRepository;

	public PayPalServiceImpl() {
		PayPalEnvironment environment = new PayPalEnvironment.Sandbox(CLIENT_ID, CLIENT_SECRET);
		this.client = new PayPalHttpClient(environment);
	}

	@Override
	public String createOrder(Double amount) {
		OrderRequest orderRequest = new OrderRequest();
		orderRequest.checkoutPaymentIntent("CAPTURE");

		PurchaseUnitRequest unitRequest = new PurchaseUnitRequest().amountWithBreakdown(
				new AmountWithBreakdown().currencyCode("USD").value(String.format("%.2f", amount)));
		orderRequest.purchaseUnits(List.of(unitRequest));

		orderRequest.applicationContext(new ApplicationContext().returnUrl("http://localhost:3000/success")
				.cancelUrl("http://localhost:3000/cancel"));

		OrdersCreateRequest request = new OrdersCreateRequest().requestBody(orderRequest);

		try {
			Order order = client.execute(request).result();
			return order.links().stream().filter(link -> "approve".equals(link.rel())).findFirst()
					.map(LinkDescription::href).orElse("No approval link found.");
		} catch (IOException e) {
			return "Error creating PayPal order: " + e.getMessage();
		}
	}

	@Override
	public String captureOrder(String orderId, Long studentId, Long courseId) {

		OrdersCaptureRequest request = new OrdersCaptureRequest(orderId);

		try {
			Order order = client.execute(request).result();
			String transactionId = order.id();
			String status = order.status();
			Double amount = Double.valueOf(order.purchaseUnits().get(0).payments().captures().get(0).amount().value());
			String currency = order.purchaseUnits().get(0).payments().captures().get(0).amount().currencyCode();
			String payerEmail = order.payer().email();

			String rawJson = new ObjectMapper().writeValueAsString(order);

			PaymentTransaction tx = new PaymentTransaction();
			tx.setOrderId(orderId);
			tx.setTransactionId(transactionId);
			tx.setStatus(status);
			tx.setAmount(amount);
			tx.setCurrency(currency);
			tx.setPayerEmail(payerEmail);
			tx.setStudentId(studentId);
			tx.setCourseId(courseId);
			tx.setPaymentDate(LocalDateTime.now());
			tx.setRawResponseJson(rawJson);

			paymentTransactionRepository.save(tx);

			return "Transaction successful: " + transactionId + " (Status: " + status + ")";
		} catch (IOException e) {
			return "Error capturing PayPal order: " + e.getMessage();
		}
	}

}
