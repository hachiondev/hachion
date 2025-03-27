package com.hachionUserDashboard.controller;

import java.io.File;
import java.io.IOException;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
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
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.hachionUserDashboard.entity.Certificate;
import com.hachionUserDashboard.repository.CertificateRepository;




@RequestMapping
@CrossOrigin
//@CrossOrigin(origins ="http://localhost:3000")

@RestController
public class CertificateController {

    
	@Value("${upload.path}") // Path for saving uploaded files
    private String uploadPath;
	
    @Autowired
    private CertificateRepository repo;

    @GetMapping("/certificate/{id}")
    public ResponseEntity<Certificate> getCertificate(@PathVariable Integer id) {
        return repo.findById(id)
                   .map(ResponseEntity::ok)
                   .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND).build());
    }

    @GetMapping("/certificate")
    public List<Certificate> getAllCertificate() {
        return repo.findAll();
    }

    @PostMapping("/certificate/add")
    @ResponseStatus(code = HttpStatus.CREATED)
    public ResponseEntity<String> createCertificate(
            @RequestParam("certificate_image") MultipartFile file,
            @RequestParam("course_name") String course_name,
            @RequestParam("category_name") String category_name,
            @RequestParam("title") String title,
            @RequestParam("description") String description) {

        // Debugging: Log the provided path
        System.out.println("Upload Path: " + uploadPath);

        // Generate file name
        String fileName = System.currentTimeMillis() + "_" + file.getOriginalFilename();
        File uploadDir = new File(uploadPath);

        try {
            // Create directory if not exists
            if (!uploadDir.exists()) {
                boolean created = uploadDir.mkdirs();
                System.out.println("Directory created: " + created);
            }

            // Save file
            File destinationFile = new File(uploadPath + "/" + fileName);
            file.transferTo(destinationFile);
            System.out.println("File saved to: " + destinationFile.getAbsolutePath());

            // Save banner details in database
           Certificate certificate = new Certificate();
            certificate.setCertificate_image("/uploads/" + fileName); // Set relative path
            certificate.setTitle(title);
            certificate.setCategory_name(category_name);
            certificate.setCourse_name(course_name);
            certificate.setDescription(description);
            repo.save(certificate);

            return ResponseEntity.status(HttpStatus.CREATED).body("Details addes successfully");
        } catch (IOException e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                                 .body("Error saving file: " + e.getMessage());
        }
    }



    @PutMapping("/certificate/update/{id}")
    public ResponseEntity<Certificate> updateCertificate(@PathVariable int id, @RequestBody Certificate updatedCertificate) {
        return repo.findById(id).map(certificate -> {
            certificate.setCertificate_image(updatedCertificate.getCertificate_image());
            certificate.setCourse_name(updatedCertificate.getCourse_name());
            certificate.setCategory_name(updatedCertificate.getCategory_name());
            certificate.setTitle(updatedCertificate.getTitle());
            certificate.setDescription(updatedCertificate.getDescription());
            repo.save(certificate);
            return ResponseEntity.ok(certificate);
        }).orElse(ResponseEntity.status(HttpStatus.NOT_FOUND).build());
    }

    @DeleteMapping("/certificate/delete/{id}")
    public ResponseEntity<?> deleteCertificate(@PathVariable int id) {
        return repo.findById(id).map(certificate -> {
            repo.delete(certificate);
            return ResponseEntity.ok("Certificate deleted successfully");
        }).orElse(ResponseEntity.status(HttpStatus.NOT_FOUND).build());
    }
}