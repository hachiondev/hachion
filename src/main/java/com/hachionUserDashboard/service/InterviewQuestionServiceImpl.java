package com.hachionUserDashboard.service;


import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.hachionUserDashboard.dto.InterviewQuestionRequest;
import com.hachionUserDashboard.dto.InterviewQuestionResponse;
import com.hachionUserDashboard.entity.InterviewQuestion;
import com.hachionUserDashboard.entity.InterviewTemplate;
import com.hachionUserDashboard.repository.InterviewQuestionRepository;
import com.hachionUserDashboard.repository.InterviewTemplateRepository;

import Service.InterviewQuestionService;

@Service
public class InterviewQuestionServiceImpl implements InterviewQuestionService {

    @Autowired
    private InterviewQuestionRepository interviewQuestionRepository;

    @Autowired
    private InterviewTemplateRepository interviewTemplateRepository;

    @Override
    public InterviewQuestionResponse addQuestionToTemplate(Long templateId, InterviewQuestionRequest request) {
        Optional<InterviewTemplate> optional = interviewTemplateRepository.findById(templateId);
        if (!optional.isPresent()) {
            throw new RuntimeException("InterviewTemplate not found with id: " + templateId);
        }
        InterviewTemplate template = optional.get();

        InterviewQuestion question = new InterviewQuestion();
        question.setTemplate(template);
        question.setQuestionText(request.getQuestionText());
        question.setAnswerType(request.getAnswerType());
        question.setMaxDurationSeconds(request.getMaxDurationSeconds());
        question.setPrepTimeSeconds(request.getPrepTimeSeconds());
        question.setMaxRetries(request.getMaxRetries());
        question.setDisplayOrder(request.getDisplayOrder());
        question.setCreatedAt(LocalDateTime.now());

        InterviewQuestion saved = interviewQuestionRepository.save(question);
        return mapToResponse(saved);
    }

    @Override
    public List<InterviewQuestionResponse> getQuestionsForTemplate(Long templateId) {
        List<InterviewQuestion> list = interviewQuestionRepository.findByTemplateIdOrderByDisplayOrder(templateId);
        List<InterviewQuestionResponse> result = new ArrayList<>();
        for (InterviewQuestion q : list) {
            result.add(mapToResponse(q));
        }
        return result;
    }

    @Override
    public InterviewQuestionResponse updateQuestion(Long questionId, InterviewQuestionRequest request) {
        Optional<InterviewQuestion> optional = interviewQuestionRepository.findById(questionId);
        if (!optional.isPresent()) {
            throw new RuntimeException("InterviewQuestion not found with id: " + questionId);
        }
        InterviewQuestion question = optional.get();
        question.setQuestionText(request.getQuestionText());
        question.setAnswerType(request.getAnswerType());
        question.setMaxDurationSeconds(request.getMaxDurationSeconds());
        question.setPrepTimeSeconds(request.getPrepTimeSeconds());
        question.setMaxRetries(request.getMaxRetries());
        question.setDisplayOrder(request.getDisplayOrder());

        InterviewQuestion saved = interviewQuestionRepository.save(question);
        return mapToResponse(saved);
    }

    @Override
    public void deleteQuestion(Long questionId) {
        interviewQuestionRepository.deleteById(questionId);
    }

    private InterviewQuestionResponse mapToResponse(InterviewQuestion q) {
        InterviewQuestionResponse dto = new InterviewQuestionResponse();
        dto.setId(q.getId());
        dto.setTemplateId(q.getTemplate().getId());
        dto.setQuestionText(q.getQuestionText());
        dto.setAnswerType(q.getAnswerType());
        dto.setMaxDurationSeconds(q.getMaxDurationSeconds());
        dto.setPrepTimeSeconds(q.getPrepTimeSeconds());
        dto.setMaxRetries(q.getMaxRetries());
        dto.setDisplayOrder(q.getDisplayOrder());
        dto.setCreatedAt(q.getCreatedAt());
        return dto;
    }
}
