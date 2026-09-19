package com.hachionUserDashboard.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.google.api.services.drive.Drive;
import com.google.api.services.drive.model.File;
import com.google.api.services.drive.model.FileList;

import java.time.Instant;

@Service
public class DriveCleanupService {

    @Autowired
    private Drive drive;

    private static final String FOLDER_ID = "1FE4ezSpOmJvyqaVUq2NjVo46wrBhbPsf";

    public void deleteOldRecordings() throws Exception {

        String query = "'" + FOLDER_ID + "' in parents and createdTime < '" + get7DaysAgo() + "'";

        FileList result = drive.files().list()
                .setQ(query)
                .setFields("files(id,name)")
                .execute();

        for (File file : result.getFiles()) {

            System.out.println("Deleting file: " + file.getName());

            drive.files().delete(file.getId()).execute();
        }

        System.out.println("Old recordings cleanup completed!");
    }

    private String get7DaysAgo() {
        return Instant.now().minusSeconds(7 * 24 * 60 * 60).toString();
    }
}