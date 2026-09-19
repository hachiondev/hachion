package com.hachionUserDashboard.cronjobs;



import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import com.hachionUserDashboard.repository.EmailAutomationRuleRepository;
import com.hachionUserDashboard.service.EmailAutomationRuleService;

@Component
public class EmailAutomationScheduler {

    @Autowired
    private EmailAutomationRuleRepository ruleRepository;

    @Autowired
    private EmailAutomationRuleService ruleService;

    @Scheduled(cron = "0 * * * * *")
    public void runAutomationRules() {
        ruleService.processAutomationRules();
    }
}