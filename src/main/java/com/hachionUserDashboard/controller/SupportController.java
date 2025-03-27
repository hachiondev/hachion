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

import com.hachionUserDashboard.entity.Support;
import com.hachionUserDashboard.repository.SupportRepository;

@CrossOrigin
@RequestMapping
//@CrossOrigin(origins = {"http://localhost:3000", "http://hachion.co"})
@RestController
public class SupportController {

    

    @Autowired
    private SupportRepository repo;

    @GetMapping("/support/{id}")
    public ResponseEntity<Support> getSupport(@PathVariable Integer id) {
        return repo.findById(id)
                   .map(ResponseEntity::ok)
                   .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND).build());
    }

    @GetMapping("/support")
    public List<Support> getAllSupport() {
        return repo.findAll();
    }

    @PostMapping("/support/add")
    @ResponseStatus(code = HttpStatus.CREATED)
    public void createSupport(@RequestBody Support support) {
        repo.save(support);
    }

    @PutMapping("/support/update/{id}")
    public ResponseEntity<Support> updateSupport(@PathVariable int id, @RequestBody Support updatedSupport) {
        return repo.findById(id).map(support -> {
            support.setName(updatedSupport.getName());
            support.setEmail(updatedSupport.getEmail());
            support.setMobile(updatedSupport.getMobile());
            support.setAddress(updatedSupport.getAddress());
            support.setPassword(updatedSupport.getPassword());
            repo.save(support);
            return ResponseEntity.ok(support);
        }).orElse(ResponseEntity.status(HttpStatus.NOT_FOUND).build());
    }

    @DeleteMapping("support/delete/{id}") public ResponseEntity<?>
    deleteSupport(@PathVariable int id) { Support support=
    repo.findById(id).get(); repo.delete(support); return null;
    
    }
}