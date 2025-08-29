package com.hachionUserDashboard.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.hachionUserDashboard.entity.PaymentTransaction;

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

}
