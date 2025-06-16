package com.hachionUserDashboard.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.hachionUserDashboard.entity.PaymentTransaction;

public interface PaymentTransactionRepository extends JpaRepository<PaymentTransaction, Long> {

	@Query(value = "SELECT amount FROM payment_transactions WHERE student_id = :studentId AND course_name = :courseName AND batch_id = :batchId ORDER BY id DESC LIMIT 1", nativeQuery = true)
	Double findAmountPaidForCourse(
	    @Param("studentId") String studentId,
	    @Param("courseName") String courseName,
	    @Param("batchId") String batchId
	);
}
