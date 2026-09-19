package com.hachionUserDashboard.config;

import java.util.Arrays;
import java.util.Collections;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.ClassPathResource;

import com.google.api.client.googleapis.javanet.GoogleNetHttpTransport;
import com.google.api.client.json.jackson2.JacksonFactory;
import com.google.api.services.classroom.Classroom;
import com.google.api.services.drive.Drive;
import com.google.api.services.drive.DriveScopes;
import com.google.auth.http.HttpCredentialsAdapter;
import com.google.auth.oauth2.GoogleCredentials;



@Configuration
public class GoogleConfig {

    private static final String APPLICATION_NAME = "Hachion Student Recording Automation";

    @Bean
    public Drive driveService() throws Exception {

        GoogleCredentials credentials = GoogleCredentials
                .fromStream(new ClassPathResource("service-account.json").getInputStream())
                .createScoped(Collections.singleton(DriveScopes.DRIVE))
                .createDelegated("trainings@hachion.co"); // IMPERSONATION

        return new Drive.Builder(
                GoogleNetHttpTransport.newTrustedTransport(),
                JacksonFactory.getDefaultInstance(),
                new HttpCredentialsAdapter(credentials))
                .setApplicationName(APPLICATION_NAME)
                .build();
    }

    @Bean
    public Classroom classroomService() throws Exception {

        GoogleCredentials credentials = GoogleCredentials
                .fromStream(new ClassPathResource("service-account.json").getInputStream())
                .createScoped(Arrays.asList(
                        "https://www.googleapis.com/auth/classroom.courses",
                        "https://www.googleapis.com/auth/classroom.announcements"))
                .createDelegated("trainings@hachion.co");

        return new Classroom.Builder(
                GoogleNetHttpTransport.newTrustedTransport(),
                JacksonFactory.getDefaultInstance(),
                new HttpCredentialsAdapter(credentials))
                .setApplicationName(APPLICATION_NAME)
                .build();
    }
}