package com.hachionUserDashboard.controller;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

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

    // 💾 Where the file is stored on your EC2 (Mobaxterm path)
    private static final String UPLOAD_DIR =
            "/home/ec2-user/uploads/prod/interviews/";

    // 🌐 Public URL prefix to serve the file
    // TODO: CHANGE this to your actual domain + path
    // For example: "https://uploads.hachion.co/interviews/"
    private static final String PUBLIC_BASE_URL =
            "https://api.hachion.co/uploads/prod/interviews/";

    @PostMapping("/upload-video")
    public Map<String, String> uploadVideo(@RequestParam("file") MultipartFile file) {
        if (file.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "File is empty");
        }

        try {
            // Make sure folder exists
            Path uploadPath = Paths.get(UPLOAD_DIR);
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }

            // Create safe unique filename
            String originalName = StringUtils.cleanPath(file.getOriginalFilename());
            String ext = "";
            int dot = originalName.lastIndexOf('.');
            if (dot >= 0) {
                ext = originalName.substring(dot);   // .webm / .mp4 / .wav etc.
            }

            String newName = System.currentTimeMillis() + "-" +
                    UUID.randomUUID().toString().replace("-", "") + ext;

            Path target = uploadPath.resolve(newName);

            // Copy file to disk
            Files.copy(file.getInputStream(), target, StandardCopyOption.REPLACE_EXISTING);

            // Build the public URL (this MUST match your Nginx/static mapping)
            String url = PUBLIC_BASE_URL + newName;

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
