package com.hachionUserDashboard.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.hachionUserDashboard.dto.DiscountCousesRequest;
import com.hachionUserDashboard.dto.DiscountCousesResponse;

import Service.DiscountCoursesServiceInterface;

@RestController
@RequestMapping("/discounts-courses")
public class DiscountCoursesController {

	@Autowired
	private DiscountCoursesServiceInterface discountService;

	@PostMapping
	public ResponseEntity<DiscountCousesResponse> createCoupon(@RequestBody DiscountCousesRequest request) {
		DiscountCousesResponse response = discountService.createCouponCode(request);
		return ResponseEntity.ok(response);
	}

	@PutMapping
	public ResponseEntity<DiscountCousesResponse> updateCoupon(@RequestBody DiscountCousesRequest request) {
		DiscountCousesResponse response = discountService.updateCouponCode(request);
		return ResponseEntity.ok(response);
	}

	@DeleteMapping("/{discountId}")
	public ResponseEntity<String> deleteCoupon(@PathVariable Long discountId) {
		discountService.deleteCouponCode(discountId);
		return ResponseEntity.ok("Successfully deleted discount courses with id: " + discountId);
	}

	@GetMapping
	public ResponseEntity<List<DiscountCousesResponse>> getAllCoupons() {
		List<DiscountCousesResponse> responses = discountService.getAlCouponCodeDetails();
		return ResponseEntity.ok(responses);
	}
}