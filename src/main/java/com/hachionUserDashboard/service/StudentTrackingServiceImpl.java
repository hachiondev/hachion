package com.hachionUserDashboard.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.hachionUserDashboard.dto.StudentTrackingRequest;
import com.hachionUserDashboard.dto.StudentTrackingResponse;
import com.hachionUserDashboard.entity.StudentTracking;
import com.hachionUserDashboard.repository.StudentTrackingRepository;

import Service.StudentTrackingInterface;

@Service
public class StudentTrackingServiceImpl implements StudentTrackingInterface {

	@Autowired
	private StudentTrackingRepository studentTrackingRepository;

	@Override
	public StudentTrackingResponse addStudentTracking(StudentTrackingRequest studentTrackingRequest) {
		StudentTracking studentTracking = new StudentTracking();

		studentTracking.setStudentName(studentTrackingRequest.getStudentName());
		studentTracking.setStudentEmail(studentTrackingRequest.getStudentEmail());
		studentTracking.setMobile(studentTrackingRequest.getMobile());
		studentTracking.setStartDate(studentTrackingRequest.getStartDate());
		studentTracking.setCompletedDate(studentTrackingRequest.getCompletedDate());
		studentTracking.setNumberOfSessions(studentTrackingRequest.getNumberOfSessions());
		studentTracking.setCompletedSessions(studentTrackingRequest.getCompletedSessions());
		studentTracking.setBatchStatus(studentTrackingRequest.getBatchStatus());
		studentTracking.setRemarks(studentTrackingRequest.getRemarks());

		StudentTracking saved = studentTrackingRepository.save(studentTracking);

		StudentTrackingResponse response = new StudentTrackingResponse();
		response.setStudentTrackingId(saved.getStudentTrackingId());
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

}
