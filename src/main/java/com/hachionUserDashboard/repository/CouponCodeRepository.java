package com.hachionUserDashboard.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.hachionUserDashboard.entity.CouponCode;

public interface CouponCodeRepository extends JpaRepository<CouponCode, Long> {

//	@Query(value = "SELECT discount_type, discount_value FROM coupon_code WHERE coupon_code = :couponCode", nativeQuery = true)
//	List<Object[]> findDiscountByCouponCode(@Param("couponCode") String couponCode);
//	
	@Query(value = "SELECT discount_type, discount_value, country_names, end_date, usage_limit, number_of_hits, course_names FROM coupon_code WHERE coupon_code = :couponCode", nativeQuery = true)
	List<Object[]> findDiscountByCouponCode(@Param("couponCode") String couponCode);

	Optional<CouponCode> findByCouponCode(String couponCode);

}
