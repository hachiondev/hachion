package com.hachionUserDashboard.service;

import org.springframework.stereotype.Service;

import Service.CurriculumService;


@Service
public class curriculumimp implements CurriculumService {

    public String getUserById(Long id) {
      
        return "User with ID: " + id;
    }
}