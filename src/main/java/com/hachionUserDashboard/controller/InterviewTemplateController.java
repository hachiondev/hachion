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

import com.hachionUserDashboard.dto.InterviewTemplateRequest;
import com.hachionUserDashboard.dto.InterviewTemplateResponse;

import Service.InterviewTemplateService;

@RestController
@RequestMapping("/api/interviews/templates")
@CrossOrigin
public class InterviewTemplateController {

    @Autowired
    private InterviewTemplateService interviewTemplateService;

    @PostMapping
    public InterviewTemplateResponse createTemplate(@RequestBody InterviewTemplateRequest request) {
        return interviewTemplateService.createTemplate(request);
    }

    @GetMapping
    public List<InterviewTemplateResponse> getAllTemplates() {
        return interviewTemplateService.getAllTemplates();
    }

    @GetMapping("/active")
    public List<InterviewTemplateResponse> getActiveTemplates() {
        return interviewTemplateService.getAllActiveTemplates();
    }

    @GetMapping("/{id}")
    public InterviewTemplateResponse getTemplate(@PathVariable Long id) {
        return interviewTemplateService.getTemplateById(id);
    }

    @PutMapping("/{id}")
    public InterviewTemplateResponse updateTemplate(@PathVariable Long id,
                                                    @RequestBody InterviewTemplateRequest request) {
        return interviewTemplateService.updateTemplate(id, request);
    }

    @DeleteMapping("/{id}")
    public void deactivateTemplate(@PathVariable Long id) {
        interviewTemplateService.deactivateTemplate(id);
    }
}
