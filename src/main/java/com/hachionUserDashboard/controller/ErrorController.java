package com.hachionUserDashboard.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

import jakarta.servlet.http.HttpServletRequest;

@Controller
public class ErrorController implements org.springframework.boot.web.servlet.error.ErrorController {

    @RequestMapping("/error")
    public String handleError(HttpServletRequest request) {
        // You can log the error or extract details from the request
        return "error"; // Your error view (e.g., error.html)
    }

    public String getErrorPath() {
        return "/error";
    }
}
