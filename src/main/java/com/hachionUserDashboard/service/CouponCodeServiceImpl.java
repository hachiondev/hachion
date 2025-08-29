package com.hachionUserDashboard.service;

import java.time.LocalDate;
import java.util.Arrays;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.hachionUserDashboard.dto.CouponCodeRequest;
import com.hachionUserDashboard.dto.CouponCodeResponse;
import com.hachionUserDashboard.entity.CouponCode;
import com.hachionUserDashboard.repository.CouponCodeRepository;

import Service.CouponCodeServiceInterface;
import jakarta.transaction.Transactional;

@Service
public class CouponCodeServiceImpl implements CouponCodeServiceInterface {

	@Autowired
	private CouponCodeRepository couponCodeRepository;

	@Override
	public CouponCodeResponse createCouponCode(CouponCodeRequest couponCodeRequest) {
		CouponCode couponCode = new CouponCode();

		couponCode.setCourseNames(couponCodeRequest.getCourseNames());
		couponCode.setCountryNames(couponCodeRequest.getCountryNames());
		couponCode.setCouponCode(couponCodeRequest.getCouponCode());
		couponCode.setDiscountType(couponCodeRequest.getDiscountType());
		couponCode.setDiscountValue(couponCodeRequest.getDiscountValue());
		couponCode.setStartDate(couponCodeRequest.getStartDate());
		couponCode.setEndDate(couponCodeRequest.getEndDate());
		couponCode.setUsageLimit(couponCodeRequest.getUsageLimit());
		couponCode.setStatus(couponCodeRequest.getStatus());
		couponCode.setCreatedDate(LocalDate.now());
		CouponCode savedCoupon = couponCodeRepository.save(couponCode);

		CouponCodeResponse response = createResponseForCouponCodeResponse(savedCoupon);

		return response;
	}

	@Override
	public CouponCodeResponse updateCouponCode(CouponCodeRequest couponCodeRequest) {
		CouponCode existingCoupon = couponCodeRepository.findById(couponCodeRequest.getCouponId()).orElseThrow(
				() -> new RuntimeException("Coupon not found with id: " + couponCodeRequest.getCouponId()));

		existingCoupon.setCourseNames(couponCodeRequest.getCourseNames());
		existingCoupon.setCountryNames(couponCodeRequest.getCountryNames());
		existingCoupon.setCouponCode(couponCodeRequest.getCouponCode());
		existingCoupon.setDiscountType(couponCodeRequest.getDiscountType());
		existingCoupon.setDiscountValue(couponCodeRequest.getDiscountValue());
		existingCoupon.setStartDate(couponCodeRequest.getStartDate());
		existingCoupon.setEndDate(couponCodeRequest.getEndDate());
		existingCoupon.setUsageLimit(couponCodeRequest.getUsageLimit());
		existingCoupon.setStatus(couponCodeRequest.getStatus());

		CouponCode updatedCoupon = couponCodeRepository.save(existingCoupon);

		CouponCodeResponse response = createResponseForCouponCodeResponse(updatedCoupon);

		return response;
	}

	@Override
	public void deleteCouponCode(Long couponId) {
		if (!couponCodeRepository.existsById(couponId)) {
			throw new RuntimeException("Coupon not found with id: " + couponId);
		}
		couponCodeRepository.deleteById(couponId);
	}

	@Override
	public List<CouponCodeResponse> getAlCouponCodeDetails() {
		List<CouponCode> coupons = couponCodeRepository.findAll();
		return coupons.stream().map(this::createResponseForCouponCodeResponse).toList();
	}

//	public List<Object[]> getDiscountByCouponCode(String couponCode) {
//		return couponCodeRepository.findDiscountByCouponCode(couponCode);
//	}

//	public Map<String, Object> getDiscountByCouponCode(String couponCode) {
//	    List<Object[]> results = couponCodeRepository.findDiscountByCouponCode(couponCode);
//
//	    if (results.isEmpty()) {
//	        return Collections.emptyMap(); // or throw exception if preferred
//	    }
//
//	    Object[] row = results.get(0);
//	    String discountType = (String) row[0];
//	    Long discountValue = ((Number) row[1]).longValue();
//	    String countriesCsv = (String) row[2];
//
//	    // Convert CSV to List<String>
//	    List<String> countries = Arrays.stream(countriesCsv.split(","))
//	                                   .map(String::trim)
//	                                   .toList();
//
//	    Map<String, Object> resultMap = new HashMap<>();
//	    resultMap.put("discountType", discountType);
//	    resultMap.put("discountValue", discountValue);
//	    resultMap.put("countries", countries);
//
//	    return resultMap;
//	}

