package com.hachionUserDashboard.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.hachionUserDashboard.entity.InterviewResponse;

public interface InterviewResponseRepository extends JpaRepository<InterviewResponse, Long> {

    @Query(
        value = "SELECT * FROM interview_response " +
                "WHERE interview_assignment_id = :assignmentId " +
                "ORDER BY submitted_at ASC",
        nativeQuery = true
    )
    List<InterviewResponse> findByAssignmentId(Long assignmentId);
}
