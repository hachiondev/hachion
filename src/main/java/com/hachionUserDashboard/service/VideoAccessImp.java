package com.hachionUserDashboard.service;

import org.springframework.stereotype.Service;

import Service.VideoAccess;
import Service.regularVideoService;

@Service
public class VideoAccessImp implements VideoAccess {

    public String getUserById(Long id) {
      
        return "User with ID: " + id;
    }
}