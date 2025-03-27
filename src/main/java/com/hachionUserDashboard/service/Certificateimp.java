package com.hachionUserDashboard.service;

import org.springframework.stereotype.Service;


import Service.CertificateService;

@Service
public class Certificateimp implements CertificateService {
	public String getUserById(Long id) {
	      
        return "User with ID: " + id;
    }
}
