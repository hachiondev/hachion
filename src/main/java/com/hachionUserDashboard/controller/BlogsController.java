//package com.hachionUserDashboard.controller;
//
//import java.io.IOException;
//import java.nio.file.Files;
//import java.nio.file.Path;
//import java.nio.file.Paths;
//import java.time.LocalDate;
//import java.util.List;
//import org.springframework.beans.factory.annotation.Autowired;
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
//import org.springframework.web.bind.annotation.RequestParam;
//import org.springframework.web.bind.annotation.ResponseStatus;
//import org.springframework.web.bind.annotation.RestController;
//import org.springframework.web.multipart.MultipartFile;
//
//import com.hachionUserDashboard.entity.Blogs;
//import com.hachionUserDashboard.repository.BlogRepository;
//
//
//@RequestMapping()
//@CrossOrigin
////@CrossOrigin(origins ="http://localhost:3000")
//@RestController
//public class BlogsController {
//
//    
//
//    @Autowired
//    private BlogRepository repo;
//
//    @GetMapping("/blog/{id}")
//    public ResponseEntity<Blogs> getBlog(@PathVariable Integer id) {
//        return repo.findById(id)
//                   .map(ResponseEntity::ok)
//                   .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND).build());
//    }
//
//    @GetMapping("/blog")
//    public List<Blogs> getAllBlogs() {
//        return repo.findAll();
//    }
//
//    @PostMapping("/blog/add")
//    @ResponseStatus(code = HttpStatus.CREATED)
//    public ResponseEntity<String> createBlog(
//        @RequestParam("category_name") String categoryName,
//        @RequestParam("title") String title,
//        @RequestParam("author") String author,
//        @RequestParam("description") String description,
//        @RequestParam("date") String date, // LocalDate in "yyyy-MM-dd" format
//        @RequestParam("blog_image") MultipartFile image,
//        @RequestParam("blog_pdf") MultipartFile pdf
//    ) {
//    	try {
//    	    // Define directories for saving files
//    	    String uploadDir = "uploads/";
////    	    Path imagePath = Paths.get(uploadDir + "images/");
////    	    Path pdfPath = Paths.get(uploadDir + "pdfs/");
//    	    Path imagePath = Paths.get(uploadDir, "images", image.getOriginalFilename());
//    	    Path pdfPath = Paths.get(uploadDir, "pdf", pdf.getOriginalFilename());
//
//    	    // Create directories if they don't exist
//    	    Files.createDirectories(imagePath.getParent());
//    	    Files.createDirectories(pdfPath.getParent());
//
//    	    
//    	    // Save image file
//    	    String imageFileName = "images/" + image.getOriginalFilename();  // Only keep relative path
//    	    Files.write(Paths.get(uploadDir + imageFileName), image.getBytes());
//
//    	    // Save PDF file
//    	    String pdfFileName = "pdf/" + pdf.getOriginalFilename();  // Only keep relative path
//    	    Files.write(Paths.get(uploadDir + pdfFileName), pdf.getBytes());
//    	    
//            // Create and save blog entity
//            Blogs blog = new Blogs();
//            blog.setCategory_name(categoryName);
//            blog.setTitle(title);
//            blog.setAuthor(author);
//            blog.setDescription(description);
//            blog.setDate(LocalDate.parse(date));
//            blog.setBlog_image(imageFileName);
//            blog.setBlog_pdf(pdfFileName);
//
//            repo.save(blog);
//            return ResponseEntity.status(HttpStatus.CREATED).body("Blog added successfully!");
//
//        } catch (IOException e) {
//            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error saving files: " + e.getMessage());
//        }
//    }
//    @PutMapping("/blog/update/{id}")
//    public ResponseEntity<Blogs> updateBlogs(@PathVariable int id, 
//                                              @RequestParam("category_name") String categoryName,
//                                              @RequestParam("title") String title,
//                                              @RequestParam("author") String author,
//                                              @RequestParam("description") String description,
//                                              @RequestParam("date") String date, // LocalDate in "yyyy-MM-dd" format
//                                              @RequestParam(value = "blog_image", required = false) MultipartFile image, 
//                                              @RequestParam(value = "blog_pdf", required = false) MultipartFile pdf) {
//        
//            return repo.findById(id).map(blog -> {
//                // Set other fields
//                blog.setCategory_name(categoryName);
//                blog.setTitle(title);
//                blog.setAuthor(author);
//                blog.setDescription(description);
//                blog.setDate(LocalDate.parse(date));
//
//                // Handle the image update (if a new image is provided)
//                if (image != null && !image.isEmpty()) {
//                    // Delete old image (optional)
//                    String oldImagePath = blog.getBlog_image();
//                    if (oldImagePath != null) {
//                        Path oldImage = Paths.get("uploads/" + oldImagePath);
//                        try {
//							Files.deleteIfExists(oldImage);
//						} catch (IOException e) {
//							// TODO Auto-generated catch block
//							e.printStackTrace();
//						} // Delete the old image
//                    }
//
//                    // Save new image
//                    String imageFileName = "images/" + image.getOriginalFilename();
//                    Path imagePath = Paths.get("uploads/" + imageFileName);
//                    try {
//						Files.createDirectories(imagePath.getParent());
//					} catch (IOException e) {
//						// TODO Auto-generated catch block
//						e.printStackTrace();
//					}
//                    try {
//						Files.write(imagePath, image.getBytes());
//					} catch (IOException e) {
//						// TODO Auto-generated catch block
//						e.printStackTrace();
//					}
//
//                    blog.setBlog_image(imageFileName); // Set the new image path
//                }
//
//                // Handle the PDF update (if a new PDF is provided)
//                if (pdf != null && !pdf.isEmpty()) {
//                    String pdfFileName = "pdf/" + pdf.getOriginalFilename();
//                    Path pdfPath = Paths.get("uploads/" + pdfFileName);
//                    try {
//						Files.createDirectories(pdfPath.getParent());
//					} catch (IOException e) {
//						// TODO Auto-generated catch block
//						e.printStackTrace();
//					}
//                    try {
//						Files.write(pdfPath, pdf.getBytes());
//					} catch (IOException e) {
//						// TODO Auto-generated catch block
//						e.printStackTrace();
//					}
//
//                    blog.setBlog_pdf(pdfFileName); // Set the new PDF path
//                }
//
//                // Save updated blog
//                repo.save(blog);
//                return ResponseEntity.ok(blog);
//            }).orElse(ResponseEntity.status(HttpStatus.NOT_FOUND).build());
//
//        
//    }
//
//    @DeleteMapping("blog/delete/{id}") public ResponseEntity<?>
//    deleteBlog(@PathVariable int id) { Blogs blog=
//    repo.findById(id).get(); repo.delete(blog); return null;
//    
//    }
//}
package com.hachionUserDashboard.controller;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDate;
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
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.hachionUserDashboard.entity.Blogs;
import com.hachionUserDashboard.repository.BlogRepository;

