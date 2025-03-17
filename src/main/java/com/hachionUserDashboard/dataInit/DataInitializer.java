//package com.hachionUserDashboard.dataInit;
//
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.boot.CommandLineRunner;
//import org.springframework.context.annotation.Bean;
//import org.springframework.context.annotation.Configuration;
//
//import com.hachionUserDashboard.entity.User;
//import com.hachionUserDashboard.repository.UserRepository;
//
//@Configuration
//public class DataInitializer {
//	
//	@Autowired
//    private UserRepository userRepository;
//
//    @Bean
//    CommandLineRunner runner() {
//        return args -> {
//            // Insert User
//            User user1 = new User(1, "user1", "password", "user1@example.com");
//            userRepository.save(user1);
//        };
//}
//}