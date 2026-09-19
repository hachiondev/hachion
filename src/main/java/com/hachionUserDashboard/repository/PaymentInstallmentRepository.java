package com.hachionUserDashboard.repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.hachionUserDashboard.entity.PaymentInstallment;

//
//@Repository
//public interface PaymentInstallmentRepository extends JpaRepository<PaymentInstallment, Long> {
//	
//	@Query("""
//			select pi
//			from PaymentInstallment pi
//			join fetch pi.payment p
//			where pi.dueDate = :dueDate
//			  and (pi.receivedPay is null or pi.receivedPay < pi.actualPay)
//			""")
//	List<PaymentInstallment> findUnpaidDueOn(@Param("dueDate") LocalDate dueDate);
//
//	@Query("""
//			select pi
//			from PaymentInstallment pi
//			where pi.payment.paymentId = :paymentId
//			  and pi.payDate is not null
//			  and pi.payDate < :dueDate
//			  and pi.receivedPay is not null
//			  and pi.receivedPay > 0
//			order by pi.payDate desc
//			""")
//
//	Optional<PaymentInstallment> findLastPaidBefore(@Param("paymentId") Long paymentId,
//			@Param("dueDate") LocalDate dueDate);
//
//	// === New helper used by your upgraded scheduler ===
//	// Unpaid installments that are overdue OR due today (dueDate <= today)
//	@Query("SELECT pi FROM PaymentInstallment pi " + "JOIN FETCH pi.payment p "
//			+ "WHERE (pi.receivedPay IS NULL OR pi.receivedPay = 0) " + "AND pi.dueDate <= :byDate")
//	List<PaymentInstallment> findUnpaidDueOnOrBefore(@Param("byDate") LocalDate byDate);
//
//	
//	@Query("SELECT pi FROM PaymentInstallment pi " + "WHERE pi.payment.paymentId = :paymentId "
//			+ "AND pi.payDate IS NOT NULL " + "AND pi.payDate < :beforeDate " + "ORDER BY pi.payDate DESC")
//	List<PaymentInstallment> _findLastPaidBeforePage(@Param("paymentId") Long paymentId,
//			@Param("beforeDate") LocalDate beforeDate, Pageable pageable);
//
//}
@Repository
public interface PaymentInstallmentRepository extends JpaRepository<PaymentInstallment, Long> {

    // 1) Due exactly on a date AND still unpaid, but skip fully-cleared invoices
    @Query("""
            select pi
            from PaymentInstallment pi
            join fetch pi.payment p
            where pi.dueDate = :dueDate
              and p.balancePay > 0
              and (pi.receivedPay is null or pi.receivedPay < pi.actualPay)
            """)
    List<PaymentInstallment> findUnpaidDueOn(@Param("dueDate") LocalDate dueDate);

    // 2) Last paid before a date
    @Query("""
            select pi
            from PaymentInstallment pi
            join pi.payment p
            where pi.payment.paymentId = :paymentId
              and p.balancePay > 0
              and pi.payDate is not null
              and pi.payDate < :dueDate
              and pi.receivedPay is not null
              and pi.receivedPay > 0
            order by pi.payDate desc
            """)
    Optional<PaymentInstallment> findLastPaidBefore(@Param("paymentId") Long paymentId,
                                                    @Param("dueDate") LocalDate dueDate);

    // 3) Unpaid installments that are overdue OR due today (<= byDate)
    @Query("""
            select pi
            from PaymentInstallment pi
            join fetch pi.payment p
            where p.balancePay > 0
              and (pi.receivedPay is null or pi.receivedPay = 0)
              and pi.dueDate <= :byDate
            """)
    List<PaymentInstallment> findUnpaidDueOnOrBefore(@Param("byDate") LocalDate byDate);

    // 4) Last paid before a date with pagination
    @Query("""
            select pi
            from PaymentInstallment pi
            join pi.payment p
            where pi.payment.paymentId = :paymentId
              and p.balancePay > 0
              and pi.payDate is not null
              and pi.payDate < :beforeDate
            order by pi.payDate desc
            """)
    List<PaymentInstallment> _findLastPaidBeforePage(@Param("paymentId") Long paymentId,
                                                     @Param("beforeDate") LocalDate beforeDate,
                                                     Pageable pageable);
}

