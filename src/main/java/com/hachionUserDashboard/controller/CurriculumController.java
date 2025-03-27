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
//import com.hachionUserDashboard.entity.RegularVideo;
//import com.hachionUserDashboard.repository.CurriculumRepository;
//
//@CrossOrigin
////@CrossOrigin(origins ="http://localhost:3000")
//@RestController
//public class CurriculumController {
//
//    
//
//    @Autowired
//    private CurriculumRepository repo;
//
//    @GetMapping("/curriculum/{id}")
//    public ResponseEntity<Curriculum> getCurriculum(@PathVariable Integer id) {
//        return repo.findById(id)
//                   .map(ResponseEntity::ok)
//                   .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND).build());
//    }
//
//    @GetMapping("/curriculum")
//    public List<Curriculum> getAllCurriculum() {
//        return repo.findAll();
//    }
//
//   @PostMapping("/curriculum/upload")
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
//
//    @PostMapping("/curriculum/add")
//  public ResponseEntity<String> createCurriculum(
//          @RequestPart("category_name") String category_name,
//          @RequestPart("course_name") String course_name,
//          @RequestPart("title") String title,
//          @RequestPart("topic") String topic,
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
//          Curriculum curriculum = new Curriculum();
//          curriculum.setCategory_name(category_name);
//          curriculum.setCourse_name(course_name);
//          curriculum.setTitle(title);
//          curriculum.setTopic(topic);
//          curriculum.setDate(LocalDate.parse(date));
//          curriculum.setCurriculum_pdf(filePath);  // Set the relative file path if file exists
//
//          repo.save(curriculum);
//
//          return ResponseEntity.status(HttpStatus.CREATED).body("Curriculum added successfully");
//
//      } catch (IOException e) {
//          // Log the exception for debugging purposes
//          e.printStackTrace();
//          return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
//                  .body("Error adding curriculum: " + e.getMessage());
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
//    @GetMapping("/curriculum/pdf/{filename}")
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
//
//
//    @PutMapping("/curriculum/update/{id}")
//    public ResponseEntity<Curriculum> updateCurriculum(@PathVariable int id, @RequestBody Curriculum updatedCurriculum) {
//        return repo.findById(id).map(curriculum -> {
//            curriculum.setCategory_name(updatedCurriculum.getCategory_name());
//            curriculum.setCourse_name(updatedCurriculum.getCourse_name());
//            curriculum.setCurriculum_pdf(updatedCurriculum.getCurriculum_pdf());
//            curriculum.setTitle(updatedCurriculum.getTitle());
//            curriculum.setTopic(updatedCurriculum.getTopic());
//            repo.save(curriculum);
//            return ResponseEntity.ok(curriculum);
//        }).orElse(ResponseEntity.status(HttpStatus.NOT_FOUND).build());
//    }
//
//    @DeleteMapping("curriculum/delete/{id}") public ResponseEntity<?>
//    deleteCurriculum(@PathVariable int id) { Curriculum curriculum=
//    repo.findById(id).get(); repo.delete(curriculum); return null;
//    
//    }
//}
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
//import com.hachionUserDashboard.entity.RegularVideo;
//import com.hachionUserDashboard.repository.CurriculumRepository;
//
//@CrossOrigin
////@CrossOrigin(origins ="http://localhost:3000")
//@RestController
//public class CurriculumController {
//
//    
//
//    @Autowired
//    private CurriculumRepository repo;
//
//    @GetMapping("/curriculum/{id}")
//    public ResponseEntity<Curriculum> getCurriculum(@PathVariable Integer id) {
//        return repo.findById(id)
//                   .map(ResponseEntity::ok)
//                   .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND).build());
//    }
//
//    @GetMapping("/curriculum")
//    public List<Curriculum> getAllCurriculum() {
//        return repo.findAll();
//    }
//
////    @PostMapping("/curriculum/upload")
////    public ResponseEntity<String> uploadPdf(@RequestPart("file") MultipartFile file) {
////        try {
////            String uploadDir = "uploads/";
////            Path uploadPath = Paths.get(uploadDir);
////
////            // Create directory if it doesn't exist
////            if (!Files.exists(uploadPath)) {
////                Files.createDirectories(uploadPath);
////            }
////
////            // Save the file
////            String fileName = System.currentTimeMillis() + "_" + file.getOriginalFilename();
////            Path filePath = uploadPath.resolve(fileName);
////            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);
////
////            // Return the file path
////            return ResponseEntity.ok("/uploads/" + fileName);
////        } catch (IOException e) {
////            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error uploading file: " + e.getMessage());
////        }
////    }
//    
//    @PostMapping("/curriculum/upload")
//    public ResponseEntity<String> uploadPdf(@RequestPart("file") MultipartFile file) {
//        try {
//            // Define the folder structure: /uploads/pdf/
//            String uploadDir = "uploads/pdf/";
//            Path uploadPath = Paths.get(uploadDir);
//
//            // Create directories if they don't exist
//            if (!Files.exists(uploadPath)) {
//                Files.createDirectories(uploadPath);
//            }
//
//            // Generate a unique file name
//            String fileName = System.currentTimeMillis() + "_" + file.getOriginalFilename();
//            Path filePath = uploadPath.resolve(fileName);
//
//            // Save the file to the pdf folder
//            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);
//
//            // Return the file path
//            return ResponseEntity.ok("/uploads/pdf/" + fileName);
//        } catch (IOException e) {
//            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error uploading file: " + e.getMessage());
//        }
//    }
//
//    @PostMapping("/curriculum/add")
//    public ResponseEntity<String> createCurriculum(@RequestBody Curriculum curriculum) {
//        repo.save(curriculum);
//        return ResponseEntity.status(HttpStatus.CREATED).body("Curriculum added successfully");
//    }
//
//    @GetMapping("/curriculum/pdf/{filename}")
//    public ResponseEntity<Resource> getPdf(@PathVariable String filename) {
//        try {
//            Path filePath = Paths.get("uploads/pdf/").resolve(filename).normalize();
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
//    @PutMapping("/curriculum/update/{id}")
//    public ResponseEntity<Curriculum> updateCurriculum(@PathVariable int id, @RequestBody Curriculum updatedCurriculum) {
//        return repo.findById(id).map(curriculum -> {
//            curriculum.setCategory_name(updatedCurriculum.getCategory_name());
//            curriculum.setCourse_name(updatedCurriculum.getCourse_name());
//            curriculum.setCurriculum_pdf(updatedCurriculum.getCurriculum_pdf());
//            curriculum.setTitle(updatedCurriculum.getTitle());
//            curriculum.setTopic(updatedCurriculum.getTopic());
//            repo.save(curriculum);
//            return ResponseEntity.ok(curriculum);
//        }).orElse(ResponseEntity.status(HttpStatus.NOT_FOUND).build());
//    }
//
//    @DeleteMapping("curriculum/delete/{id}") public ResponseEntity<?>
//    deleteCurriculum(@PathVariable int id) { Curriculum curriculum=
//    repo.findById(id).get(); repo.delete(curriculum); return null;
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
import com.hachionUserDashboard.entity.RegularVideo;
import com.hachionUserDashboard.repository.CurriculumRepository;

