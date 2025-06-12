package com.hachionUserDashboard.controller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.hachionUserDashboard.dto.StudentTrackingRequest;
import com.hachionUserDashboard.dto.StudentTrackingResponse;

import Service.StudentTrackingInterface;

@RestController
@RequestMapping("/studentsTracking")
public class StudentTrackingController {

    @Autowired
    private StudentTrackingInterface studentTrackingService;
    
    @GetMapping("/gettingStudentId")
    public ResponseEntity<List<String>> getStudentIdsByCourseName(@RequestParam String courseName) {
        List<String> studentIds = studentTrackingService.getStudentIdsByCourseName(courseName);
        return ResponseEntity.ok(studentIds);
    }
    
    @GetMapping("/gettingEmail")
    public ResponseEntity<List<Map<String, Object>>> getStudentCourseInfo(
            @RequestParam(required = false) String studentId,
            @RequestParam(required = false) String email,
            @RequestParam(required = false) String mobile) {

        List<Map<String, Object>> response = studentTrackingService.getStudentCourseInfo(studentId, email, mobile);
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/batches")
    public ResponseEntity<List<String>> getBatchIdsByFilters(
            @RequestParam(required = false) String studentId,
            @RequestParam(required = false) String email,
            @RequestParam(required = false) String courseName) {

        List<String> batchIds = studentTrackingService.getBatchIdsByFilters(studentId, email, courseName);
        return ResponseEntity.ok(batchIds);
    }

    @PostMapping("/add")
    public ResponseEntity<StudentTrackingResponse> addStudentTracking(
            @RequestBody StudentTrackingRequest studentTrackingRequest) {
        StudentTrackingResponse response = studentTrackingService.addStudentTracking(studentTrackingRequest);
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/batchInfo")
	public ResponseEntity<?> getBatchScheduleInfo(@RequestParam String batchId) {
		return studentTrackingService.getBatchScheduleInfo(batchId);
	}
    
    @GetMapping
    public ResponseEntity<List<StudentTrackingResponse>> getAllStudentTrackingDetails() {
        List<StudentTrackingResponse> responses = studentTrackingService.listOfStudentTrackingDetails();
        return ResponseEntity.ok(responses);
    }
    
}