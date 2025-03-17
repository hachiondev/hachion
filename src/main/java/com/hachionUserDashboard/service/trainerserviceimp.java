package com.hachionUserDashboard.service;

import org.springframework.stereotype.Service;

import Service.TrainerService;

@Service
public class trainerserviceimp implements TrainerService {

    public String getUserById(Long id) {
      
        return "User with ID: " + id;
    }
}