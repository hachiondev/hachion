package com.hachionUserDashboard.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.hachionUserDashboard.entity.PaymentTransaction;

public interface PaymentTransactionRepository extends JpaRepository<PaymentTransaction, Long> {

}
