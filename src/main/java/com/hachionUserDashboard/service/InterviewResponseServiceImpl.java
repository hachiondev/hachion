package com.hachionUserDashboard.service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.hachionUserDashboard.dto.InterviewResponseDto;
import com.hachionUserDashboard.dto.InterviewResponseRequest;
import com.hachionUserDashboard.entity.InterviewAssignment;
import com.hachionUserDashboard.entity.InterviewQuestion;
import com.hachionUserDashboard.entity.InterviewResponse;
import com.hachionUserDashboard.repository.InterviewAssignmentRepository;
import com.hachionUserDashboard.repository.InterviewQuestionRepository;
import com.hachionUserDashboard.repository.InterviewResponseRepository;

import Service.InterviewResponseService;

@Service
public class InterviewResponseServiceImpl implements InterviewResponseService {

    @Autowired
    private InterviewResponseRepository interviewResponseRepository;

    @Autowired
    private InterviewAssignmentRepository interviewAssignmentRepository;

    @Autowired
    private InterviewQuestionRepository interviewQuestionRepository;

    @Override
    public InterviewResponseDto saveResponse(Long assignmentId, String token, InterviewResponseRequest request) {
        
        InterviewAssignment assignment = interviewAssignmentRepository.findByIdAndToken(assignmentId, token);
        if (assignment == null) {
            throw new RuntimeException("Invalid assignmentId or token");
        }

        
        Optional<InterviewQuestion> optionalQuestion = interviewQuestionRepository.findById(request.getQuestionId());
        if (!optionalQuestion.isPresent()) {
            throw new RuntimeException("InterviewQuestion not found with id: " + request.getQuestionId());
        }
        InterviewQuestion question = optionalQuestion.get();

        
        List<InterviewResponse> existingList = interviewResponseRepository.findByAssignmentId(assignmentId);
        InterviewResponse response = null;
        for (InterviewResponse r : existingList) {
            if (r.getQuestion().getId().equals(question.getId())) {
                response = r;
                break;
            }
        }

        if (response == null) {
            response = new InterviewResponse();
            response.setAssignment(assignment);
            response.setQuestion(question);
        }

        response.setVideoUrl(request.getVideoUrl());
        response.setVideoDurationSeconds(request.getVideoDurationSeconds());
        response.setRetriesUsed(request.getRetriesUsed());
        response.setSubmittedAt(LocalDateTime.now());

        InterviewResponse saved = interviewResponseRepository.save(response);
        return mapToDto(saved);
    }

    @Override
    public List<InterviewResponseDto> getResponsesForAssignment(Long assignmentId) {
        List<InterviewResponse> list = interviewResponseRepository.findByAssignmentId(assignmentId);
        List<InterviewResponseDto> result = new ArrayList<>();
        for (InterviewResponse r : list) {
            result.add(mapToDto(r));
        }
        return result;
    }

    private InterviewResponseDto mapToDto(InterviewResponse r) {
        InterviewResponseDto dto = new InterviewResponseDto();
        dto.setId(r.getId());
        dto.setAssignmentId(r.getAssignment().getId());
        dto.setQuestionId(r.getQuestion().getId());
        dto.setVideoUrl(r.getVideoUrl());
        dto.setVideoDurationSeconds(r.getVideoDurationSeconds());
        dto.setRetriesUsed(r.getRetriesUsed());
        dto.setSubmittedAt(r.getSubmittedAt());
        return dto;
    }
}
