package com.hachionUserDashboard.controller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.hachionUserDashboard.dto.CouponCodeRequest;
import com.hachionUserDashboard.dto.CouponCodeResponse;

import Service.CouponCodeServiceInterface;

@RestController
@RequestMapping("/coupon-code")
public class CouponCodeController {

	@Autowired
	private CouponCodeServiceInterface couponCodeService;

	@PostMapping("/create")
	public ResponseEntity<CouponCodeResponse> createCouponCode(@RequestBody CouponCodeRequest couponCodeRequest) {
		CouponCodeResponse response = couponCodeService.createCouponCode(couponCodeRequest);
		return ResponseEntity.ok(response);
	}

	@PutMapping("/update")
	public ResponseEntity<CouponCodeResponse> updateCouponCode(@RequestBody CouponCodeRequest couponCodeRequest) {
		CouponCodeResponse response = couponCodeService.updateCouponCode(couponCodeRequest);
		return ResponseEntity.ok(response);
	}

	@GetMapping("/all")
	public ResponseEntity<List<CouponCodeResponse>> getAllCouponCodes() {
		List<CouponCodeResponse> responses = couponCodeService.getAlCouponCodeDetails();
		return ResponseEntity.ok(responses);
	}

	@DeleteMapping("/delete/{id}")
	public ResponseEntity<String> deleteCouponCode(@PathVariable("id") Long couponId) {
		couponCodeService.deleteCouponCode(couponId);
		return ResponseEntity.ok("Successfully deleted coupon code");
	}

//	@GetMapping("/discount/{couponCode}")
//	public ResponseEntity<List<Object[]>> getDiscount(@PathVariable String couponCode) {
//		List<Object[]> discountList = couponCodeService.getDiscountByCouponCode(couponCode);
//		if (!discountList.isEmpty()) {
//			return ResponseEntity.ok(discountList);
//		} else {
//			return ResponseEntity.notFound().build();
//		}
//	}
	@GetMapping("/discount/{couponCode}")
	public ResponseEntity<Map<String, Object>> getDiscount(@PathVariable String couponCode) {
	    Map<String, Object> discountData = couponCodeService.getDiscountByCouponCode(couponCode);

	    if (discountData.isEmpty()) {
	        return ResponseEntity.notFound().build();
	    } else {
	        return ResponseEntity.ok(discountData);
	    }
	}

}
