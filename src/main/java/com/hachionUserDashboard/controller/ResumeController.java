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
import com.hachionUserDashboard.repository.ResumeRepository;

@CrossOrigin
//@CrossOrigin(origins = {"http://localhost:3000", "http://hachion.co"}) 
@RestController
public class ResumeController {

   

   @Autowired
   private ResumeRepository repo;


   @GetMapping("/resume/{id}")
   public ResponseEntity<Resume> getVideoAccess(@PathVariable Integer id) {
       return repo.findById(id)
                  .map(ResponseEntity::ok)
                  .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND).build());
   }

   @GetMapping("/resume")
   public List<Resume> getAllResume() {
       return repo.findAll();
   }

   @PostMapping("/resume/add")
   @ResponseStatus(code = HttpStatus.CREATED)
   public void createResume(@RequestBody Resume resume) {
       repo.save(resume);
   }

   @PutMapping("/resume/update/{id}")
   public ResponseEntity<Resume> updateResume(@PathVariable int id, @RequestBody Resume updatedResume) {
       return repo.findById(id).map(resume -> {
           resume.setCategory_name(updatedResume.getCategory_name());
           resume.setCourse_name(updatedResume.getCourse_name());
          resume.setJunior_level(updatedResume.getJunior_level());
          resume.setMiddle_level(updatedResume.getMiddle_level());
          resume.setSenior_level(updatedResume.getSenior_level());
      
           repo.save(resume);
           return ResponseEntity.ok(resume);
       }).orElse(ResponseEntity.status(HttpStatus.NOT_FOUND).build());
   }

   @DeleteMapping("/resume/delete/{id}") public ResponseEntity<?>
   deleteResume(@PathVariable int id) { Resume resume=
   repo.findById(id).get(); repo.delete(resume); return null;
   
   }
}