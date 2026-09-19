package com.hachionUserDashboard.controller;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.hachionUserDashboard.dto.EmailAutomationRuleRequestDTO;
import com.hachionUserDashboard.dto.EmailAutomationRuleResponseDTO;
import com.hachionUserDashboard.service.EmailAutomationRuleService;

import java.util.List;

@RestController
@CrossOrigin
@RequestMapping("/automation-rules")
public class EmailAutomationRuleController {

    @Autowired
    private EmailAutomationRuleService service;

    // ==========================================================
    // ✅ CREATE RULE
    // ==========================================================

    @PostMapping
    public EmailAutomationRuleResponseDTO saveRule(
            @RequestBody EmailAutomationRuleRequestDTO dto) {

        return service.saveRule(dto);
    }

    // ==========================================================
    // ✅ GET ALL RULES
    // ==========================================================

    @GetMapping
    public List<EmailAutomationRuleResponseDTO> getAllRules() {

        return service.getAllRules();
    }

    // ==========================================================
    // ✅ GET SINGLE RULE
    // ==========================================================

    @GetMapping("/{id}")
    public EmailAutomationRuleResponseDTO getRule(
            @PathVariable Long id) {

        return service.getRule(id);
    }

    // ==========================================================
    // ✅ DELETE RULE
    // ==========================================================

    @DeleteMapping("/{id}")
    public String deleteRule(
            @PathVariable Long id) {

        service.deleteRule(id);

        return "Rule deleted successfully";
    }

    // ==========================================================
    // ✅ ENABLE / DISABLE RULE
    // ==========================================================

    @PutMapping("/toggle/{id}")
    public EmailAutomationRuleResponseDTO toggleRule(
            @PathVariable Long id) {

        return service.toggleRule(id);
    }

    // ==========================================================
    // ✅ MANUAL RUN RULE
    // ==========================================================

    @PostMapping("/run/{id}")
    public String runRule(
            @PathVariable Long id) {

        service.runRule(id);

        return "Automation executed successfully";
    }
    @PutMapping("/{id}")
    public ResponseEntity<?> updateRule(
            @PathVariable Long id,
            @RequestBody EmailAutomationRuleRequestDTO req) {

        try {

            EmailAutomationRuleResponseDTO response =
            		service.updateRule(id, req);

            return ResponseEntity.ok(response);

        } catch (RuntimeException ex) {

            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ex.getMessage());

        } catch (Exception ex) {

            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to update automation rule");
        }
    }
}