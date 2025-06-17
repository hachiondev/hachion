package com.hachionUserDashboard.service;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.ui.ExtendedModelMap;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.hachionUserDashboard.dto.PaymentInstallmentRequest;
import com.hachionUserDashboard.dto.PaymentRequest;
import com.hachionUserDashboard.entity.PaymentTransaction;
import com.hachionUserDashboard.repository.PaymentTransactionRepository;
import com.paypal.core.PayPalEnvironment;
import com.paypal.core.PayPalHttpClient;
import com.paypal.orders.AmountWithBreakdown;
import com.paypal.orders.ApplicationContext;
import com.paypal.orders.LinkDescription;
import com.paypal.orders.Order;
import com.paypal.orders.OrderRequest;
import com.paypal.orders.OrdersCaptureRequest;
import com.paypal.orders.OrdersCreateRequest;
import com.paypal.orders.PurchaseUnitRequest;

import Service.PayPalServiceInterface;
import Service.PaymentService;

@Service
public class PayPalServiceImpl implements PayPalServiceInterface {

	private static final String CLIENT_ID = "AaK7ksplllFkZvdZ7WEvQzDbbkCgfnyGVfqv_Lui0vJwwyERgc5j4QT7Zfw7WhaA-qoTe0e-veWNAPBu";
	private static final String CLIENT_SECRET = "EKMGEuKdkaB8blsWZi9f9oRYQk8KY_0TNZ_8MMeOW_sun16sjbzSEy6bHFc9xaF3SPBH3IsMPBjCHEWW";

//	private static final String CLIENT_ID = "AQq7I-l3gwXqnQXC22e4l73Jj_opy1L9_Y9tD2ZEg5UDbODXM8HFtYiYGMANEKKNHL_kFq6dHzrpjkxE";
//	private static final String CLIENT_SECRET = "EKMLwlZIVTF41YOKkU4pNA3B6WeKfbeXswiUgyG6SsrmQfXAgGXZaaTNcvLmjvB31UZYcArv_lH9epvw";

	private final PayPalHttpClient client;

	@Autowired
	private PaymentTransactionRepository paymentTransactionRepository;

	@Autowired
	private PaymentService paymentService;

	public PayPalServiceImpl() {
		PayPalEnvironment environment = new PayPalEnvironment.Live(CLIENT_ID, CLIENT_SECRET);
		this.client = new PayPalHttpClient(environment);
	}

	@Override
	public String createOrder(Double amount, String returnUrl) {
		OrderRequest orderRequest = new OrderRequest();
		orderRequest.checkoutPaymentIntent("CAPTURE");

		PurchaseUnitRequest unitRequest = new PurchaseUnitRequest().amountWithBreakdown(
				new AmountWithBreakdown().currencyCode("USD").value(String.format("%.2f", amount)));
		orderRequest.purchaseUnits(List.of(unitRequest));

		String successUrl = returnUrl + "?status=success";
		String cancelUrl = returnUrl + "?status=cancel";

		orderRequest.applicationContext(new ApplicationContext().returnUrl(successUrl).cancelUrl(cancelUrl));

		OrdersCreateRequest request = new OrdersCreateRequest().requestBody(orderRequest);

		try {
			Order order = client.execute(request).result();
			return order.links().stream().filter(link -> "approve".equals(link.rel())).findFirst()
					.map(LinkDescription::href).orElse("No approval link found.");
		} catch (IOException e) {
			return "Error creating PayPal order: " + e.getMessage();
		}
	}

//	@Override
//	public String captureOrder(String orderId, String studentId, String courseName, String batchId) {
//
//		OrdersCaptureRequest request = new OrdersCaptureRequest(orderId);
//
//		try {
//			Order order = client.execute(request).result();
//			System.out.println("Status" + order.status());
//			  if (!"COMPLETED".equalsIgnoreCase(order.status())) {
//		            return "Cannot capture order. PayPal returned status: " + order.status();
//		        }
//			String transactionId = order.id();
//			String status = order.status();
//			Double amount = Double.valueOf(order.purchaseUnits().get(0).payments().captures().get(0).amount().value());
//			String currency = order.purchaseUnits().get(0).payments().captures().get(0).amount().currencyCode();
//			String payerEmail = order.payer().email();
//
//			String rawJson = new ObjectMapper().writeValueAsString(order);
//
//			PaymentTransaction tx = new PaymentTransaction();
//			tx.setOrderId(orderId);
//			tx.setTransactionId(transactionId);
//			tx.setStatus(status);
//			tx.setAmount(amount);
//			tx.setCurrency(currency);
//			tx.setPayerEmail(payerEmail);
//			tx.setStudentId(studentId);
//			tx.setCourseName(courseName);
//			tx.setBatchId(batchId);
//			tx.setPaymentDate(LocalDateTime.now());
//			tx.setRawResponseJson(rawJson);
//
//			paymentTransactionRepository.save(tx);
//			
//			  PaymentRequest paymentRequest = convertTransactionToPaymentRequest(tx);
//		        paymentService.generateInvoiceForPaypal(paymentRequest, new ExtendedModelMap());
//
//
//			return "Transaction successful: " + transactionId + " (Status: " + status + ")";
//		} catch (IOException e) {
//			return "Error capturing PayPal order: " + e.getMessage();
//		}
//	}
	@Override
	public String captureOrder(String orderId, String studentId, String courseName, String batchId, Double discount) {

		OrdersCaptureRequest request = new OrdersCaptureRequest(orderId);

		try {
			Order order = client.execute(request).result();
			System.out.println("Status: " + order.status());

			if (!"COMPLETED".equalsIgnoreCase(order.status())) {
				return "Cannot capture order. PayPal returned status: " + order.status();
			}

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
			tx.setDiscount(discount);
			tx.setCurrency(currency);
			tx.setPayerEmail(payerEmail);
			tx.setStudentId(studentId);
			tx.setCourseName(courseName);
			tx.setBatchId(batchId);
			tx.setPaymentDate(LocalDateTime.now());
			tx.setRawResponseJson(rawJson);

			PaymentRequest paymentRequest = convertTransactionToPaymentRequest(tx);
			System.out.println("📧 Sending invoice email to: " + paymentRequest.getEmail());
			
			try {
				  paymentService.generateInvoiceForPaypal(paymentRequest, new ExtendedModelMap());
				  System.out.println("📧 Sending invoice email to: " + paymentRequest.getEmail());
				} catch (Exception ex) {
				  System.err.println("⚠️ Failed to send invoice email: " + ex.getMessage());
				}

//			paymentService.generateInvoiceForPaypal(paymentRequest, new ExtendedModelMap());
			paymentTransactionRepository.save(tx);

			System.out.println("📧 Sending invoice email to: " + paymentRequest.getEmail());

			return "Transaction successful: " + transactionId + " (Status: " + status + ")";
		} catch (IOException e) {
			return "Error capturing PayPal order: " + e.getMessage();
		}
	}

