package com.hachionUserDashboard.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.repository.query.Param;

import com.hachionUserDashboard.entity.InterviewAssignment;

public interface InterviewAssignmentRepository extends JpaRepository<InterviewAssignment, Long> {

	@Query(value = "SELECT * FROM interview_assignment " + "WHERE interview_template_id = :templateId "
			+ "ORDER BY created_at DESC", nativeQuery = true)
	List<InterviewAssignment> findByTemplateId(Long templateId);

	@Query(value = "SELECT * FROM interview_assignment "
			+ "WHERE id = :assignmentId AND secure_token = :token", nativeQuery = true)
	InterviewAssignment findByIdAndToken(Long assignmentId, String token);

	// SEARCH for admin list (optional template, status, search text)
	@Query(value = "SELECT * FROM interview_assignment "
			+ "WHERE (:templateId IS NULL OR interview_template_id = :templateId) "
			+ "  AND (:status IS NULL OR status = :status) " + "  AND (:search IS NULL OR "
			+ "       LOWER(candidate_name) LIKE LOWER(CONCAT('%', :search, '%')) "
			+ "       OR LOWER(candidate_email) LIKE LOWER(CONCAT('%', :search, '%')) " + "      ) "
			+ "ORDER BY created_at DESC", nativeQuery = true)
	List<InterviewAssignment> searchAssignments(@Param("templateId") Long templateId, @Param("status") String status,
			@Param("search") String search);

	// DELETE by id using native query (for admin delete)
	@Modifying
	@Query(value = "DELETE FROM interview_assignment WHERE id = :assignmentId", nativeQuery = true)
	void deleteByIdNative(@Param("assignmentId") Long assignmentId);

}
