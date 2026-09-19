package com.hachionUserDashboard.entity;


import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "interview_template")
public class InterviewTemplate {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "title", nullable = false, length = 200)
    private String title;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    
    @Column(name = "type", nullable = false, length = 50)
    private String type;

    @Column(name = "is_active", nullable = false)
    private boolean active = true;

    @Column(name = "created_by_user_id")
    private Long createdByUserId;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @OneToMany(mappedBy = "template", fetch = FetchType.LAZY)
    private List<InterviewQuestion> questions;

    @OneToMany(mappedBy = "template", fetch = FetchType.LAZY)
    private List<InterviewAssignment> assignments;

    public InterviewTemplate() {
    }

    

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public boolean isActive() {
        return active;
    }

    public void setActive(boolean active) {
        this.active = active;
    }

    public Long getCreatedByUserId() {
        return createdByUserId;
    }

    public void setCreatedByUserId(Long createdByUserId) {
        this.createdByUserId = createdByUserId;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    public List<InterviewQuestion> getQuestions() {
        return questions;
    }

    public void setQuestions(List<InterviewQuestion> questions) {
        this.questions = questions;
    }

    public List<InterviewAssignment> getAssignments() {
        return assignments;
    }

    public void setAssignments(List<InterviewAssignment> assignments) {
        this.assignments = assignments;
    }
}