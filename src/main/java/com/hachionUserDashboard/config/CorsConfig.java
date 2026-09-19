package com.hachionUserDashboard.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class CorsConfig {

	// The set of frontend origins trusted to call this API. Shared with
	// SecurityConfig's frame-ancestors CSP for the certificate preview
	// endpoint - anything already trusted to make cross-origin fetch/XHR
	// calls here is equally trusted to frame a read-only PDF view.
	public static final String[] ALLOWED_ORIGINS = { "https://hachion.co", "https://www.hachion.co",
			"https://test.hachion.co", "http://localhost:3000", "http://localhost:3001",
			"https://api.test.hachion.co", "http://localhost:8081" };

	@Bean
	public WebMvcConfigurer corsConfigurer() {
	    return new WebMvcConfigurer() {
	        @Override
	        public void addCorsMappings(CorsRegistry registry) {
	            registry.addMapping("/**")
	                    .allowedOrigins(ALLOWED_ORIGINS)
	                    .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
						.allowedMethods("*")
	                    .allowedHeaders("*")
	                    .exposedHeaders("Certificate-Id")
	                    .allowCredentials(true);
	        }
	    };
	}
}
