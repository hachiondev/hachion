package com.hachionUserDashboard.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.hachionUserDashboard.entity.Payment;
import com.hachionUserDashboard.entity.PaymentInstallment;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {

	@Query(value = """
		    SELECT pi.* 
		    FROM payment_installments pi
		    JOIN payments p ON pi.payment_id = p.payment_id
		    WHERE p.student_id = :studentId
		      AND p.course_name = :courseName
		      AND (pi.received_pay IS NULL OR pi.received_pay <= 0)
		    ORDER BY pi.installment_id
		    LIMIT 1
		    """, nativeQuery = true)
		PaymentInstallment findNextUnpaidInstallmentNative(
		    @Param("studentId") String studentId,
		    @Param("courseName") String courseName);

}

