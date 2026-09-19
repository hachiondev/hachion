package com.hachionUserDashboard.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.hachionUserDashboard.entity.ProcessedRecording;

public interface ProcessedRecordingRepository extends JpaRepository<ProcessedRecording, Integer> {

    boolean existsByFileId(String fileId);
}