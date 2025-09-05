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

import com.hachionUserDashboard.entity.RegularVideo;
import com.hachionUserDashboard.repository.RegularVideoRepository;
@CrossOrigin
//@CrossOrigin(origins = {"http://localhost:3000", "http://hachion.co"}) 
@RestController
public class RegularVideoController {

    

    @Autowired
    private RegularVideoRepository repo;


    @GetMapping("/regularvideo/{id}")
    public ResponseEntity<RegularVideo> getRegularVideo(@PathVariable Integer id) {
        return repo.findById(id)
                   .map(ResponseEntity::ok)
                   .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND).build());
    }

    @GetMapping("/regularvideo")
    public List<RegularVideo> getAllRegularVideo() {
        return repo.findAll();
    }

    @PostMapping("/regularvideo/add")
    @ResponseStatus(code = HttpStatus.CREATED)
    public void createRegularVideo(@RequestBody RegularVideo regularvideo) {
        repo.save(regularvideo);
    }

    @PutMapping("/regularvideo/update/{id}")
    public ResponseEntity<RegularVideo> updateRegularVideo(@PathVariable int id, @RequestBody RegularVideo updatedRegularVideo) {
        return repo.findById(id).map(regularvideo -> {
            regularvideo.setCategory_name(updatedRegularVideo.getCategory_name());
            regularvideo.setCourse_name(updatedRegularVideo.getCourse_name());
            regularvideo.setVideo_link(updatedRegularVideo.getVideo_link());
            regularvideo.setVideo_description(updatedRegularVideo.getVideo_description());
            regularvideo.setVideo_duration(updatedRegularVideo.getVideo_duration());
            regularvideo.setDay(updatedRegularVideo.getDay());
            regularvideo.setWeek(updatedRegularVideo.getWeek());
            repo.save(regularvideo);
            return ResponseEntity.ok(regularvideo);
        }).orElse(ResponseEntity.status(HttpStatus.NOT_FOUND).build());
    }

    @DeleteMapping("regularvideo/delete/{id}") public ResponseEntity<?>
    deleteRegularVideo(@PathVariable int id) { RegularVideo regularvideo=
    repo.findById(id).get(); repo.delete(regularvideo); return null;
    
    }
}