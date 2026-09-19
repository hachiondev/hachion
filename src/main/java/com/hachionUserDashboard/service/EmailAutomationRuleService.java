package com.hachionUserDashboard.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import com.hachionUserDashboard.cronjobs.EmailCronService;
import com.hachionUserDashboard.dto.EmailAutomationRuleRequestDTO;
import com.hachionUserDashboard.dto.EmailAutomationRuleResponseDTO;
import com.hachionUserDashboard.entity.EmailAutomationRule;
import com.hachionUserDashboard.entity.RegisterStudent;
import com.hachionUserDashboard.repository.EmailAutomationRuleRepository;
import com.hachionUserDashboard.repository.RegisterStudentRepository;

import jakarta.transaction.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class EmailAutomationRuleService {

	@Autowired
	private EmailAutomationRuleRepository ruleRepository;

	@Autowired
	private RegisterStudentRepository studentRepository;

	@Autowired
	private EmailCronService emailCronService;

	// ==========================================================
	// ✅ SAVE RULE
	// ==========================================================

	public EmailAutomationRuleResponseDTO saveRule(EmailAutomationRuleRequestDTO dto) {

		EmailAutomationRule rule = new EmailAutomationRule();
		String ruleName = "";

		if (dto.getLeadStatus() != null &&
		    !dto.getLeadStatus().trim().isEmpty()) {

		    ruleName = dto.getLeadStatus().trim();
		}

		if (dto.getTimezone() != null &&
		    !dto.getTimezone().trim().isEmpty()) {

		    if (!ruleName.isEmpty()) {

		        ruleName += "_";
		    }

		    ruleName += dto.getTimezone().trim();
		}

		rule.setRuleName(ruleName);
		rule.setLeadStatus(dto.getLeadStatus());

		rule.setTimezone(dto.getTimezone());

		rule.setFrequencyDays(dto.getFrequencyDays() == null ? 3 : dto.getFrequencyDays());

		rule.setSendTime(dto.getSendTime());

		rule.setStartDate(dto.getStartDate());

		rule.setEndDate(dto.getEndDate());

		rule.setEnabled(dto.getEnabled() == null ? true : dto.getEnabled());

		rule.setMaxEmails(dto.getMaxEmails() == null ? 50 : dto.getMaxEmails());

		rule.setCreatedAt(LocalDateTime.now());

		EmailAutomationRule savedRule = ruleRepository.save(rule);

		return mapToResponseDTO(savedRule);
	}

	// ==========================================================
	// ✅ GET ALL RULES
	// ==========================================================

	public List<EmailAutomationRuleResponseDTO> getAllRules() {

		List<EmailAutomationRule> rules = ruleRepository.findAll(Sort.by(Sort.Direction.DESC, "id"));

		return rules.stream().map(this::mapToResponseDTO).collect(Collectors.toList());
	}

	// ==========================================================
	// ✅ GET SINGLE RULE
	// ==========================================================

	public EmailAutomationRuleResponseDTO getRule(Long id) {

		EmailAutomationRule rule = ruleRepository.findById(id)
				.orElseThrow(() -> new RuntimeException("Rule not found"));

		return mapToResponseDTO(rule);
	}

	// ==========================================================
	// ✅ DELETE RULE
	// ==========================================================

	public void deleteRule(Long id) {

		EmailAutomationRule rule = ruleRepository.findById(id)
				.orElseThrow(() -> new RuntimeException("Rule not found"));

		ruleRepository.delete(rule);
	}

	// ==========================================================
	// ✅ TOGGLE RULE
	// ==========================================================

	public EmailAutomationRuleResponseDTO toggleRule(Long id) {

		EmailAutomationRule rule = ruleRepository.findById(id)
				.orElseThrow(() -> new RuntimeException("Rule not found"));

		rule.setEnabled(!rule.getEnabled());

		EmailAutomationRule updatedRule = ruleRepository.save(rule);

		return mapToResponseDTO(updatedRule);
	}

	// ==========================================================
	// ✅ RUN RULE
	// ==========================================================

	@Transactional
	public void runRule(Long ruleId) {

		EmailAutomationRule rule = ruleRepository.findById(ruleId)
				.orElseThrow(() -> new RuntimeException("Rule not found"));

		List<RegisterStudent> students = getMatchingStudents(rule);

		int successCount = 0;
		int failedCount = 0;

		rule.setTotalMatched(students.size());

		for (RegisterStudent student : students) {

			try {

				System.out.println("Sending Email To: " + student.getEmail());

				emailCronService.sendAutomationEmail(student.getStudentId());

				System.out.println("EMAIL SENT SUCCESSFULLY");

				successCount++;

				System.out.println("SUCCESS COUNT UPDATED : " + successCount);

			} catch (Exception e) {

				failedCount++;

				System.out.println("Failed Email: " + student.getEmail());

				e.printStackTrace();
			}
		}

		System.out.println("LOOP COMPLETED");

		System.out.println("FINAL SUCCESS COUNT : " + successCount);

		System.out.println("FINAL FAILED COUNT : " + failedCount);

		System.out.println("FINAL TOTAL MATCHED : " + students.size());

		rule.setSuccessCount(successCount);

		rule.setFailedCount(failedCount);

		rule.setTotalMatched(students.size());

		rule.setLastRunAt(LocalDateTime.now());

		System.out.println("BEFORE DATABASE SAVE");

		EmailAutomationRule savedRule = ruleRepository.save(rule);

		System.out.println("AFTER DATABASE SAVE");

		System.out.println("DB SUCCESS COUNT : " + savedRule.getSuccessCount());

		System.out.println("DB FAILED COUNT : " + savedRule.getFailedCount());

		System.out.println("DB TOTAL MATCHED : " + savedRule.getTotalMatched());

		rule.setSuccessCount(successCount);

		rule.setFailedCount(failedCount);

		rule.setLastRunAt(LocalDateTime.now());

		ruleRepository.save(rule);
		if (rule.getEndDate() != null && LocalDate.now().isAfter(rule.getEndDate())) {

			rule.setEnabled(false);

			ruleRepository.save(rule);

			System.out.println("Rule Auto Disabled: " + rule.getId());
		}
	}

	// ==========================================================
	// ✅ MATCHING STUDENTS
	// ==========================================================

	public List<RegisterStudent> getMatchingStudents(EmailAutomationRule rule) {

		List<RegisterStudent> allStudents = studentRepository.findAll();

		return allStudents.stream()

				.filter(student -> student.getStatus() != null && student.getStatus().equalsIgnoreCase("ACTIVE"))

				.filter(student -> student.getEmail() != null && !student.getEmail().trim().isEmpty())

				.filter(student -> {

					if (rule.getLeadStatus() == null || rule.getLeadStatus().trim().isEmpty()
							|| rule.getLeadStatus().equalsIgnoreCase("ALL")) {

						return true;
					}

					return student.getLeadTag() != null && student.getLeadTag().equalsIgnoreCase(rule.getLeadStatus());
				})

				.filter(student -> {

					if (rule.getTimezone() == null || rule.getTimezone().trim().isEmpty()
							|| rule.getTimezone().equalsIgnoreCase("ALL")) {

						return true;
					}

					return student.getTime_zone() != null
							&& student.getTime_zone().equalsIgnoreCase(rule.getTimezone());
				})

				.limit(rule.getMaxEmails())

				.toList();
	}

	// ==========================================================
	// ✅ MAP ENTITY TO RESPONSE DTO
	// ==========================================================

	private EmailAutomationRuleResponseDTO mapToResponseDTO(EmailAutomationRule rule) {

		EmailAutomationRuleResponseDTO dto = new EmailAutomationRuleResponseDTO();

		dto.setId(rule.getId());

		dto.setLeadStatus(rule.getLeadStatus());

		dto.setTimezone(rule.getTimezone());

		dto.setFrequencyDays(rule.getFrequencyDays());

		dto.setSendTime(rule.getSendTime());

		dto.setStartDate(rule.getStartDate());

		dto.setEndDate(rule.getEndDate());

		dto.setEnabled(rule.getEnabled());

		dto.setMaxEmails(rule.getMaxEmails());

		dto.setLastRunAt(rule.getLastRunAt());

		dto.setEligibleLeads((long) getMatchingStudents(rule).size());

		String ruleName = (rule.getLeadStatus() == null ? "ALL" : rule.getLeadStatus()) + "_"
				+ (rule.getTimezone() == null ? "ALL" : rule.getTimezone());

		dto.setRuleName(ruleName);

		return dto;
	}

	public void processAutomationRules() {

		System.out.println("🔄 Automation Scheduler Started");

		List<EmailAutomationRule> rules = ruleRepository.findByEnabledTrue();

		LocalDate today = LocalDate.now();

		LocalTime currentTime = LocalTime.now().withSecond(0).withNano(0);

		for (EmailAutomationRule rule : rules) {
			System.out.println("================================");
			System.out.println("CHECKING RULE : " + rule.getId());
			System.out.println("CURRENT TIME : " + currentTime);
			System.out.println("RULE TIME : " + rule.getSendTime());
			System.out.println("LAST RUN AT : " + rule.getLastRunAt());
			System.out.println("FREQUENCY : " + rule.getFrequencyDays());
			System.out.println("ENABLED : " + rule.getEnabled());
			System.out.println("================================");
			try {

				// ==================================================
				// ✅ START DATE CHECK
				// ==================================================

				if (rule.getStartDate() != null && today.isBefore(rule.getStartDate())) {

					continue;
				}

				// ==================================================
				// ✅ END DATE CHECK
				// ==================================================

//				if (rule.getEndDate() != null && today.isAfter(rule.getEndDate())) {
//
//					rule.setEnabled(false);
//
//					ruleRepository.save(rule);
//
//					System.out.println("Rule Expired & Disabled: " + rule.getId());
//
//					continue;
//				}
				
				if (rule.getEndDate() != null) {

				    // ==========================================
				    // END DATE PASSED
				    // ==========================================

				    if (today.isAfter(rule.getEndDate())) {

				        rule.setEnabled(false);

				        ruleRepository.save(rule);

				        System.out.println(
				                "Rule Expired & Disabled: "
				                + rule.getId());

				        continue;
				    }

				    // ==========================================
				    // SAME DAY TIME PASSED
				    // ==========================================

				    if (today.isEqual(rule.getEndDate())
				            && rule.getSendTime() != null
				            && currentTime.isAfter(rule.getSendTime())) {

				        rule.setEnabled(false);

				        ruleRepository.save(rule);

				        System.out.println(
				                "Same Day Rule Expired: "
				                + rule.getId());

				        continue;
				    }
				}

				// ==================================================
				// ✅ SEND TIME CHECK
				// ==================================================

				if (rule.getSendTime() != null) {

					LocalTime ruleTime = rule.getSendTime().withSecond(0).withNano(0);

					if (currentTime.isBefore(ruleTime) || currentTime.isAfter(ruleTime.plusMinutes(1))) {

						System.out.println("TIME NOT MATCHED");

						continue;
					}
				}

				// ==================================================
				// ✅ FREQUENCY CHECK
				// ==================================================

				if (rule.getLastRunAt() != null) {

					LocalDate nextRunDate = rule.getLastRunAt().toLocalDate().plusDays(rule.getFrequencyDays());

					if (today.isBefore(nextRunDate)) {

						continue;
					}
				}

				// ==================================================
				// ✅ RUN RULE
				// ==================================================

				System.out.println("🚀 Running Rule ID: " + rule.getId());

				runRule(rule.getId());

				// ==================================================
				// ✅ UPDATE LAST RUN
				// ==================================================

				System.out.println("BEFORE SECOND SAVE");
				System.out.println("SECOND SAVE SUCCESS COUNT : " + rule.getSuccessCount());
				System.out.println("SECOND SAVE FAILED COUNT : " + rule.getFailedCount());
				System.out.println("SECOND SAVE TOTAL MATCHED : " + rule.getTotalMatched());

				ruleRepository.updateRuleStatus(rule.getId(), rule.getEnabled(), LocalDateTime.now());

				System.out.println("AFTER SECOND SAVE");

				if (rule.getFrequencyDays() == 0) {

					System.out.println("BEFORE DISABLE SAVE");
					System.out.println("DISABLE SAVE SUCCESS COUNT : " + rule.getSuccessCount());
					System.out.println("DISABLE SAVE FAILED COUNT : " + rule.getFailedCount());
					System.out.println("DISABLE SAVE TOTAL MATCHED : " + rule.getTotalMatched());

					rule.setEnabled(false);

					ruleRepository.updateRuleStatus(rule.getId(), false, LocalDateTime.now());
					System.out.println("One Time Rule Completed & Disabled");
				}

				System.out.println("✅ Completed Rule ID: " + rule.getId());

			} catch (Exception e) {

				System.out.println("❌ Error in Rule ID: " + rule.getId());

				e.printStackTrace();
			}
		}

		System.out.println("✅ Automation Scheduler Finished");
	}

	public EmailAutomationRuleResponseDTO updateRule(Long id, EmailAutomationRuleRequestDTO req) {

		Optional<EmailAutomationRule> optional = ruleRepository.findById(id);

		if (!optional.isPresent()) {
			throw new RuntimeException("Rule not found");
		}

		EmailAutomationRule existing = optional.get();

		if (req.getStartDate() != null)
			existing.setStartDate(req.getStartDate());

		if (req.getEndDate() != null)
			existing.setEndDate(req.getEndDate());

		if (req.getSendTime() != null)
			existing.setSendTime(req.getSendTime());

		if (req.getFrequencyDays() != null)
			existing.setFrequencyDays(req.getFrequencyDays());

		EmailAutomationRule updatedRule = ruleRepository.save(existing);

		EmailAutomationRuleResponseDTO response = new EmailAutomationRuleResponseDTO();

		response.setId(updatedRule.getId());
		response.setRuleName(updatedRule.getRuleName());
		response.setLeadStatus(updatedRule.getLeadStatus());
		response.setTimezone(updatedRule.getTimezone());
		response.setFrequencyDays(updatedRule.getFrequencyDays());
		response.setSendTime(updatedRule.getSendTime());
		response.setStartDate(updatedRule.getStartDate());
		response.setEndDate(updatedRule.getEndDate());
		response.setEnabled(updatedRule.getEnabled());
		response.setMaxEmails(updatedRule.getMaxEmails());
		response.setLastRunAt(updatedRule.getLastRunAt());

		return response;
	}
}
