package com.hachionUserDashboard.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.hachionUserDashboard.entity.OfflinePayment;

public interface OfflinePaymentRepository extends JpaRepository<OfflinePayment, Long> {

}
