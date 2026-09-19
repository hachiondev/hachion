package com.hachionUserDashboard.controller;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api/interviews")
@CrossOrigin
public class InterviewMediaController {

    // Was a hardcoded prod-only literal (no dev/test equivalent), so every
    // profile read/wrote interview videos out of the prod bucket regardless
    // of which one was actually active.
    @Value("${interview.upload.dir}")
    private String uploadDir;

    // Shared prefix for everything under this profile's uploads bucket
    // (see application-{dev,test,prod}.properties) - was hardcoded to
    // https://api.hachion.co/uploads/prod/interviews/ unconditionally.
    @Value("${app.uploads.public-base-url}")
    private String uploadsPublicBaseUrl;

    @PostMapping("/upload-video")
    public Map<String, String> uploadVideo(@RequestParam("file") MultipartFile file) {
        if (file.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "File is empty");
        }

        try {

            Path uploadPath = Paths.get(uploadDir);
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }

            
            String originalName = StringUtils.cleanPath(file.getOriginalFilename());
            String ext = "";
            int dot = originalName.lastIndexOf('.');
            if (dot >= 0) {
                ext = originalName.substring(dot);   
            }

            String newName = System.currentTimeMillis() + "-" +
                    UUID.randomUUID().toString().replace("-", "") + ext;

            Path target = uploadPath.resolve(newName);

            
            Files.copy(file.getInputStream(), target, StandardCopyOption.REPLACE_EXISTING);

            
            String url = uploadsPublicBaseUrl + "interviews/" + newName;

            Map<String, String> result = new HashMap<>();
            result.put("url", url);
            return result;
        } catch (IOException ex) {
            throw new ResponseStatusException(
                    HttpStatus.INTERNAL_SERVER_ERROR,
                    "Failed to save file",
                    ex
            );
        }
    }
}
