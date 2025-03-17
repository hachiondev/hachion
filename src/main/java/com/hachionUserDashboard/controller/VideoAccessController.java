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

import com.hachionUserDashboard.entity.VideoAccess;
import com.hachionUserDashboard.repository.VideoAccessRepository;


@CrossOrigin
//@CrossOrigin(origins ={"http://localhost:3000", "http://hachion.co"})
@RestController
public class VideoAccessController {

    

    @Autowired
    private VideoAccessRepository repo;


    @GetMapping("/videoaccess/{id}")
    public ResponseEntity<VideoAccess> getVideoAccess(@PathVariable Integer id) {
        return repo.findById(id)
                   .map(ResponseEntity::ok)
                   .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND).build());
    }

    @GetMapping("/videoaccess")
    public List<VideoAccess> getAllVideoAccess() {
        return repo.findAll();
    }

    @PostMapping("/videoaccess/add")
    @ResponseStatus(code = HttpStatus.CREATED)
    public void createVideoAccess(@RequestBody VideoAccess videoaccess) {
        repo.save(videoaccess);
    }

    @PutMapping("/videoaccess/update/{id}")
    public ResponseEntity<VideoAccess> updateVideoAccess(@PathVariable int id, @RequestBody VideoAccess updatedVideoAccess) {
        return repo.findById(id).map(videoaccess -> {
            videoaccess.setCategory_name(updatedVideoAccess.getCategory_name());
            videoaccess.setCourse_name(updatedVideoAccess.getCourse_name());
           videoaccess.setPermission(updatedVideoAccess.getPermission());
           videoaccess.setDescription(updatedVideoAccess.getDescription());
           videoaccess.setUser_email(updatedVideoAccess.getUser_email());
           videoaccess.setTrainer_name(updatedVideoAccess.getTrainer_name());
            repo.save(videoaccess);
            return ResponseEntity.ok(videoaccess);
        }).orElse(ResponseEntity.status(HttpStatus.NOT_FOUND).build());
    }

    @DeleteMapping("/videoaccess/delete/{id}") public ResponseEntity<?>
    deleteVideoAccess(@PathVariable int id) { VideoAccess videoaccess=
    repo.findById(id).get(); repo.delete(videoaccess); return null;
    
    }
}