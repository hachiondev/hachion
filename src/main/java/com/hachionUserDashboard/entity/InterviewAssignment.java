package com.hachionUserDashboard.entity;


import java.time.LocalDateTime;
import java.util.List;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;

@Entity
@Table(name = "interview_assignment")
public class InterviewAssignment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "interview_template_id", nullable = false)
    private InterviewTemplate template;

    
    @Column(name = "candidate_user_id")
    private Long candidateUserId;

    @Column(name = "candidate_name", nullable = false, length = 200)
    private String candidateName;

    @Column(name = "candidate_email", nullable = false, length = 200)
    private String candidateEmail;

    @Column(name = "secure_token", nullable = false, length = 255, unique = true)
    private String secureToken;

    
    @Column(name = "status", nullable = false, length = 50)
    private String status;

    @Column(name = "expiry_datetime")
    private LocalDateTime expiryDateTime;

    @Column(name = "started_at")
    private LocalDateTime startedAt;

    @Column(name = "completed_at")
    private LocalDateTime completedAt;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    @OneToMany(mappedBy = "assignment", fetch = FetchType.LAZY)
    private List<InterviewResponse> responses;

    @OneToMany(mappedBy = "assignment", fetch = FetchType.LAZY)
    private List<InterviewReview> reviews;

    public InterviewAssignment() {
    }

    
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public InterviewTemplate getTemplate() {
        return template;
    }

    public void setTemplate(InterviewTemplate template) {
        this.template = template;
    }

    public Long getCandidateUserId() {
        return candidateUserId;
    }

    public void setCandidateUserId(Long candidateUserId) {
        this.candidateUserId = candidateUserId;
    }

    public String getCandidateName() {
        return candidateName;
    }

    public void setCandidateName(String candidateName) {
        this.candidateName = candidateName;
    }

    public String getCandidateEmail() {
        return candidateEmail;
    }

    public void setCandidateEmail(String candidateEmail) {
        this.candidateEmail = candidateEmail;
    }

    public String getSecureToken() {
        return secureToken;
    }

    public void setSecureToken(String secureToken) {
        this.secureToken = secureToken;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public LocalDateTime getExpiryDateTime() {
        return expiryDateTime;
    }

    public void setExpiryDateTime(LocalDateTime expiryDateTime) {
        this.expiryDateTime = expiryDateTime;
    }

    public LocalDateTime getStartedAt() {
        return startedAt;
    }

    public void setStartedAt(LocalDateTime startedAt) {
        this.startedAt = startedAt;
    }

    public LocalDateTime getCompletedAt() {
        return completedAt;
    }

    public void setCompletedAt(LocalDateTime completedAt) {
        this.completedAt = completedAt;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public List<InterviewResponse> getResponses() {
        return responses;
    }

    public void setResponses(List<InterviewResponse> responses) {
        this.responses = responses;
    }

    public List<InterviewReview> getReviews() {
        return reviews;
    }

    public void setReviews(List<InterviewReview> reviews) {
        this.reviews = reviews;
    }
}