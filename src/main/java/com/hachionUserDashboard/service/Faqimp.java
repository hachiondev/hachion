package com.hachionUserDashboard.service;

import org.springframework.stereotype.Service;

import Service.FaqService;

@Service
public class Faqimp implements FaqService {

    public String getUserById(Long id) {
      
        return "User with ID: " + id;
    }
}