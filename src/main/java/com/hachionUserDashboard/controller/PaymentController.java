package com.hachionUserDashboard.controller;

import java.io.IOException;
import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ContentDisposition;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.hachionUserDashboard.dto.PaymentRequest;
import com.hachionUserDashboard.dto.PaymentResponse;
import com.hachionUserDashboard.dto.StudentCourseInfo;

import Service.PaymentService;

@RestController
@CrossOrigin
@RequestMapping("/payments")
public class PaymentController {

	@Autowired
	private PaymentService paymentService;


	@Value("${invoice.path}")
	private String invoiceDirectoryPath;

	@PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
	public ResponseEntity<PaymentResponse> addOfflinePayment(@RequestPart("paymentData") PaymentRequest paymentRequest,
			@RequestPart(value = "proof", required = false) List<MultipartFile> files) {

		PaymentResponse response = paymentService.addPayment(paymentRequest, files);
		return new ResponseEntity<>(response, HttpStatus.CREATED);
	}

	@GetMapping("/studentInfo")
	public ResponseEntity<StudentCourseInfo> getStudentInfo(@RequestParam(required = false) String studentId,
			@RequestParam(required = false) String email, @RequestParam(required = false) String mobile) {

		if (studentId == null && email == null && mobile == null) {
			return ResponseEntity.badRequest().build();
		}

		StudentCourseInfo info = paymentService.getStudentCourseInfo(studentId, email, mobile);
		return info != null ? ResponseEntity.ok(info) : ResponseEntity.notFound().build();
	}

	@GetMapping("/courseFee")
	public ResponseEntity<Map<String, Object>> getCourseAmount(@RequestParam String courseName) {
		Double amount = paymentService.getAmountByCourseName(courseName);
		if (amount == null) {
			return ResponseEntity.notFound().build();
		}

		Map<String, Object> response = new HashMap<>();
		response.put("courseName", courseName);
		response.put("courseFee", amount);

		return ResponseEntity.ok(response);
	}

	@GetMapping
	public ResponseEntity<List<PaymentResponse>> getAllPayments() {
		List<PaymentResponse> payments = paymentService.findAllPaymentdetails();
		return ResponseEntity.ok(payments);
	}

	@PutMapping(value = "/{paymentId}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
	public ResponseEntity<PaymentResponse> updatePayment(@PathVariable Long paymentId,
			@RequestPart("paymentData") PaymentRequest paymentRequest,
			@RequestPart(value = "proof", required = false) MultipartFile file,
			@RequestParam(value = "proofInstallmentId", required = false) Long proofInstallmentId) {

		PaymentResponse response = paymentService.updatePayment(paymentId, paymentRequest, file, proofInstallmentId);
		return new ResponseEntity<>(response, HttpStatus.OK);
	}

	@DeleteMapping("/{id}")
	public ResponseEntity<String> deletePayment(@PathVariable Long id) {
		try {
			paymentService.deletePaymentById(id);
			return ResponseEntity.ok("Payment deleted successfully.");
		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
					.body("Failed to delete payment with id: " + id);
		}
	}

	@GetMapping("/download/{filename:.+}")
	public ResponseEntity<byte[]> downloadFile(@PathVariable String filename) {
		try {

			String decodedFilename = URLDecoder.decode(filename, StandardCharsets.UTF_8.name());

			byte[] fileData = paymentService.getFileAsBytes(decodedFilename);
			String contentType = paymentService.getContentType(decodedFilename);

			HttpHeaders headers = new HttpHeaders();
			headers.setContentType(MediaType.parseMediaType(contentType));
			headers.setContentDisposition(ContentDisposition.inline().filename(decodedFilename).build());

			return new ResponseEntity<>(fileData, headers, HttpStatus.OK);
		} catch (IOException e) {
			return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
		}
	}

	@PostMapping("/generateInvoice")
	public String generateInvoice(@RequestBody PaymentRequest paymentRequest, Model model) {
		return paymentService.generateInvoice(paymentRequest, model);
	}
//	@PostMapping("/generateInvoiceBeforePayment")
//	public String generateInvoiceBeforePayment(@RequestBody PaymentRequest paymentRequest, Model model) {
//		return paymentService.generateInvoiceBeforePayment(paymentRequest, model);
//	}
	 @PostMapping("/reminder")
	    public ResponseEntity<String> sendReminderEmail(@RequestBody PaymentRequest paymentRequest) {
	        try {
	        	paymentService.sendReminderEmail(paymentRequest);
	            return ResponseEntity.ok("Reminder email sent successfully.");
	        } catch (Exception e) {
	            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
	                                 .body("Failed to send reminder email: " + e.getMessage());
	        }
	    }

}
