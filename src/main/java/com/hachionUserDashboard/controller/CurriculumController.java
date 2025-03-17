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

import com.hachionUserDashboard.entity.Curriculum;
import com.hachionUserDashboard.entity.RegularVideo;
import com.hachionUserDashboard.repository.CurriculumRepository;

@CrossOrigin
//@CrossOrigin(origins = {"http://localhost:3000", "http://hachion.co"})
@RestController
public class CurriculumController {

    

    @Autowired
    private CurriculumRepository repo;

    @GetMapping("/curriculum/{id}")
    public ResponseEntity<Curriculum> getCurriculum(@PathVariable Integer id) {
        return repo.findById(id)
                   .map(ResponseEntity::ok)
                   .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND).build());
    }

    @GetMapping("/curriculum")
    public List<Curriculum> getAllCurriculum() {
        return repo.findAll();
    }

    @PostMapping("/curriculum/add")
    @ResponseStatus(code = HttpStatus.CREATED)
    public void createCurriculum(@RequestBody Curriculum curriculum) {
        repo.save(curriculum);
    }

    @PutMapping("/curriculum/update/{id}")
    public ResponseEntity<Curriculum> updateCurriculum(@PathVariable int id, @RequestBody Curriculum updatedCurriculum) {
        return repo.findById(id).map(curriculum -> {
            curriculum.setCategory_name(updatedCurriculum.getCategory_name());
            curriculum.setCourse_name(updatedCurriculum.getCourse_name());
            curriculum.setCurriculum_pdf(updatedCurriculum.getCurriculum_pdf());
            curriculum.setTitle(updatedCurriculum.getTitle());
            curriculum.setTopic(updatedCurriculum.getTopic());
            repo.save(curriculum);
            return ResponseEntity.ok(curriculum);
        }).orElse(ResponseEntity.status(HttpStatus.NOT_FOUND).build());
    }

    @DeleteMapping("curriculum/delete/{id}") public ResponseEntity<?>
    deleteCurriculum(@PathVariable int id) { Curriculum curriculum=
    repo.findById(id).get(); repo.delete(curriculum); return null;
    
    }
}