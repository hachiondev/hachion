package com.hachionUserDashboard.controller;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.hachionUserDashboard.entity.Course;
import com.hachionUserDashboard.entity.Resume;
import com.hachionUserDashboard.entity.WorkshopSchedule;
import com.hachionUserDashboard.repository.ResumeRepository;
import com.hachionUserDashboard.repository.WorkshopScheduleRepository;

//@CrossOrigin
@CrossOrigin(origins = {"http://localhost:3000", "http://hachion.co"}) 
@RestController
public class WorkshopScheduleController {

   

   @Autowired
   private WorkshopScheduleRepository repo;


   @GetMapping("/workshopschedule/{id}")
   public ResponseEntity<WorkshopSchedule> getWorkshopSchedule(@PathVariable Integer id) {
       return repo.findById(id)
                  .map(ResponseEntity::ok)
                  .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND).build());
   }

   @GetMapping("/workshopschedule")
   public List<WorkshopSchedule> getAllWorkshopSchedule() {
       return repo.findAll();
   }

//   @PostMapping("/workshopschedule/add")
//   @ResponseStatus(code = HttpStatus.CREATED)
//   public void createWorkshopSchedule(@RequestBody WorkshopSchedule workshopschedule) {
//       repo.save(workshopschedule);
//   }
   private final String uploadDir = System.getProperty("user.home") + "/uploads/wokshop/";

	private String saveFile(MultipartFile file, String subFolder) throws IOException {
		if (file != null && !file.isEmpty()) {
			// Ensure the directory exists
			File directory = new File(uploadDir + subFolder);
			if (!directory.exists()) {
				directory.mkdirs();
			}

			// Save file
			Path filePath = Paths.get(directory.getAbsolutePath(), file.getOriginalFilename());
			Files.write(filePath, file.getBytes());
			return subFolder + "/" + file.getOriginalFilename();
		}
		return null;
	}
	private String saveImage(MultipartFile file) throws IOException {
	    if (file != null && !file.isEmpty()) {
	        File directory = new File(uploadDir);
	        if (!directory.exists()) {
	            directory.mkdirs();
	        }

	        Path filePath = Paths.get(directory.getAbsolutePath(), file.getOriginalFilename());
	        Files.write(filePath, file.getBytes());
	        return "wokshop/" + file.getOriginalFilename(); // relative path
	    }
	    return ""; // Return empty string if no image
	}

	@PostMapping("/workshopschedule/add")
	public ResponseEntity<String> addWorkshopSchedule(
	        @RequestPart("workshop") String workshopData,
	        @RequestPart(value = "bannerImage", required = false) MultipartFile bannerImage) {

	    try {
	        ObjectMapper objectMapper = new ObjectMapper();
	        objectMapper.registerModule(new JavaTimeModule());
	        WorkshopSchedule workshopSchedule = objectMapper.readValue(workshopData, WorkshopSchedule.class);

	        String imagePath = "";
	        if (bannerImage != null && !bannerImage.isEmpty()) {
	            imagePath = saveImage(bannerImage);
	        }

	        workshopSchedule.setBanner_image(imagePath); // Always set image path (even if empty)

	        repo.save(workshopSchedule);

	        return ResponseEntity.status(HttpStatus.CREATED).body("Course added successfully.");
	    } catch (Exception e) {
	        e.printStackTrace();
	        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error adding course: " + e.getMessage());
	    }
	}


//@PutMapping("/workshopschedule/update/{id}")
//   public ResponseEntity<WorkshopSchedule> updateWorkshopSchedule(@PathVariable int id, @RequestBody WorkshopSchedule updatedWorkshopSchedule) {
//       return repo.findById(id).map(workshopSchedule -> {
//           workshopSchedule.setCategory_name(updatedWorkshopSchedule.getCategory_name());
//           workshopSchedule.setCourse_name(updatedWorkshopSchedule.getCourse_name());
//           workshopSchedule.setDate(updatedWorkshopSchedule.getDate());
//           workshopSchedule.setTime(updatedWorkshopSchedule.getTime());
//           workshopSchedule.setTime_zone(updatedWorkshopSchedule.getTime_zone());
//         workshopSchedule.setContent(updatedWorkshopSchedule.getContent());
//         workshopSchedule.setDetails(updatedWorkshopSchedule.getDetails());
//           repo.save(workshopSchedule);
//           return ResponseEntity.ok(workshopSchedule);
//       }).orElse(ResponseEntity.status(HttpStatus.NOT_FOUND).build());
//   }
	@PutMapping("/workshopschedule/update/{id}")
	public ResponseEntity<?> updateWorkshopSchedule(
	        @PathVariable int id,
	        @RequestPart("workshop") String workshopData,
	        @RequestPart(value = "bannerImage", required = false) MultipartFile bannerImage) {

	    try {
	        ObjectMapper objectMapper = new ObjectMapper();
	        objectMapper.registerModule(new JavaTimeModule());
	        WorkshopSchedule updatedData = objectMapper.readValue(workshopData, WorkshopSchedule.class);

	        return repo.findById(id).map(existing -> {
	            // Update only if non-null or non-empty
	            if (updatedData.getCategory_name() != null) existing.setCategory_name(updatedData.getCategory_name());
	            if (updatedData.getCourse_name() != null) existing.setCourse_name(updatedData.getCourse_name());
	            if (updatedData.getDate() != null) existing.setDate(updatedData.getDate());
	            if (updatedData.getTime() != null) existing.setTime(updatedData.getTime());
	            if (updatedData.getTime_zone() != null) existing.setTime_zone(updatedData.getTime_zone());
	            if (updatedData.getContent() != null) existing.setContent(updatedData.getContent());
	            if (updatedData.getDetails() != null) existing.setDetails(updatedData.getDetails());
	            if(updatedData.getMeta_description()!=null) existing.setMeta_description(updatedData.getMeta_description());
	            if(updatedData.getMeta_title()!=null) existing.setMeta_title(updatedData.getMeta_title());
	            if(updatedData.getMeta_keyword()!=null) existing.setMeta_keyword(updatedData.getMeta_keyword());

	            // Handle image update only if a new one is uploaded
	            if (bannerImage != null && !bannerImage.isEmpty()) {
	                try {
	                    String imagePath = saveImage(bannerImage);
	                    if (imagePath != null) {
	                        existing.setBanner_image(imagePath);
	                    }
	                } catch (IOException e) {
	                    e.printStackTrace();
	                    return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
	                            .body("Failed to save the new image: " + e.getMessage());
	                }
	            }

	            // Save updated entity
	            WorkshopSchedule saved = repo.save(existing);
	            return ResponseEntity.ok(saved);  // Return updated object

	        }).orElse(ResponseEntity.status(HttpStatus.NOT_FOUND).body("Workshop not found"));

	    } catch (Exception e) {
	        e.printStackTrace();
	        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error updating workshop: " + e.getMessage());
	    }
	}


   @DeleteMapping("/workshopschedule/delete/{id}") public ResponseEntity<?>
   deleteWorkshopSchedule(@PathVariable int id) { WorkshopSchedule workshopschedule=
   repo.findById(id).get(); repo.delete(workshopschedule); return null;
   
   }
}