package com.hachionUserDashboard.service;

import org.springframework.stereotype.Service;


import Service.demoVideoservice;

@Service
public class DemoVideoImp implements demoVideoservice {

    public String getUserById(Long id) {
      
        return "User with ID: " + id;
    }
}