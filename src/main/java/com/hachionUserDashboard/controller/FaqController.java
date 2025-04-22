//package com.hachionUserDashboard.controller;
//
//import java.io.IOException;
//import java.nio.file.Files;
//import java.nio.file.Path;
//import java.nio.file.Paths;
//import java.nio.file.StandardCopyOption;
//import java.util.List;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.core.io.Resource;
//import org.springframework.core.io.UrlResource;
//import org.springframework.http.HttpStatus;
//import org.springframework.http.ResponseEntity;
//import org.springframework.web.bind.annotation.CrossOrigin;
//import org.springframework.web.bind.annotation.DeleteMapping;
//import org.springframework.web.bind.annotation.GetMapping;
//import org.springframework.web.bind.annotation.PathVariable;
//import org.springframework.web.bind.annotation.PostMapping;
//import org.springframework.web.bind.annotation.PutMapping;
//import org.springframework.web.bind.annotation.RequestBody;
//import org.springframework.web.bind.annotation.RequestMapping;
//import org.springframework.web.bind.annotation.RequestPart;
//import org.springframework.web.bind.annotation.ResponseStatus;
//import org.springframework.web.bind.annotation.RestController;
//import org.springframework.web.multipart.MultipartFile;
//
//import com.hachionUserDashboard.entity.Curriculum;
//import com.hachionUserDashboard.entity.Faq;
//import com.hachionUserDashboard.repository.FaqRepository;
//
//@RequestMapping
//@CrossOrigin
////@CrossOrigin(origins ="http://localhost:3000")
//@RestController
//public class FaqController {
//
//    @Autowired
//    private FaqRepository repo;
//
//    @GetMapping("/faq/{id}")
//    public ResponseEntity<Faq> getFaq(@PathVariable Integer id) {
//        return repo.findById(id)
//                   .map(ResponseEntity::ok)
//                   .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND).build());
//    }
//
//    @GetMapping("/faq")
//    public List<Faq> getAllFaq() {
//        return repo.findAll();
//    }
//    @PostMapping("/faq/upload")
//    public ResponseEntity<String> uploadPdf(@RequestPart("file") MultipartFile file) {
//        try {
//            String uploadDir = "/uploads/pdf/";
//            Path uploadPath = Paths.get(uploadDir);
//
//            // Create directory if it doesn't exist
//            if (!Files.exists(uploadPath)) {
//                Files.createDirectories(uploadPath);
//            }
//
//            // Save the file
//            String fileName = System.currentTimeMillis() + "_" + file.getOriginalFilename();
//            Path filePath = uploadPath.resolve(fileName);
//            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);
//
//            // Return the file path
//            return ResponseEntity.ok("/uploads/pdf/" + fileName);
//        } catch (IOException e) {
//            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error uploading file: " + e.getMessage());
//        }
//    }
////    @PostMapping("/faq/add")
////    public ResponseEntity<String> createFaq(@RequestBody Faq faq) {
////        repo.save(faq);
////        return ResponseEntity.status(HttpStatus.CREATED).body("Faq added successfully");
////    }
//    @PostMapping("/faq/add")
//    public ResponseEntity<String> createFaq(
//            @RequestPart("category_name") String category_name,
//            @RequestPart("course_name") String course_name,
//            @RequestPart("faq_title") String faq_title,
//            @RequestPart("description") String description,
//            @RequestPart("file") MultipartFile file) {
//        
//        try {
//            // Define the folder to save the uploaded file
//            String uploadDir = "uploads/pdf/";
//            Path uploadPath = Paths.get(uploadDir);
//
//            // Create directories if they don't exist
//            if (!Files.exists(uploadPath)) {
//                Files.createDirectories(uploadPath);
//            }
//
//            // Generate a unique filename
//            String fileName = System.currentTimeMillis() + "_" + file.getOriginalFilename();
//            Path filePath = uploadPath.resolve(fileName);
//
//            // Save the file to the server
//            file.transferTo(filePath.toFile());
//
//            // Save the curriculum details to the database (you can customize the object)
//            Faq faq = new Faq();
//            faq.setCategory_name(category_name);
//            faq.setCourse_name(course_name);
//            faq.setFaq_title(faq_title);
//            faq.setDescription(description);
//            faq.setFaq_pdf(filePath.toString());
//            
//
//            repo.save(faq);
//
//            return ResponseEntity.status(HttpStatus.CREATED).body("Faq added successfully");
//        } catch (IOException e) {
//            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
//                    .body("Error adding faq: " + e.getMessage());
//        }
//    }
//    @GetMapping("/faq/pdf/{filename}")
//    public ResponseEntity<Resource> getPdf(@PathVariable String filename) {
//        try {
//            Path filePath = Paths.get("/uploads/pdf/").resolve(filename).normalize();
//            Resource resource = new UrlResource(filePath.toUri());
//
//            if (resource.exists() || resource.isReadable()) {
//                return ResponseEntity.ok()
//                    .header("Content-Disposition", "attachment; filename=\"" + filename + "\"")
//                    .body(resource);
//            } else {
//                return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
//            }
//        } catch (Exception e) {
//            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
//        }
//    }
//
//
//    @PutMapping("/faq/update/{id}")
//    public ResponseEntity<Faq> updateFaq(@PathVariable int id, @RequestBody Faq updatedFaq) {
//        return repo.findById(id).map(faq -> {
//            faq.setCategory_name(updatedFaq.getCategory_name());
//            faq.setCourse_name(updatedFaq.getCourse_name());
//            faq.setFaq_pdf(updatedFaq.getFaq_pdf());
//            faq.setFaq_title(updatedFaq.getFaq_title());
//            faq.setDescription(updatedFaq.getDescription());
//            repo.save(faq);
//            return ResponseEntity.ok(faq);
//        }).orElse(ResponseEntity.status(HttpStatus.NOT_FOUND).build());
//    }
//
//    @DeleteMapping("faq/delete/{id}") 
//    public ResponseEntity<?> deleteFaq(@PathVariable int id) { 
//        Faq faq = repo.findById(id).get(); 
//        repo.delete(faq); 
//        return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
//    }
//}
//package com.hachionUserDashboard.controller;
//
//import java.io.IOException;
//import java.nio.file.Files;
//import java.nio.file.Path;
//import java.nio.file.Paths;
//import java.nio.file.StandardCopyOption;
//import java.time.LocalDate;
//import java.util.List;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.core.io.Resource;
//import org.springframework.core.io.UrlResource;
//import org.springframework.http.HttpStatus;
//import org.springframework.http.ResponseEntity;
//import org.springframework.web.bind.annotation.CrossOrigin;
//import org.springframework.web.bind.annotation.DeleteMapping;
//import org.springframework.web.bind.annotation.GetMapping;
//import org.springframework.web.bind.annotation.PathVariable;
//import org.springframework.web.bind.annotation.PostMapping;
//import org.springframework.web.bind.annotation.PutMapping;
//import org.springframework.web.bind.annotation.RequestBody;
//import org.springframework.web.bind.annotation.RequestMapping;
//import org.springframework.web.bind.annotation.RequestPart;
//import org.springframework.web.bind.annotation.ResponseStatus;
//import org.springframework.web.bind.annotation.RestController;
//import org.springframework.web.multipart.MultipartFile;
//
//import com.hachionUserDashboard.entity.Curriculum;
//import com.hachionUserDashboard.entity.Faq;
//import com.hachionUserDashboard.entity.RegularVideo;
//import com.hachionUserDashboard.repository.CurriculumRepository;
//import com.hachionUserDashboard.repository.FaqRepository;
//
//@CrossOrigin
////@CrossOrigin(origins ="http://localhost:3000")
//@RestController
//public class FaqController {
//
//    
//
//    @Autowired
//    private FaqRepository repo;
//
//    @GetMapping("/faq/{id}")
//    public ResponseEntity<Faq> getFaq(@PathVariable Integer id) {
//        return repo.findById(id)
//                   .map(ResponseEntity::ok)
//                   .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND).build());
//    }
//
//    @GetMapping("/faq")
//    public List<Faq> getAllFaq() {
//        return repo.findAll();
//    }
//
//   @PostMapping("/faq/upload")
//    public ResponseEntity<String> uploadPdf(@RequestPart("file") MultipartFile file) {
//       try {
//           String uploadDir = "uploads/";
//           Path uploadPath = Paths.get(uploadDir);
//
//           // Create directory if it doesn't exist
//           if (!Files.exists(uploadPath)) {
//               Files.createDirectories(uploadPath);
//           }
//
//           // Save the file
//           String fileName = System.currentTimeMillis() + "_" + file.getOriginalFilename();
//          Path filePath = uploadPath.resolve(fileName);
//           Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);
//
//            // Return the file path
//           return ResponseEntity.ok("/uploads/" + fileName);
//        } catch (IOException e) {
//           return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error uploading file: " + e.getMessage());
//       }
//    }
//    
////    @PostMapping("/curriculum/upload")
////    public ResponseEntity<String> uploadPdf(@RequestPart("file") MultipartFile file) {
////        try {
////            // Define the folder structure: /uploads/pdf/
////            String uploadDir = "uploads/pdf/";
////            Path uploadPath = Paths.get(uploadDir);
////
////            // Create directories if they don't exist
////            if (!Files.exists(uploadPath)) {
////                Files.createDirectories(uploadPath);
////            }
////
////            // Generate a unique file name
////            String fileName = System.currentTimeMillis() + "_" + file.getOriginalFilename();
////            Path filePath = uploadPath.resolve(fileName);
////
////            // Save the file to the pdf folder
////            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);
////
////            // Return the file path
////            return ResponseEntity.ok("/uploads/pdf/" + fileName);
////        } catch (IOException e) {
////            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error uploading file: " + e.getMessage());
////        }
////    }
//    @PostMapping("/faq/add")
//  public ResponseEntity<String> createFaq(
//          @RequestPart("category_name") String category_name,
//          @RequestPart("course_name") String course_name,
//          @RequestPart("faq_title") String faq_title,
//          @RequestPart("description") String description,
//          @RequestPart("date") String date,
//          @RequestPart(value = "file", required = false) MultipartFile file) {
//
//      String filePath = "";
//      try {
//          // Validate the file type (Only if the file is provided)
//          if (file != null && !file.getContentType().equals("application/pdf")) {
//              return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Only PDF files are allowed.");
//          }
//
//          if (file != null) {
//              // Define the folder to save the uploaded file
//              String uploadDir = "uploads/pdf/";
//              Path uploadPath = Paths.get(uploadDir);
//
//              // Create directories if they don't exist
//              if (!Files.exists(uploadPath)) {
//                  Files.createDirectories(uploadPath);
//              }
//
//              // Generate a unique filename
//              String fileName = System.currentTimeMillis() + "_" + file.getOriginalFilename();
//              Path filePath1 = uploadPath.resolve(fileName);
//
//              // Save the file to the server
//              file.transferTo(filePath1.toFile());
//
//              // Set the relative file path to store in the database
//              filePath = "/uploads/pdf/" + fileName;
//          }
//
//          // Save the curriculum details to the database
//          Faq faq = new Faq();
//          faq.setCategory_name(category_name);
//          faq.setCourse_name(course_name);
//          faq.setFaq_title(faq_title);
//          faq.setDescription(description);
//          faq.setDate(LocalDate.parse(date));
//          faq.setFaq_pdf(filePath);  // Set the relative file path if file exists
//
//          repo.save(faq);
//
//          return ResponseEntity.status(HttpStatus.CREATED).body("FAQ added successfully");
//
//      } catch (IOException e) {
//          // Log the exception for debugging purposes
//          e.printStackTrace();
//          return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
//                  .body("Error adding faq: " + e.getMessage());
//      } catch (Exception e) {
//          // Catch any unexpected exceptions and log them
//          e.printStackTrace();
//          return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
//                  .body("An unexpected error occurred: " + e.getMessage());
//      }
//  }
//
////    @PostMapping("/curriculum/add")
////    public ResponseEntity<String> createCurriculum(@RequestBody Curriculum curriculum) {
////        repo.save(curriculum);
////        return ResponseEntity.status(HttpStatus.CREATED).body("Curriculum added successfully");
////    }
//    @GetMapping("/faq/pdf/{filename}")
//    public ResponseEntity<Resource> getPdf(@PathVariable String filename) {
//        try {
//            Path filePath = Paths.get("uploads/").resolve(filename).normalize();
//            Resource resource = new UrlResource(filePath.toUri());
//
//            if (resource.exists() || resource.isReadable()) {
//                return ResponseEntity.ok()
//                    .header("Content-Disposition", "attachment; filename=\"" + filename + "\"")
//                    .body(resource);
//            } else {
//                return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
//            }
//        } catch (Exception e) {
//            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
//        }
//    }
////    @GetMapping("/curriculum/pdf/{filename}")
////    public ResponseEntity<Resource> getPdf(@PathVariable String filename) {
////        try {
////            Path filePath = Paths.get("uploads/pdf/").resolve(filename).normalize();
////            Resource resource = new UrlResource(filePath.toUri());
////
////            if (resource.exists() || resource.isReadable()) {
////                return ResponseEntity.ok()
////                    .header("Content-Disposition", "attachment; filename=\"" + filename + "\"")
////                    .body(resource);
////            } else {
////                return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
////            }
////        } catch (Exception e) {
////            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
////        }
////    }
//
//
//    @PutMapping("/faq/update/{id}")
//    public ResponseEntity<Faq> updateFaq(@PathVariable int id, @RequestBody Faq updatedFaq) {
//        return repo.findById(id).map(faq -> {
//            faq.setCategory_name(updatedFaq.getCategory_name());
//            faq.setCourse_name(updatedFaq.getCourse_name());
//            faq.setFaq_pdf(updatedFaq.getFaq_pdf());
//            faq.setFaq_title(updatedFaq.getFaq_title());
//            faq.setDescription(updatedFaq.getDescription());
//            repo.save(faq);
//            return ResponseEntity.ok(faq);
//        }).orElse(ResponseEntity.status(HttpStatus.NOT_FOUND).build());
//    }
//
//    @DeleteMapping("faq/delete/{id}") public ResponseEntity<?>
//    deleteFaq(@PathVariable int id) { Faq faq=
//    repo.findById(id).get(); repo.delete(faq); return null;
//    
//    }
//}
package com.hachionUserDashboard.controller;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.hachionUserDashboard.entity.Blogs;
import com.hachionUserDashboard.entity.Curriculum;
import com.hachionUserDashboard.entity.Faq;
import com.hachionUserDashboard.entity.RegularVideo;
import com.hachionUserDashboard.repository.CurriculumRepository;
import com.hachionUserDashboard.repository.FaqRepository;

