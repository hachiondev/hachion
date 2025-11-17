package com.hachionUserDashboard.controller;


import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.hachionUserDashboard.dto.InterviewQuestionRequest;
import com.hachionUserDashboard.dto.InterviewQuestionResponse;

import Service.InterviewQuestionService;

@RestController
@RequestMapping("/api/interviews")
@CrossOrigin
public class InterviewQuestionController {

    @Autowired
    private InterviewQuestionService interviewQuestionService;

    @PostMapping("/templates/{templateId}/questions")
    public InterviewQuestionResponse addQuestion(@PathVariable Long templateId,
                                                 @RequestBody InterviewQuestionRequest request) {
        return interviewQuestionService.addQuestionToTemplate(templateId, request);
    }

    @GetMapping("/templates/{templateId}/questions")
    public List<InterviewQuestionResponse> getQuestions(@PathVariable Long templateId) {
        return interviewQuestionService.getQuestionsForTemplate(templateId);
    }

    @PutMapping("/questions/{questionId}")
    public InterviewQuestionResponse updateQuestion(@PathVariable Long questionId,
                                                    @RequestBody InterviewQuestionRequest request) {
        return interviewQuestionService.updateQuestion(questionId, request);
    }

    @DeleteMapping("/questions/{questionId}")
    public void deleteQuestion(@PathVariable Long questionId) {
        interviewQuestionService.deleteQuestion(questionId);
    }

    @GetMapping("/questions")
    public List<InterviewQuestionResponse> getAllQuestions() {
        return interviewQuestionService.getAllQuestions();
    }
}
