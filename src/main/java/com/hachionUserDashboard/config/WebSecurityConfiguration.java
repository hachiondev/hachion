package com.hachionUserDashboard.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
//@EnableWebSecurity
public class WebSecurityConfiguration {
//
//    @Bean
//    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
//        http.csrf(AbstractHttpConfigurer::disable)
//            .authorizeHttpRequests(auth -> auth
//                .requestMatchers("/", "/home", "/sendotp").permitAll()  // Public pages
//                .anyRequest().authenticated())  // Secure all other pages
//
//            // OAuth2 Login configuration for Google
//            .oauth2Login(oauth2 -> oauth2
//                .loginPage("/login")  // Custom login page
//                .defaultSuccessUrl("/loginSuccess", true)  // Redirect after successful login
//                .failureUrl("/login?error=true"))  // Redirect on failure
//
//            // Form Login configuration
//            .formLogin(form -> form
//                .loginPage("/login")  // Custom login page for form login
//                .defaultSuccessUrl("/dashboard", true)  // Redirect after successful form login
//                .failureUrl("/login?error=true"));  // Redirect on failure
//
//        return http.build();
//    }
}