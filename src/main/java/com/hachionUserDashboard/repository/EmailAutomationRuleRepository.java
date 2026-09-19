package com.hachionUserDashboard.repository;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.hachionUserDashboard.entity.EmailAutomationRule;

import jakarta.transaction.Transactional;

@Repository
public interface EmailAutomationRuleRepository extends JpaRepository<EmailAutomationRule, Long> {

	List<EmailAutomationRule> findByEnabledTrue();
	
	@Transactional
	@Modifying
	@Query(value = """
	    UPDATE email_automation_rules
	    SET enabled = :enabled,
	        last_run_at = :lastRunAt
	    WHERE id = :id
	    """, nativeQuery = true)
	void updateRuleStatus(
	        @Param("id") Long id,
	        @Param("enabled") Boolean enabled,
	        @Param("lastRunAt") LocalDateTime lastRunAt);
	
//	@Query(value = """
//	        SELECT COUNT(*)
//	        FROM email_automation_rules
//	        WHERE enabled = true
//	        AND LOWER(lead_status) = LOWER(:leadStatus)
//	        """, nativeQuery = true)
//	Long existsRunningAutomationByLeadStatus(
//	        @Param("leadStatus") String leadStatus);
	
	@Query(value = """
	        SELECT COUNT(*)
	        FROM email_automation_rules
	        WHERE enabled = true
	        AND LOWER(lead_status) = LOWER(:leadStatus)
	        AND LOWER(timezone) = LOWER(:timezone)
	        """, nativeQuery = true)
	Long existsRunningAutomationByLeadStatusAndTimezone(
	        @Param("leadStatus") String leadStatus,
	        @Param("timezone") String timezone);
}