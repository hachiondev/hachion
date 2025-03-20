package com.hachionUserDashboard.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class WebController {
    
  
	 @GetMapping(value = {"/", "/{path:^(?!api).*}"})
	    public String forwardToReact() {
	        return "index"; // No 'forward:' required when static-locations is set
	    }
}
