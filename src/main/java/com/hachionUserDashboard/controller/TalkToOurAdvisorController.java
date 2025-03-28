package com.hachionUserDashboard.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.hachionUserDashboard.dto.TalkToOurAdvisorRequest;

import Response.TalkToOurAdvisorResponse;
import Service.TalkToOurAdvisorServiceInterface;

@RestController
@RequestMapping("/advisors")
public class TalkToOurAdvisorController {

	 @Autowired
	    private TalkToOurAdvisorServiceInterface service;

	    @PostMapping
	    public ResponseEntity<TalkToOurAdvisorResponse> createAdvisor(@RequestBody TalkToOurAdvisorRequest request) {
	        TalkToOurAdvisorResponse response = service.createTalkToOurAdvisor(request);
	        return ResponseEntity.ok(response);
	    }

	    @GetMapping
	    public ResponseEntity<List<TalkToOurAdvisorResponse>> getAllAdvisors() {
	        List<TalkToOurAdvisorResponse> responses = service.getAllTalkToOurAdvisor();
	        return ResponseEntity.ok(responses);
	    }

	    @GetMapping("/{id}")
	    public ResponseEntity<TalkToOurAdvisorResponse> getAdvisorById(@PathVariable Long id) {
	        Optional<TalkToOurAdvisorResponse> advisorResponse = service.getById(id);
	        return advisorResponse.map(ResponseEntity::ok)
	                             .orElseGet(() -> ResponseEntity.notFound().build());
	    }

	    @DeleteMapping("/{id}")
	    public ResponseEntity<String> deleteAdvisor(@PathVariable Long id) {
	        String responseMessage = service.deleteTalkToAdvisor(id);
	        return ResponseEntity.ok(responseMessage);
	    }
}
