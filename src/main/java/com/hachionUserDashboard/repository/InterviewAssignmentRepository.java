package com.hachionUserDashboard.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.hachionUserDashboard.entity.InterviewAssignment;

public interface InterviewAssignmentRepository extends JpaRepository<InterviewAssignment, Long> {

    @Query(
        value = "SELECT * FROM interview_assignment " +
                "WHERE interview_template_id = :templateId " +
                "ORDER BY created_at DESC",
        nativeQuery = true
    )
    List<InterviewAssignment> findByTemplateId(Long templateId);

    @Query(
        value = "SELECT * FROM interview_assignment " +
                "WHERE id = :assignmentId AND secure_token = :token",
        nativeQuery = true
    )
    InterviewAssignment findByIdAndToken(Long assignmentId, String token);
}
