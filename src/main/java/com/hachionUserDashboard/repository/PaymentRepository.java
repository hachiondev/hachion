package com.hachionUserDashboard.repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.hachionUserDashboard.entity.Payment;
import com.hachionUserDashboard.entity.PaymentInstallment;

import jakarta.transaction.Transactional;

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
	PaymentInstallment findNextUnpaidInstallmentNative(@Param("studentId") String studentId,
			@Param("courseName") String courseName);

	@Modifying
	@Transactional
	@Query(value = "UPDATE payments " + "SET stop_reminder = :stopReminder " + "WHERE course_name = :courseName "
			+ "AND student_id = :studentId " + "AND email = :email", nativeQuery = true)
	int updateStopReminderNative(@Param("stopReminder") String stopReminder, @Param("courseName") String courseName,
			@Param("studentId") String studentId, @Param("email") String email);

	@Query("SELECT p FROM Payment p WHERE p.courseName = :courseName AND p.studentId = :studentId AND p.email = :email")
	Optional<Payment> findByCourseNameAndStudentIdAndEmail(@Param("courseName") String courseName,
			@Param("studentId") String studentId, @Param("email") String email);

//	@Query(value = """
//
//			SELECT
//
//			COALESCE(SUM(p.total_amount),0) AS totalRevenue,
//
//			COALESCE(SUM(p.balance_pay),0) AS pendingAmount,
//
//			(
//			SELECT COUNT(DISTINCT p2.payment_id)
//			FROM payments p2
//			JOIN payment_installments pi
//			ON p2.payment_id = pi.payment_id
//			WHERE pi.due_date < DATE_SUB(CURDATE(), INTERVAL 2 DAY)
//			AND p2.balance_pay > 0
//			AND pi.pay_date BETWEEN :startDate AND :endDate
//			) AS overdueCount,
//
//			(
//			SELECT COUNT(DISTINCT p3.payment_id)
//			FROM payments p3
//			JOIN payment_installments pi3
//			ON p3.payment_id = pi3.payment_id
//			WHERE p3.status = 'PAID'
//			AND pi3.pay_date BETWEEN :startDate AND :endDate
//			) AS paidCount,
//
//			(
//			SELECT COALESCE(SUM(pi2.received_pay),0)
//			FROM payment_installments pi2
//			WHERE pi2.pay_date BETWEEN :startDate AND :endDate
//			) AS totalPayments
//
//			FROM payments p
//			JOIN payment_installments piMain
//			ON p.payment_id = piMain.payment_id
//
//			WHERE piMain.pay_date BETWEEN :startDate AND :endDate
//
//			""", nativeQuery = true)
//	List<Object[]> getPaymentSummary(
//	        @Param("startDate") LocalDate startDate,
//	        @Param("endDate") LocalDate endDate);

	@Query(value = """

						SELECT
			  p.currency AS currency,
			  COALESCE(SUM(p.total_amount), 0) AS totalRevenue,  -- Sum the total amount from parent only once
			  COALESCE(SUM(p.balance_pay), 0) AS pendingAmount,
			  COUNT(DISTINCT CASE
			    WHEN pi.due_date < DATE_SUB(CURDATE(), INTERVAL 2 DAY)
			         AND p.balance_pay > 0
			    THEN p.payment_id
			  END) AS overdueCount,
			  COUNT(DISTINCT CASE
			    WHEN p.status = 'PAID'
			    THEN p.payment_id
			  END) AS paidCount,
			  COALESCE(SUM(pi.received_pay), 0) AS totalPayments
			FROM payments p
			JOIN payment_installments pi
			  ON p.payment_id = pi.payment_id
			WHERE pi.pay_date BETWEEN :startDate AND :endDate
			GROUP BY p.payment_id, p.currency  -- Group by parent (payment_id) and currency
			ORDER BY p.currency;

						""", nativeQuery = true)
	List<Object[]> getPaymentSummary(@Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);
	
	@Query(value = "SELECT COUNT(*) FROM payments WHERE email = :email AND course_name = :courseName", nativeQuery = true)
    int countByEmailAndCourseName(@Param("email") String email, @Param("courseName") String courseName);
}
