package com.hachionUserDashboard.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.hachionUserDashboard.entity.KidsSummerTrainingEntity;

public interface KidsSummerTrainingRepository extends JpaRepository<KidsSummerTrainingEntity, Long> {

	@Query("SELECT COUNT(u) > 0 FROM KidsSummerTrainingEntity u WHERE u.email = :email")
	boolean existsByEmail(@Param("email") String email);

	@Query("SELECT COUNT(u) > 0 FROM KidsSummerTrainingEntity u WHERE u.mobileNumber = :mobile")
	boolean existsByMobile(@Param("mobile") String mobile);
}
