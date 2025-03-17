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

import com.hachionUserDashboard.entity.Review;
import com.hachionUserDashboard.repository.ReviewRepository;

@CrossOrigin
//@CrossOrigin(origins = {"http://localhost:3000", "http://hachion.co"}) 
@RestController
public class ReviewController {

   

   @Autowired
   private ReviewRepository repo;


   @GetMapping("/review/{id}")
   public ResponseEntity<Review> getVideoAccess(@PathVariable Integer id) {
       return repo.findById(id)
                  .map(ResponseEntity::ok)
                  .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND).build());
   }

   @GetMapping("/review")
   public List<Review> getAllReview() {
       return repo.findAll();
   }

   @PostMapping("/review/add")
   @ResponseStatus(code = HttpStatus.CREATED)
   public void createResume(@RequestBody Review review) {
       repo.save(review);
   }

   @PutMapping("/review/update/{id}")
   public ResponseEntity<Review> updateReview(@PathVariable int id, @RequestBody Review updatedReview) {
       return repo.findById(id).map(review -> {
           review.setCategory_name(updatedReview.getCategory_name());
           review.setCourse_name(updatedReview.getCourse_name());
          review.setImage(updatedReview.getImage());
         review.setStudent_name(updatedReview.getStudent_name());
         review.setSource(updatedReview.getSource());
         review.setComment(updatedReview.getComment());
      
           repo.save(review);
           return ResponseEntity.ok(review);
       }).orElse(ResponseEntity.status(HttpStatus.NOT_FOUND).build());
   }

   @DeleteMapping("/review/delete/{id}") public ResponseEntity<?>
   deleteReview(@PathVariable int id) { Review review=
   repo.findById(id).get(); repo.delete(review); return null;
   
   }
}