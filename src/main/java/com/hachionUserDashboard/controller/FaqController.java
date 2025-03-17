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

import com.hachionUserDashboard.entity.Faq;
import com.hachionUserDashboard.repository.FaqRepository;

@RequestMapping("/faq")
@CrossOrigin
//@CrossOrigin(origins = {"http://localhost:3000", "http://hachion.co"})
@RestController
public class FaqController {

    @Autowired
    private FaqRepository repo;

    @GetMapping("/faq/{id}")
    public ResponseEntity<Faq> getFaq(@PathVariable Integer id) {
        return repo.findById(id)
                   .map(ResponseEntity::ok)
                   .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND).build());
    }

    @GetMapping("/faq")
    public List<Faq> getAllFaq() {
        return repo.findAll();
    }

    @PostMapping("/faq/add")
    @ResponseStatus(code = HttpStatus.CREATED)
    public void createFaq(@RequestBody Faq faq) {
        repo.save(faq);
    }

    @PutMapping("/faq/update/{id}")
    public ResponseEntity<Faq> updateFaq(@PathVariable int id, @RequestBody Faq updatedFaq) {
        return repo.findById(id).map(faq -> {
            faq.setCategory_name(updatedFaq.getCategory_name());
            faq.setCourse_name(updatedFaq.getCourse_name());
            faq.setFaq_pdf(updatedFaq.getFaq_pdf());
            faq.setFaq_title(updatedFaq.getFaq_title());
            faq.setDescription(updatedFaq.getDescription());
            repo.save(faq);
            return ResponseEntity.ok(faq);
        }).orElse(ResponseEntity.status(HttpStatus.NOT_FOUND).build());
    }

    @DeleteMapping("faq/delete/{id}") 
    public ResponseEntity<?> deleteFaq(@PathVariable int id) { 
        Faq faq = repo.findById(id).get(); 
        repo.delete(faq); 
        return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
    }
}
