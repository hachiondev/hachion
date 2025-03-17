package com.hachionUserDashboard.service;

import org.springframework.stereotype.Service;

import Service.CourseService;
import Service.FaqService;

@Service
public class Courseimp implements CourseService {

    public String getUserById(Long id) {
      
        return "User with ID: " + id;
    }
}