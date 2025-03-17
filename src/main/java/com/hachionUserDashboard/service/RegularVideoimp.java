package com.hachionUserDashboard.service;

import org.springframework.stereotype.Service;


import Service.regularVideoService;

@Service
public class RegularVideoimp implements regularVideoService {

    public String getUserById(Long id) {
      
        return "User with ID: " + id;
    }
}