	@Transactional
	public Map<String, Object> getDiscountByCouponCode(String couponCode) {
		List<Object[]> results = couponCodeRepository.findDiscountByCouponCode(couponCode);

		if (results.isEmpty()) {
			return Collections.emptyMap();
		}

		Object[] row = results.get(0);

		String discountType = (String) row[0];
		Long discountValue = ((Number) row[1]).longValue();
		String countriesCsv = (String) row[2];
		LocalDate endDate = row[3] != null ? ((java.sql.Date) row[3]).toLocalDate() : null;
		Integer usageLimit = row[4] != null ? ((Number) row[4]).intValue() : null;
		Integer numberOfHits = row[5] != null ? ((Number) row[5]).intValue() : 0;
		String coursesCsv = (String) row[6];

		List<String> countries = Arrays.stream(countriesCsv.split(",")).map(String::trim).toList();
		List<String> courses = Arrays.stream(coursesCsv.split(",")).map(String::trim).toList();

		// Update hit count if still under usageLimit
		Optional<CouponCode> couponOpt = couponCodeRepository.findByCouponCode(couponCode);
		if (couponOpt.isPresent()) {
			CouponCode coupon = couponOpt.get();

			if (coupon.getNumberOfHits() == null) {
				coupon.setNumberOfHits(0);
			}

			if (usageLimit == null) {
				coupon.setNumberOfHits(coupon.getNumberOfHits() + 1); // always increment
				couponCodeRepository.save(coupon);
				numberOfHits = coupon.getNumberOfHits(); // refresh returned value
			}
		}
		Map<String, Object> resultMap = new HashMap<>();
		resultMap.put("discountType", discountType);
		resultMap.put("discountValue", discountValue);
		resultMap.put("countries", countries);
		resultMap.put("endDate", endDate);
		resultMap.put("usageLimit", usageLimit);
		resultMap.put("numberOfHits", numberOfHits);
		resultMap.put("courses", courses);

		return resultMap;
	}

//	public Map<String, Object> getDiscountByCouponCode(String couponCode) {
//		List<Object[]> results = couponCodeRepository.findDiscountByCouponCode(couponCode);
//
//		if (results.isEmpty()) {
//			return Collections.emptyMap();
//		}
//
//		Object[] row = results.get(0);
//		String discountType = (String) row[0];
//		Long discountValue = ((Number) row[1]).longValue();
//		String countriesCsv = (String) row[2];
//		LocalDate endDate = row[3] != null ? ((java.sql.Date) row[3]).toLocalDate() : null;
//
//		List<String> countries = Arrays.stream(countriesCsv.split(",")).map(String::trim).toList();
//
//		Map<String, Object> resultMap = new HashMap<>();
//		resultMap.put("discountType", discountType);
//		resultMap.put("discountValue", discountValue);
//		resultMap.put("countries", countries);
//		resultMap.put("endDate", endDate);
//
//		return resultMap;
//	}

	private CouponCodeResponse createResponseForCouponCodeResponse(CouponCode savedCoupon) {
		CouponCodeResponse response = new CouponCodeResponse();
		response.setCouponId(savedCoupon.getCouponId());
		response.setCourseNames(savedCoupon.getCourseNames());
		response.setCountryNames(savedCoupon.getCountryNames());
		response.setCouponCode(savedCoupon.getCouponCode());
		response.setDiscountType(savedCoupon.getDiscountType());
		response.setDiscountValue(savedCoupon.getDiscountValue());
		response.setStartDate(savedCoupon.getStartDate());
		response.setEndDate(savedCoupon.getEndDate());
		response.setUsageLimit(savedCoupon.getUsageLimit());
		response.setStatus(savedCoupon.getStatus());
		response.setCreatedDate(savedCoupon.getCreatedDate());
		return response;
	}

}
