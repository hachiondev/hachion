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
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
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
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.hachionUserDashboard.entity.Curriculum;
import com.hachionUserDashboard.repository.CurriculumRepository;

import jakarta.annotation.PostConstruct;

@CrossOrigin
@RestController
public class CurriculumController {

	@Autowired
	private CurriculumRepository repo;

	@Value("${file.upload-dir}")
	private String upload;

	private String uploadDir;

	@PostConstruct
	public void initUploadDir() {
		this.uploadDir = upload + "curriculum/";
	}

	@GetMapping("/curriculum/{id}")
	public ResponseEntity<Curriculum> getCurriculum(@PathVariable Integer id) {
		return repo.findById(id).map(ResponseEntity::ok).orElse(ResponseEntity.status(HttpStatus.NOT_FOUND).build());
	}

	@GetMapping("/curriculum")
	public List<Curriculum> getAllCurriculum() {
		return repo.findAll();
	}

//	private final String uploadDir = upload + "curriculum/";

//	private final String uploadDir = System.getProperty("user.home") + "/uploads/curriculum/";

	private String saveFile(MultipartFile file, String subFolder) throws IOException {
		if (file != null && !file.isEmpty()) {

			File directory = new File(uploadDir + subFolder);
			if (!directory.exists()) {
				directory.mkdirs();
			}

			Path filePath = Paths.get(directory.getAbsolutePath(), file.getOriginalFilename());
			Files.write(filePath, file.getBytes());
			return subFolder + "/" + file.getOriginalFilename();
		}
		return null;
	}

	@PostMapping("curriculum/add")
	public ResponseEntity<?> addCurriculum(@RequestPart("curriculumData") String curriculumData,
			@RequestPart(value = "curriculumPdf", required = false) MultipartFile curriculumPdf) {
		try {
			ObjectMapper objectMapper = new ObjectMapper();
			objectMapper.registerModule(new JavaTimeModule());
			Curriculum curriculum = objectMapper.readValue(curriculumData, Curriculum.class);

			if (curriculumPdf != null && !curriculumPdf.isEmpty()) {
				String originalFileName = curriculumPdf.getOriginalFilename();

				if (!originalFileName.matches("[a-zA-Z0-9_&\\-\\s/\\.]*")) {
					return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(
							"Invalid file name. Only letters, numbers, hyphens (-), underscores (_), ampersands (&), slashes (/), dots (.), and spaces are allowed.");
				}

				String pdfFileName = "pdfs/" + originalFileName;

				Optional<Curriculum> existingCurriculum = repo.findPdfByExactName(pdfFileName);
				if (existingCurriculum.isPresent()) {
					System.out.println("PDF already exists in the database: " + pdfFileName);
					return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("This PDF already exists.");
				}

				String pdfPath = saveFile(curriculumPdf, "pdfs");
				curriculum.setCurriculum_pdf(pdfPath != null ? pdfPath : "");
			} else {
				curriculum.setCurriculum_pdf("");
			}

			Curriculum saved = repo.save(curriculum);
			return ResponseEntity.status(HttpStatus.CREATED).body(saved);

		} catch (Exception e) {
			e.printStackTrace();
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
					.body("Error adding curriculum: " + e.getMessage());
		}
	}

