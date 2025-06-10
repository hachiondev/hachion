package com.hachionUserDashboard.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.hachionUserDashboard.dto.StudentTrackingRequest;
import com.hachionUserDashboard.dto.StudentTrackingResponse;

import Service.StudentTrackingInterface;

@RestController
@RequestMapping("/studentsTracking")
public class StudentTrackingController {

    @Autowired
    private StudentTrackingInterface studentTrackingService;

    @PostMapping("/add")
    public ResponseEntity<StudentTrackingResponse> addStudentTracking(
            @RequestBody StudentTrackingRequest studentTrackingRequest) {
        StudentTrackingResponse response = studentTrackingService.addStudentTracking(studentTrackingRequest);
        return ResponseEntity.ok(response);
    }
}