import jakarta.annotation.PostConstruct;

@RequestMapping()
@CrossOrigin
//@CrossOrigin(origins ="http://localhost:3000")
@RestController
public class BlogsController {

	@Autowired
	private BlogRepository repo;

	@Value("${file.upload-dir}")
	private String upload;

	private String uploadDir;

	@PostConstruct
	public void initUploadDir() {
		this.uploadDir = upload + "blogs/";
	}

	@GetMapping("/blog/{id}")
	public ResponseEntity<Blogs> getBlog(@PathVariable Integer id) {
		return repo.findById(id).map(ResponseEntity::ok).orElse(ResponseEntity.status(HttpStatus.NOT_FOUND).build());
	}

	@GetMapping("/blog")
	public List<Blogs> getAllBlogs() {
		return repo.findAll();
	}

//	private final String uploadDir = System.getProperty("user.home") + "/uploads/blogs/";

	private String saveFile(MultipartFile file, String subFolder) throws IOException {
		if (file != null && !file.isEmpty()) {

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

	@PostMapping("blog/add")
	public ResponseEntity<?> addBlog(@RequestPart("blogData") String blogData,
			@RequestPart(value = "blogImage", required = false) MultipartFile blogImage,
			@RequestPart(value = "blogPdf", required = false) MultipartFile blogPdf) {
		try {
			ObjectMapper objectMapper = new ObjectMapper();
			objectMapper.registerModule(new JavaTimeModule());
			Blogs blog = objectMapper.readValue(blogData, Blogs.class);

			if (blogImage != null && !blogImage.isEmpty()) {
				String imagePath = saveFile(blogImage, "images");
				if (imagePath != null) {
					blog.setBlog_image(imagePath);
				} else {
					return ResponseEntity.badRequest().body("Failed to save image.");
				}
			} else {
				blog.setBlog_image("");
			}

			if (blogPdf != null && !blogPdf.isEmpty()) {
				String originalFileName = blogPdf.getOriginalFilename();
				if (!originalFileName.matches("[a-zA-Z0-9_&\\-\\s/\\.]*")) {
					return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(
							"Invalid file name. Only letters, numbers, hyphens (-), underscores (_), ampersands (&), slashes (/), dots (.), and spaces are allowed.");
				}

				String pdfPath = "pdfs/" + originalFileName;
				Optional<Blogs> existingPdf = repo.findByExactPdfName(pdfPath);
				if (existingPdf.isPresent()) {
					return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("This PDF already exists.");
				}

				String savedPdfPath = saveFile(blogPdf, "pdfs");
				if (savedPdfPath != null) {
					blog.setBlog_pdf(savedPdfPath);
				} else {
					return ResponseEntity.badRequest().body("Failed to save PDF.");
				}
			} else {
				blog.setBlog_pdf("");
			}

			Blogs save = repo.save(blog);
			return ResponseEntity.status(HttpStatus.CREATED).body(save);
		} catch (Exception e) {
			e.printStackTrace();
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error adding blog: " + e.getMessage());
		}
	}

	@PutMapping("/blog/update/{id}")
	public ResponseEntity<?> updateBlogs(@PathVariable int id, @RequestPart("blogData") String blogData,
			@RequestPart(value = "blogImage", required = false) MultipartFile blogImage,
			@RequestPart(value = "blogPdf", required = false) MultipartFile blogPdf) {

		return repo.findById(id).map(blog -> {
			try {

				ObjectMapper objectMapper = new ObjectMapper();
				objectMapper.registerModule(new JavaTimeModule());
				objectMapper.disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);

				Blogs updatedBlog = objectMapper.readValue(blogData, Blogs.class);

				blog.setCategory_name(updatedBlog.getCategory_name());
				blog.setTitle(updatedBlog.getTitle());
				blog.setAuthor(updatedBlog.getAuthor());
				blog.setDescription(updatedBlog.getDescription());
				blog.setMeta_description(updatedBlog.getMeta_description());
				blog.setMeta_keyword(updatedBlog.getMeta_keyword());
				blog.setMeta_title(updatedBlog.getMeta_title());

				blog.setDate(LocalDate.now());

				if (blogImage != null && !blogImage.isEmpty()) {
					String oldImagePath = blog.getBlog_image();
					if (oldImagePath != null) {
						Path oldImage = Paths.get(uploadDir + oldImagePath); // Use uploadDir here
						Files.deleteIfExists(oldImage);
					}
					String imagePath = saveFile(blogImage, "images");
					blog.setBlog_image(imagePath);
				}

				System.out.println("EC2 Instance Upload Path: " + uploadDir);

				if (blogPdf != null && !blogPdf.isEmpty()) {
					String originalFileName = blogPdf.getOriginalFilename();
					if (!originalFileName.matches("[a-zA-Z0-9_&\\-\\s/\\.]*")) {
						return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(
								"Invalid file name. Only letters, numbers, hyphens (-), underscores (_), ampersands (&), slashes (/), dots (.), and spaces are allowed.");
					}

					String normalizedPdfName = "pdfs/" + originalFileName;

					Optional<Blogs> existingBlogWithSamePdf = repo.findByExactPdfName(normalizedPdfName);
					if (existingBlogWithSamePdf.isPresent() && existingBlogWithSamePdf.get().getId() != id) {
						return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("This PDF already exists.");
					}

					// Delete old PDF
					String oldPdfPath = blog.getBlog_pdf();

					if (oldPdfPath != null && !oldPdfPath.isEmpty()) {
						File oldFile = new File(uploadDir + oldPdfPath); // Use uploadDir here

						if (oldFile.exists()) {
							System.out.println("Old file path: " + oldFile);
							boolean deleted = oldFile.delete();
							System.out.println("Old file deleted: " + deleted);
						} else {
							System.out.println("Old file not found at: " + oldFile.getAbsolutePath());
						}
					}

					String pdfPath = saveFile(blogPdf, "pdfs");
					if (pdfPath != null) {
						System.out.println("New file saved at: " + uploadDir + pdfPath);
						blog.setBlog_pdf(pdfPath);
					}
				}

				Blogs saved = repo.save(blog);
				return ResponseEntity.ok(saved);

			} catch (IOException e) {
				return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
						.body("Error updating blog: " + e.getMessage());
			}
		}).orElse(ResponseEntity.status(HttpStatus.NOT_FOUND).body("Blog not found with ID: " + id));
	}

	@GetMapping("/blog/download/{type}/{filename}")
	public ResponseEntity<Resource> downloadFile(@PathVariable String type, @PathVariable String filename) {
		try {
			// Ensure valid type (either images or pdfs)
			if (!type.equals("images") && !type.equals("pdfs")) {
				return ResponseEntity.badRequest().build();
			}

			Path filePath = Paths.get(uploadDir + type + "/" + filename);

//			Path filePath = Paths.get(System.getProperty("user.home") + "/uploads/blogs/" + type + "/" + filename);
			if (!Files.exists(filePath)) {
				return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
			}

			Resource resource = new UrlResource(filePath.toUri());

			MediaType mediaType = type.equals("pdfs") ? MediaType.APPLICATION_PDF : MediaType.IMAGE_JPEG;

			return ResponseEntity.ok().contentType(mediaType)
					.header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + filename + "\"").body(resource);
		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
		}
	}

	@DeleteMapping("blog/delete/{id}")
	public ResponseEntity<String> deleteBlog(@PathVariable int id) {
	    Optional<Blogs> optionalBlog = repo.findById(id);
	    if (!optionalBlog.isPresent()) {
	        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Blog not found.");
	    }

	    Blogs blog = optionalBlog.get();

	    if (blog.getBlog_pdf() != null && !blog.getBlog_pdf().isEmpty()) {
	        String filePath = uploadDir + blog.getBlog_pdf();
	        File file = new File(filePath);
	        if (file.exists()) {
	            boolean deleted = file.delete();
	            if (!deleted) {
	                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to delete PDF file.");
	            }
	        }
	    }

	    repo.delete(blog);
	    return ResponseEntity.ok("Blog deleted successfully.");
	}


}