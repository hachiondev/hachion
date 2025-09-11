package com.hachionUserDashboard.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.hachionUserDashboard.entity.PopupOnboarding;

public interface PopupOnboardingRepository extends JpaRepository<PopupOnboarding, Long> {

//	Optional<PopupOnboarding> findByStudentEmail(String studentEmail);
	@Query(value = "SELECT * FROM popup_onboarding p WHERE p.student_email = :studentEmail LIMIT 1", nativeQuery = true)
	Optional<PopupOnboarding> findByStudentEmail(@Param("studentEmail") String studentEmail);

}
