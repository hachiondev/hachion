package com.hachionUserDashboard.service;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.hachionUserDashboard.dto.BatchScheduleResponse;
import com.hachionUserDashboard.dto.StudentTrackingRequest;
import com.hachionUserDashboard.dto.StudentTrackingResponse;
import com.hachionUserDashboard.entity.StudentTracking;
import com.hachionUserDashboard.repository.CourseScheduleRepository;
import com.hachionUserDashboard.repository.EnrollRepository;
import com.hachionUserDashboard.repository.StudentTrackingRepository;

import Service.StudentTrackingInterface;

@Service
public class StudentTrackingServiceImpl implements StudentTrackingInterface {

	@Autowired
	private EnrollRepository enrollRepository;

	@Autowired
	private CourseScheduleRepository scheduleRepository;

	@Autowired
	private StudentTrackingRepository studentTrackingRepository;

	@Override
	public List<String> getStudentIdsByCourseName(String courseName) {
		return enrollRepository.findStudentIdsByCourseName(courseName);
	}

	@Override
	public List<Map<String, Object>> getStudentCourseInfo(String studentId, String email, String mobile) {
		List<Object[]> results = enrollRepository.findStudentCourseInfo(studentId, email, mobile);
		List<Map<String, Object>> response = new ArrayList<>();

		for (Object[] row : results) {
			Map<String, Object> studentMap = new HashMap<>();
			studentMap.put("studentId", row[0]);
			studentMap.put("name", row[1]);
			studentMap.put("email", row[2]);
			studentMap.put("mobile", row[3]);
			studentMap.put("courseName", row[4]);
			response.add(studentMap);
		}

		return response;
	}

	@Override
	public List<String> getBatchIdsByFilters(String studentId, String email, String courseName) {
		return enrollRepository.findBatchIdsByStudentIdAndEmail(studentId, email, courseName);
	}

	@Override
	public ResponseEntity<?> getBatchScheduleInfo(String batchId) {
		List<Object[]> results = scheduleRepository.findCountAndScheduleDateListByBatchId(batchId);

		if (results.isEmpty()) {
			return ResponseEntity.badRequest().body("Invalid batchId. Please provide a valid one.");
		}

		Object[] row = results.get(0);
		Long count = ((Number) row[0]).longValue();
		LocalDate startDate = LocalDate.parse((String) row[1]);

		LocalDate completionDate;
		String numberOfClassesStr = "0";

		if (batchId.startsWith("LDM")) {
			completionDate = startDate;

		} else if (batchId.startsWith("LCL")) {
			String exactBatchId = scheduleRepository.findExactBatchId(batchId);
			if (exactBatchId != null && exactBatchId.equals(batchId)) {
				numberOfClassesStr = scheduleRepository.findNumberOfClassesByBatchId(batchId);
				int numberOfClasses;
				try {
					numberOfClasses = Integer.parseInt(numberOfClassesStr);
				} catch (NumberFormatException e) {
					numberOfClasses = 0;
				}
				completionDate = startDate.plusDays(numberOfClasses);
			} else {
				completionDate = startDate;
			}

		} else {
			completionDate = startDate;
		}

		BatchScheduleResponse response = new BatchScheduleResponse(batchId, count, startDate, completionDate,
				numberOfClassesStr);
		return ResponseEntity.ok(response);
	}

	@Override
	public StudentTrackingResponse addStudentTracking(StudentTrackingRequest studentTrackingRequest) {
		DateTimeFormatter inputFormatter = DateTimeFormatter.ofPattern("dd-MM-yyyy");

		StudentTracking studentTracking = new StudentTracking();
		studentTracking.setStudentName(studentTrackingRequest.getStudentName());
		studentTracking.setStudentEmail(studentTrackingRequest.getStudentEmail());
		studentTracking.setMobile(studentTrackingRequest.getMobile());
		studentTracking.setStudentId(studentTrackingRequest.getStudentId());
		studentTracking.setCourseName(studentTrackingRequest.getCourseName());
		
		if (studentTrackingRequest.getStartDate() != null) {
			studentTracking.setStartDate(LocalDate.parse(studentTrackingRequest.getStartDate(), inputFormatter));
		}

		if (studentTrackingRequest.getCompletedDate() != null) {
			studentTracking
					.setCompletedDate(LocalDate.parse(studentTrackingRequest.getCompletedDate(), inputFormatter));
		}

		studentTracking.setNumberOfSessions(studentTrackingRequest.getNumberOfSessions());
		studentTracking.setCompletedSessions(studentTrackingRequest.getCompletedSessions());
		studentTracking.setBatchStatus(studentTrackingRequest.getBatchStatus());
		studentTracking.setRemarks(studentTrackingRequest.getRemarks());

		StudentTracking saved = studentTrackingRepository.save(studentTracking);

		StudentTrackingResponse response = createResponseForStudentTracking(saved);

		return response;
	}

	private StudentTrackingResponse createResponseForStudentTracking(StudentTracking saved) {
		StudentTrackingResponse response = new StudentTrackingResponse();
		response.setStudentTrackingId(saved.getStudentTrackingId());
		response.setStudentId(saved.getStudentId());
		response.setCourseName(saved.getCourseName());
		response.setStudentName(saved.getStudentName());
		response.setStudentEmail(saved.getStudentEmail());
		response.setMobile(saved.getMobile());
		response.setStartDate(saved.getStartDate());
		response.setCompletedDate(saved.getCompletedDate());
		response.setNumberOfSessions(saved.getNumberOfSessions());
		response.setCompletedSessions(saved.getCompletedSessions());
		response.setBatchStatus(saved.getBatchStatus());
		response.setRemarks(saved.getRemarks());
		return response;
	}

	@Override
	public List<StudentTrackingResponse> listOfStudentTrackingDetails() {
		List<StudentTracking> listofStudentTrackingDetails = Optional
			.ofNullable(studentTrackingRepository.findAll())
			.orElse(Collections.emptyList());

		List<StudentTrackingResponse> studentTrackingResponses = new ArrayList<>();

		for (StudentTracking studentTracking : listofStudentTrackingDetails) {
			StudentTrackingResponse responseForStudentTracking = createResponseForStudentTracking(studentTracking);
			studentTrackingResponses.add(responseForStudentTracking);
		}

		return studentTrackingResponses;
	}

}