	@PutMapping(value = "/curriculum/update/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
	public ResponseEntity<?> updateCurriculum(@PathVariable int id,
			@RequestPart("curriculumData") String curriculumData,
			@RequestPart(value = "curriculumPdf", required = false) MultipartFile curriculumPdf) {
		try {
			Optional<Curriculum> optionalCurriculum = repo.findById(id);
			if (!optionalCurriculum.isPresent()) {
				return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Curriculum not found");
			}

			Curriculum existing = optionalCurriculum.get();

			ObjectMapper objectMapper = new ObjectMapper();
			objectMapper.registerModule(new JavaTimeModule());
			Curriculum updatedData = objectMapper.readValue(curriculumData, Curriculum.class);

			if (updatedData.getCategory_name() != null)
				existing.setCategory_name(updatedData.getCategory_name());
			if (updatedData.getCourse_name() != null)
				existing.setCourse_name(updatedData.getCourse_name());
			if (updatedData.getTitle() != null)
				existing.setTitle(updatedData.getTitle());
			if (updatedData.getTopic() != null)
				existing.setTopic(updatedData.getTopic());
			if (updatedData.getLink() != null)
				existing.setLink(updatedData.getLink());

			if (curriculumPdf != null && !curriculumPdf.isEmpty()) {
				String originalFileName = curriculumPdf.getOriginalFilename();

				if (!originalFileName.matches("[a-zA-Z0-9_&\\-\\s/\\.]*")) {
					return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(
							"Invalid file name. Only letters, numbers, hyphens (-), underscores (_), ampersands (&), slashes (/), dots (.), and spaces are allowed.");
				}

				String newPdfFileName = "pdfs/" + originalFileName;

				Optional<Curriculum> existingCurriculum = repo.findPdfByExactName(newPdfFileName);
				if (existingCurriculum.isPresent() && existingCurriculum.get().getCurriculum_id() != id) {
					return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("This PDF already exists.");
				}

				String oldPdfPath = existing.getCurriculum_pdf();
				if (oldPdfPath != null && !oldPdfPath.isEmpty()) {
					File oldFile = new File(uploadDir + oldPdfPath);
					if (oldFile.exists()) {
						System.out.println("Old file path: " + oldFile);
						oldFile.delete();
					}
				}

				String pdfPath = saveFile(curriculumPdf, "pdfs");

				if (pdfPath != null) {
					System.out.println("New file saved at: " + uploadDir + pdfPath);
					existing.setCurriculum_pdf(pdfPath);
				}
			}

			Curriculum saved = repo.save(existing);
			return ResponseEntity.ok(saved);

		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
					.body("Error updating curriculum: " + e.getMessage());
		}
	}

//	@PutMapping(value = "/curriculum/update/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
//	public ResponseEntity<?> updateCurriculum(@PathVariable int id,
//	        @RequestPart("curriculumData") String curriculumData,
//	        @RequestPart(value = "curriculumPdf", required = false) MultipartFile curriculumPdf) {
//	    try {
//	        Optional<Curriculum> optionalCurriculum = repo.findById(id);
//	        if (!optionalCurriculum.isPresent()) {
//	            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Curriculum not found");
//	        }
//
//	        Curriculum existing = optionalCurriculum.get();
//
//	        ObjectMapper objectMapper = new ObjectMapper();
//	        objectMapper.registerModule(new JavaTimeModule());
//	        Curriculum updatedData = objectMapper.readValue(curriculumData, Curriculum.class);
//
//	        // Update only non-null values
//	        if (updatedData.getCategory_name() != null)
//	            existing.setCategory_name(updatedData.getCategory_name());
//	        if (updatedData.getCourse_name() != null)
//	            existing.setCourse_name(updatedData.getCourse_name());
//	        if (updatedData.getTitle() != null)
//	            existing.setTitle(updatedData.getTitle());
//	        if (updatedData.getTopic() != null)
//	            existing.setTopic(updatedData.getTopic());
//	        if (updatedData.getLink() != null)
//	            existing.setLink(updatedData.getLink());
//
//	        // Handle PDF file replacement
//	        if (curriculumPdf != null && !curriculumPdf.isEmpty()) {
//	            // Delete old PDF file if it exists
//	            String oldPdfPath = existing.getCurriculum_pdf();
//	            if (oldPdfPath != null && !oldPdfPath.isEmpty()) {
//	            	File oldFile = new File(uploadDir  + oldPdfPath);
//	                System.out.println("UPLOAD DIR: " + uploadDir + "oldpath " +oldPdfPath);
//	                if (oldFile.exists()) {
//	                    boolean deleted = oldFile.delete();
//	                    System.out.println("Old file deleted: " + deleted + " | Path: " + oldFile.getAbsolutePath());
//	                } else {
//	                    System.out.println("Old file not found: " + oldFile.getAbsolutePath());
//	                }
//	            }
//
//	            // Save new PDF
//	            String pdfPath = saveFile(curriculumPdf, "pdfs");
//	            if (pdfPath != null) {
//	                existing.setCurriculum_pdf(pdfPath);
//	                System.out.println("New file saved at: " + uploadDir + pdfPath);
//	            }
//	        }
//
//	        Curriculum saved = repo.save(existing);
//	        return ResponseEntity.ok(saved);
//
//	    } catch (Exception e) {
//	        e.printStackTrace();
//	        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
//	                .body("Error updating curriculum: " + e.getMessage());
//	    }
//	}

//    @PostMapping("curriculum/add")
//    public ResponseEntity<String> addCurriculum(
//            @RequestPart("curriculumData") String curriculumData,
//            @RequestPart(value = "curriculumPdf", required = false) MultipartFile curriculumPdf) {
//        try {
//            ObjectMapper objectMapper = new ObjectMapper();
//            objectMapper.registerModule(new JavaTimeModule());
//            Curriculum curriculum = objectMapper.readValue(curriculumData, Curriculum.class);
//
//            // Save PDF only if provided
//            if (curriculumPdf != null && !curriculumPdf.isEmpty()) {
//                String pdfPath = saveFile(curriculumPdf, "pdfs");
//                curriculum.setCurriculum_pdf(pdfPath != null ? pdfPath : "");
//            } else {
//                curriculum.setCurriculum_pdf(""); // Store empty string if no PDF is provided
//            }
//
//            // Save curriculum to DB
//            repo.save(curriculum);
//
//            return ResponseEntity.status(HttpStatus.CREATED).body("Curriculum added successfully.");
//        } catch (Exception e) {
//            e.printStackTrace();
//            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error adding curriculum: " + e.getMessage());
//        }
//    }

//    @PutMapping("/curriculum/update/{id}")
//    public ResponseEntity<Curriculum> updateCurriculum(@PathVariable int id, @RequestBody Curriculum updatedCurriculum) {
//        return repo.findById(id).map(curriculum -> {
//            curriculum.setCategory_name(updatedCurriculum.getCategory_name());
//            curriculum.setCourse_name(updatedCurriculum.getCourse_name());
//            curriculum.setTitle(updatedCurriculum.getTitle());
//            curriculum.setTopic(updatedCurriculum.getTopic());
//          curriculum.setLink(updatedCurriculum.getLink());
//            
//            // Update PDF only if a new one is provided, otherwise keep the existing one
//            curriculum.setCurriculum_pdf(updatedCurriculum.getCurriculum_pdf() != null ? updatedCurriculum.getCurriculum_pdf() : curriculum.getCurriculum_pdf());
//
//            repo.save(curriculum);
//            return ResponseEntity.ok(curriculum);
//        }).orElse(ResponseEntity.status(HttpStatus.NOT_FOUND).build());
//    }
//	@PutMapping(value = "/curriculum/update/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
//	public ResponseEntity<?> updateCurriculum(@PathVariable int id,
//			@RequestPart("curriculumData") String curriculumData,
//			@RequestPart(value = "curriculumPdf", required = false) MultipartFile curriculumPdf) {
//		try {
//			Optional<Curriculum> optionalCurriculum = repo.findById(id);
//			if (!optionalCurriculum.isPresent()) {
//				return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Curriculum not found");
//			}
//
//			Curriculum existing = optionalCurriculum.get();
//
//			ObjectMapper objectMapper = new ObjectMapper();
//			objectMapper.registerModule(new JavaTimeModule());
//			Curriculum updatedData = objectMapper.readValue(curriculumData, Curriculum.class);
//
//			// Update only non-null values
//			if (updatedData.getCategory_name() != null)
//				existing.setCategory_name(updatedData.getCategory_name());
//			if (updatedData.getCourse_name() != null)
//				existing.setCourse_name(updatedData.getCourse_name());
//			if (updatedData.getTitle() != null)
//				existing.setTitle(updatedData.getTitle());
//			if (updatedData.getTopic() != null)
//				existing.setTopic(updatedData.getTopic());
//			if (updatedData.getLink() != null)
//				existing.setLink(updatedData.getLink());
//
//			// Optional: Handle new PDF file
//			if (curriculumPdf != null && !curriculumPdf.isEmpty()) {
//				String pdfPath = saveFile(curriculumPdf, "pdfs");
//				if (pdfPath != null) {
//					existing.setCurriculum_pdf(pdfPath);
//				}
//			}
//
//			Curriculum saved = repo.save(existing);
//			return ResponseEntity.ok(saved);
//
//		} catch (Exception e) {
//			e.printStackTrace();
//			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
//					.body("Error updating curriculum: " + e.getMessage());
//		}
//	}

//	@DeleteMapping("curriculum/delete/{id}")
//	public ResponseEntity<String> deleteCurriculum(@PathVariable int id) {
//		return repo.findById(id).map(curriculum -> {
//			repo.delete(curriculum);
//			return ResponseEntity.ok("Curriculum deleted successfully.");
//		}).orElse(ResponseEntity.status(HttpStatus.NOT_FOUND).body("Curriculum not found."));
//	}

	@DeleteMapping("curriculum/delete/{id}")
	public ResponseEntity<String> deleteCurriculum(@PathVariable int id) {
		Optional<Curriculum> optionalCurriculum = repo.findById(id);
		if (!optionalCurriculum.isPresent()) {
			return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Curriculum not found");
		}

		Curriculum curriculum = optionalCurriculum.get();

		String pdfPath = curriculum.getCurriculum_pdf();
		if (pdfPath != null && !pdfPath.isEmpty()) {
			File file = new File(uploadDir + pdfPath);
			if (file.exists()) {
				boolean deleted = file.delete();
				if (!deleted) {
					return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to delete PDF file.");
				}
			}
		}

		repo.delete(curriculum);
		return ResponseEntity.ok("Curriculum deleted successfully.");
	}

	@GetMapping("/curriculum/pdfs/{filename}")
	public ResponseEntity<Resource> getPdf(@PathVariable String filename) {
		try {

			Path filePath = Paths.get(uploadDir + "pdfs/" + filename);
//			Path filePath = Paths.get(System.getProperty("user.home") + "/uploads/curriculum/pdfs/" + filename);

			if (!Files.exists(filePath)) {
				return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
			}

			Resource resource = new UrlResource(filePath.toUri());

			return ResponseEntity.ok().contentType(MediaType.APPLICATION_PDF)
					.header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + filename + "\"").body(resource);
		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
		}
	}

}