@CrossOrigin
//@CrossOrigin(origins ="http://localhost:3000")
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

    private final String uploadDir = System.getProperty("user.home") + "/uploads/curriculum/";

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
    @PostMapping("curriculum/add")
    public ResponseEntity<String> addCurriculum(
            @RequestPart("curriculumData") String curriculumData,
            @RequestPart(value = "curriculumPdf", required = false) MultipartFile curriculumPdf) {
        try {
            ObjectMapper objectMapper = new ObjectMapper();
            objectMapper.registerModule(new JavaTimeModule());
            Curriculum curriculum = objectMapper.readValue(curriculumData, Curriculum.class);

            // Save PDF only if provided
            if (curriculumPdf != null && !curriculumPdf.isEmpty()) {
                String pdfPath = saveFile(curriculumPdf, "pdfs");
                curriculum.setCurriculum_pdf(pdfPath != null ? pdfPath : "");
            } else {
                curriculum.setCurriculum_pdf(""); // Store empty string if no PDF is provided
            }

            // Save curriculum to DB
            repo.save(curriculum);

            return ResponseEntity.status(HttpStatus.CREATED).body("Curriculum added successfully.");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error adding curriculum: " + e.getMessage());
        }
    }

    @PutMapping("/curriculum/update/{id}")
    public ResponseEntity<Curriculum> updateCurriculum(@PathVariable int id, @RequestBody Curriculum updatedCurriculum) {
        return repo.findById(id).map(curriculum -> {
            curriculum.setCategory_name(updatedCurriculum.getCategory_name());
            curriculum.setCourse_name(updatedCurriculum.getCourse_name());
            curriculum.setTitle(updatedCurriculum.getTitle());
            curriculum.setTopic(updatedCurriculum.getTopic());
          curriculum.setLink(updatedCurriculum.getLink());
            
            // Update PDF only if a new one is provided, otherwise keep the existing one
            curriculum.setCurriculum_pdf(updatedCurriculum.getCurriculum_pdf() != null ? updatedCurriculum.getCurriculum_pdf() : curriculum.getCurriculum_pdf());

            repo.save(curriculum);
            return ResponseEntity.ok(curriculum);
        }).orElse(ResponseEntity.status(HttpStatus.NOT_FOUND).build());
    }

    @DeleteMapping("curriculum/delete/{id}")
    public ResponseEntity<String> deleteCurriculum(@PathVariable int id) {
        return repo.findById(id).map(curriculum -> {
            repo.delete(curriculum);
            return ResponseEntity.ok("Curriculum deleted successfully.");
        }).orElse(ResponseEntity.status(HttpStatus.NOT_FOUND).body("Curriculum not found."));
    }

    @GetMapping("/curriculum/pdfs/{filename}")
    public ResponseEntity<Resource> getPdf(@PathVariable String filename) {
        try {
            // Define the path where PDFs are stored
            Path filePath = Paths.get(System.getProperty("user.home") + "/uploads/curriculum/pdfs/" + filename);

            if (!Files.exists(filePath)) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
            }

            // Load file as a resource
            Resource resource = new UrlResource(filePath.toUri());

            // Return the PDF as an attachment
            return ResponseEntity.ok()
                    .contentType(MediaType.APPLICATION_PDF)
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + filename + "\"")
                    .body(resource);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }


}