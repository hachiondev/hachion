package com.hachionUserDashboard.controller;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.hachionUserDashboard.dto.InterviewReviewRequest;
import com.hachionUserDashboard.dto.InterviewReviewResponse;

import Service.InterviewReviewService;

@RestController
@RequestMapping("/api/interviews/assignments")
@CrossOrigin
public class InterviewReviewController {

    @Autowired
    private InterviewReviewService interviewReviewService;

    // ADMIN: save review
    @PostMapping("/{assignmentId}/review")
    public InterviewReviewResponse saveReview(@PathVariable Long assignmentId,
                                              @RequestBody InterviewReviewRequest request) {
        return interviewReviewService.saveReview(assignmentId, request);
    }

    // ADMIN: get latest review
    @GetMapping("/{assignmentId}/review")
    public InterviewReviewResponse getLatestReview(@PathVariable Long assignmentId) {
        return interviewReviewService.getLatestReviewForAssignment(assignmentId);
    }
}