	private PaymentRequest convertTransactionToPaymentRequest(PaymentTransaction tx) {
		PaymentRequest pr = new PaymentRequest();
		pr.setStudentName("Student"); // You can look up by studentId if needed
		pr.setEmail(tx.getPayerEmail());
//	    pr.setMobile("N/A"); // Lookup from DB if available
		pr.setCourseName(tx.getCourseName());
		pr.setCourseFee(tx.getAmount()); // Original fee if known
		pr.setDiscount(0);
		pr.setTax(0);
		pr.setTotalAmount(tx.getAmount());
		pr.setBalancePay(tx.getAmount());
		pr.setInvoiceNumber("INV-" + tx.getTransactionId().substring(0, 8));
		pr.setStatus("PAID");
		pr.setDiscount(
			    tx.getDiscount() != null ? tx.getDiscount().intValue() : 0
			);

		PaymentInstallmentRequest installment = new PaymentInstallmentRequest();
		installment.setPayDate(tx.getPaymentDate().toLocalDate());
		installment.setDueDate(tx.getPaymentDate().toLocalDate());
		installment.setReceivedPay(tx.getAmount());

		pr.setInstallments(List.of(installment));
		pr.setSelectedInstallmentId(1L); // dummy

		return pr;

	}

//	@Override
//	public String testInvoiceGeneration(String studentId, String courseName, String batchId) {
//	    try {
//	        // Create dummy transaction data
//	        PaymentTransaction tx = new PaymentTransaction();
//	        tx.setOrderId("TEST_ORDER_123");
//	        tx.setTransactionId("TEST_TX_456");
//	        tx.setStatus("PAID");
//	        tx.setAmount(199.99);
//	        tx.setCurrency("USD");
//	        tx.setPayerEmail("devisidharth6@gmail.com");
//	        tx.setStudentId(studentId);
//	        tx.setCourseName(courseName);
//	        tx.setBatchId(batchId);
//	        tx.setPaymentDate(LocalDateTime.now());
//	        tx.setRawResponseJson("{\"mock\":\"data\"}");
//
//	        // Convert to PaymentRequest
//	        PaymentRequest paymentRequest = convertTransactionToPaymentRequest(tx);
//	        System.out.println("✅ Email sent to " + paymentRequest.getEmail());
//	        // Generate invoice (won’t save anything to DB)
//	        paymentService.generateInvoiceForPaypal(paymentRequest, new ExtendedModelMap());
//
//	        return "Test invoice generated successfully.";
//	    } catch (Exception e) {
//	        return "Error generating test invoice: " + e.getMessage();
//	    }
//	}

}
