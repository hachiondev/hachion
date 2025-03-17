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
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import com.hachionUserDashboard.entity.UserReview;

import com.hachionUserDashboard.repository.UserReviewRepository;

@RequestMapping
//@CrossOrigin(origins = {"http://localhost:3000", "http://hachion.co"})
@CrossOrigin
@RestController
public class UserReviewController {

    @Autowired
    private UserReviewRepository repo;

    @GetMapping("/userreview/{id}")
    public ResponseEntity<UserReview> getUserReview(@PathVariable Integer id) {
        return repo.findById(id)
                   .map(ResponseEntity::ok)
                   .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND).build());
    }

    @GetMapping("/userreview")
    public List<UserReview> getAllUserReview() {
        return repo.findAll();
    }

    @PostMapping("/userreview/add")
    @ResponseStatus(code = HttpStatus.CREATED)
    public void createUserReview(@RequestBody UserReview userReview) {
        repo.save(userReview);
    }

    @PutMapping("/userreview/update/{id}")
    public ResponseEntity<UserReview> updateUserReview(@PathVariable int id, @RequestBody UserReview updatedUserReview) {
        return repo.findById(id).map(userReview -> {
            userReview.setName(updatedUserReview.getName());
           userReview.setEmail(updatedUserReview.getEmail());
            userReview.setLocation(updatedUserReview.getLocation());
            userReview.setCourse_name(updatedUserReview.getCourse_name());
            userReview.setRating(updatedUserReview.getRating());
            userReview.setSocial_id(updatedUserReview.getSocial_id());
            userReview.setTrainer_name(updatedUserReview.getTrainer_name());
            userReview.setReview(updatedUserReview.getReview());
            userReview.setType(updatedUserReview.getType());
            repo.save(userReview);
            return ResponseEntity.ok(userReview);
        }).orElse(ResponseEntity.status(HttpStatus.NOT_FOUND).build());
    }

    @DeleteMapping("userreview/delete/{id}") public ResponseEntity<?>
    deleteUserReview(@PathVariable int id) { UserReview userReview=
    repo.findById(id).get(); repo.delete(userReview); return null;
    
    }
}
