package com.hachionUserDashboard.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.hachionUserDashboard.entity.UnsubscribeEntity;

public interface UnsubscribeRepository extends JpaRepository<UnsubscribeEntity, Long> {

	@Query(value = "SELECT * FROM unsubscribe ORDER BY date DESC", nativeQuery = true)
	List<UnsubscribeEntity> findAllByOrderByDateDesc();

}
