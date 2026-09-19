package com.hachionUserDashboard.entity;

import java.time.LocalDateTime;

import jakarta.persistence.*;

@Entity
public class ProcessedRecording {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(unique = true)
    private String fileId;

    private LocalDateTime createdAt = LocalDateTime.now();

    public int getId() { return id; }
    public void setId(int id) { this.id = id; }

    public String getFileId() { return fileId; }
    public void setFileId(String fileId) { this.fileId = fileId; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}