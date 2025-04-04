package com.hachionUserDashboard.controller;

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
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

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

   @PostMapping("/workshopschedule/add")
   @ResponseStatus(code = HttpStatus.CREATED)
   public void createWorkshopSchedule(@RequestBody WorkshopSchedule workshopschedule) {
       repo.save(workshopschedule);
   }

   @PutMapping("/workshopschedule/update/{id}")
   public ResponseEntity<WorkshopSchedule> updateWorkshopSchedule(@PathVariable int id, @RequestBody WorkshopSchedule updatedWorkshopSchedule) {
       return repo.findById(id).map(workshopSchedule -> {
           workshopSchedule.setCategory_name(updatedWorkshopSchedule.getCategory_name());
           workshopSchedule.setCourse_name(updatedWorkshopSchedule.getCourse_name());
           workshopSchedule.setDate(updatedWorkshopSchedule.getDate());
           workshopSchedule.setTime(updatedWorkshopSchedule.getTime());
           workshopSchedule.setTime_zone(updatedWorkshopSchedule.getTime_zone());
      
           repo.save(workshopSchedule);
           return ResponseEntity.ok(workshopSchedule);
       }).orElse(ResponseEntity.status(HttpStatus.NOT_FOUND).build());
   }

   @DeleteMapping("/workshopschedule/delete/{id}") public ResponseEntity<?>
   deleteWorkshopSchedule(@PathVariable int id) { WorkshopSchedule workshopschedule=
   repo.findById(id).get(); repo.delete(workshopschedule); return null;
   
   }
}