@CrossOrigin
//@CrossOrigin(origins ="http://localhost:3000")
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

    private final String uploadDir = System.getProperty("user.home") + "/uploads/faq/";

    private String saveFile(MultipartFile file, String subFolder) throws IOException {
        if (file != null && !file.isEmpty()) {
            // Ensure the directory exists
            File directory = new File(uploadDir + subFolder);
            if (!directory.exists()) {
                directory.mkdirs();
            }

            // Save file
            Path filePath = Paths.get(directory.getAbsolutePath(), file.getOriginalFilename());
            Files.write(filePath, file.getBytes());
            return subFolder + "/" + file.getOriginalFilename();
        }
        return null;
    }
    @PostMapping("faq/add")
    public ResponseEntity<String> addFaq(
            @RequestPart("faqData") String faqData,
            @RequestPart(value = "faqPdf", required = false) MultipartFile faqPdf) {
        try {
            ObjectMapper objectMapper = new ObjectMapper();
            objectMapper.registerModule(new JavaTimeModule());
            Faq faq = objectMapper.readValue(faqData, Faq.class);

            // Save PDF only if provided
            if (faqPdf != null && !faqPdf.isEmpty()) {
                String pdfPath = saveFile(faqPdf, "pdfs");
                faq.setFaq_pdf(pdfPath != null ? pdfPath : "");
            } else {
                faq.setFaq_pdf(""); // Store empty string if no PDF is provided
            }

            // Save curriculum to DB
            repo.save(faq);

            return ResponseEntity.status(HttpStatus.CREATED).body("Faq added successfully.");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error adding faq: " + e.getMessage());
        }
    }

    @PutMapping(value = "/faq/update/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> updateFaq(
            @PathVariable int id,
            @RequestPart("faqData") String faqData,
            @RequestPart(value = "faqPdf", required = false) MultipartFile faqPdf) {
        try {
            Optional<Faq> optionalFaq = repo.findById(id);
            if (!optionalFaq.isPresent()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Faq not found");
            }

            Faq existing = optionalFaq.get();

            ObjectMapper objectMapper = new ObjectMapper();
            objectMapper.registerModule(new JavaTimeModule());
            Faq updatedData = objectMapper.readValue(faqData, Faq.class);

            // Update only non-null values
            if (updatedData.getCategory_name() != null) existing.setCategory_name(updatedData.getCategory_name());
            if (updatedData.getCourse_name() != null) existing.setCourse_name(updatedData.getCourse_name());
            if (updatedData.getFaq_title() != null) existing.setFaq_title(updatedData.getFaq_title());
            if (updatedData.getDescription() != null) existing.setDescription(updatedData.getDescription());
            

            // Optional: Handle new PDF file
            if (faqPdf != null && !faqPdf.isEmpty()) {
                String pdfPath = saveFile(faqPdf, "pdfs");
                if (pdfPath != null) {
                    existing.setFaq_pdf(pdfPath);
                }
            }

            Faq saved = repo.save(existing);
            return ResponseEntity.ok(saved);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error updating faq: " + e.getMessage());
        }
    }
    @DeleteMapping("faq/delete/{id}")
    public ResponseEntity<String> deleteFaq(@PathVariable int id) {
        return repo.findById(id).map(faq -> {
            repo.delete(faq);
            return ResponseEntity.ok("FAQ deleted successfully.");
        }).orElse(ResponseEntity.status(HttpStatus.NOT_FOUND).body("FAQ not found."));
    }

    @GetMapping("/faq/pdf/{filename}")
    public ResponseEntity<Resource> getPdf(@PathVariable String filename) {
        try {
            // Define the path where PDFs are stored
            Path filePath = Paths.get(System.getProperty("user.home") + "/uploads/faq/pdfs/" + filename);

            if (!Files.exists(filePath)) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
            }

            // Load file as a resource
            Resource resource = new UrlResource(filePath.toUri());

            // Return the PDF as an attachment
            return ResponseEntity.ok()
                    .contentType(MediaType.APPLICATION_PDF)
                    .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + filename + "\"")
                    .body(resource);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }


}