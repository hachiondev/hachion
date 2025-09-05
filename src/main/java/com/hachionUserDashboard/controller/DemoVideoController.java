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

import com.hachionUserDashboard.entity.DemoVideo;
import com.hachionUserDashboard.repository.DemoVideoRepository;

 @CrossOrigin
@RestController
public class DemoVideoController {

    

    @Autowired
    private DemoVideoRepository repo;


    @GetMapping("/demovideo/{id}")
    public ResponseEntity<DemoVideo> getDemoVideo(@PathVariable Integer id) {
        return repo.findById(id)
                   .map(ResponseEntity::ok)
                   .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND).build());
    }

    @GetMapping("/demovideo")
    public List<DemoVideo> getAllDemoVideo() {
        return repo.findAll();
    }

    @PostMapping("/demovideo/add")
    @ResponseStatus(code = HttpStatus.CREATED)
    public void createDemoVideo(@RequestBody DemoVideo demovideo) {
        repo.save(demovideo);
    }

    @PutMapping("/demovideo/update/{id}")
    public ResponseEntity<DemoVideo> updateDemoVideo(@PathVariable int id, @RequestBody DemoVideo updatedDemoVideo) {
        return repo.findById(id).map(demovideo -> {
            demovideo.setCategory_name(updatedDemoVideo.getCategory_name());
            demovideo.setCourse_name(updatedDemoVideo.getCourse_name());
            demovideo.setVideo_link(updatedDemoVideo.getVideo_link());
            demovideo.setVideo_description(updatedDemoVideo.getVideo_description());
            demovideo.setVideo_duration(updatedDemoVideo.getVideo_duration());
            repo.save(demovideo);
            return ResponseEntity.ok(demovideo);
        }).orElse(ResponseEntity.status(HttpStatus.NOT_FOUND).build());
    }

    @DeleteMapping("demovideo/delete/{id}") public ResponseEntity<?>
    deleteDemoVideo(@PathVariable int id) { DemoVideo demovideo=
    repo.findById(id).get(); repo.delete(demovideo); return null;
    
    }
}