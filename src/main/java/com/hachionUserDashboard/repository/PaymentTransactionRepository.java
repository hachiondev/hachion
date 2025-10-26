package com.hachionUserDashboard.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.hachionUserDashboard.entity.PaymentTransaction;

import jakarta.transaction.Transactional;

public interface PaymentTransactionRepository extends JpaRepository<PaymentTransaction, Long> {

	@Query(value = "SELECT amount FROM payment_transactions WHERE student_id = :studentId AND course_name = :courseName AND batch_id = :batchId ORDER BY id DESC LIMIT 1", nativeQuery = true)
	Double findAmountPaidForCourse(@Param("studentId") String studentId, @Param("courseName") String courseName,
			@Param("batchId") String batchId);

	@Query(value = "SELECT * FROM payment_transactions pt " + "WHERE pt.student_id = :studentId "
			+ "AND pt.course_name = :courseName " + "LIMIT 1", nativeQuery = true)
	Optional<PaymentTransaction> findByStudentIdAndCourseName(@Param("studentId") String studentId,
			@Param("courseName") String courseName);

	@Query(value = "SELECT t.checkbox_clicked " + "FROM payment_transactions t " + "WHERE t.student_id = :studentId "
			+ "AND t.course_name = :courseName " + "AND t.batch_id = :batchId", nativeQuery = true)
	Integer findCheckboxClicked(@Param("studentId") String studentId, @Param("courseName") String courseName,
			@Param("batchId") String batchId);

	@Query(value = "SELECT * FROM payment_transactions WHERE payer_email = :payerEmail AND course_name = :courseName", nativeQuery = true)
	List<PaymentTransaction> findByPayerEmailAndCourseName(@Param("payerEmail") String payerEmail,
			@Param("courseName") String courseName);

	@Modifying
	@Transactional
	@Query(value = "UPDATE payment_transactions SET request_status = :requestStatus WHERE id = :transactionId", nativeQuery = true)
	int updateRequestStatus(@Param("transactionId") Long transactionId, @Param("requestStatus") String requestStatus);

	@Query(value = "SELECT request_status, number_of_installments " + "FROM payment_transactions "
			+ "WHERE student_id = :studentId " + "AND course_name = :courseName " + "LIMIT 1", nativeQuery = true)
	List<Object[]> findLatestStatusAndInstallmentsByStudentIdAndCourseName(@Param("studentId") String studentId,
			@Param("courseName") String courseName);

	  @Query(value = """
		        SELECT 
		            pt.order_id                                       AS orderId,
		            pt.course_name                                    AS courseName,
		            DATE(pt.payment_date)                             AS orderDate,
		            COALESCE(NULLIF(pt.amount, 0), pt.course_fee)     AS price,
		            COALESCE(pt.status, 'Processing')                 AS status
		        FROM payment_transactions pt
		        WHERE LOWER(pt.payer_email) = LOWER(:email)
		        ORDER BY pt.payment_date DESC
		        """, nativeQuery = true)
		    List<Object[]> findDashboardRows(@Param("email") String email);
}
