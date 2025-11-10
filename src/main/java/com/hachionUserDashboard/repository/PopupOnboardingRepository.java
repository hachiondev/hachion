package com.hachionUserDashboard.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.hachionUserDashboard.entity.PopupOnboarding;

public interface PopupOnboardingRepository extends JpaRepository<PopupOnboarding, Long> {

	 Optional<PopupOnboarding> findTopByStudentEmailOrderByFillingDateDesc(String studentEmail);
}
