package com.hachionUserDashboard.service;

import org.springframework.stereotype.Service;

import Service.VideoAccess;

@Service
public class VideoAccessImp implements VideoAccess {

    public String getUserById(Long id) {
      
        return "User with ID: " + id;
    }
}