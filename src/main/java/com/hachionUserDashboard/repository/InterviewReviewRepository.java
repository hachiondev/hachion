package com.hachionUserDashboard.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.hachionUserDashboard.entity.InterviewReview;

public interface InterviewReviewRepository extends JpaRepository<InterviewReview, Long> {

    @Query(
        value = "SELECT * FROM interview_review " +
                "WHERE interview_assignment_id = :assignmentId " +
                "ORDER BY reviewed_at DESC LIMIT 1",
        nativeQuery = true
    )
    InterviewReview findLatestByAssignmentId(Long assignmentId);
}
