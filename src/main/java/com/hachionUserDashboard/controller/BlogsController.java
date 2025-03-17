package com.hachionUserDashboard.controller;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDate;
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
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.hachionUserDashboard.entity.Blogs;
import com.hachionUserDashboard.repository.BlogRepository;


@RequestMapping("/blog")
@CrossOrigin
//@CrossOrigin(origins = {"http://localhost:3000", "http://160.153.175.69:3000"})
@RestController
public class BlogsController {

    

    @Autowired
    private BlogRepository repo;

    @GetMapping("/blog/{id}")
    public ResponseEntity<Blogs> getBlog(@PathVariable Integer id) {
        return repo.findById(id)
                   .map(ResponseEntity::ok)
                   .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND).build());
    }

    @GetMapping("/blog")
    public List<Blogs> getAllBlogs() {
        return repo.findAll();
    }

    @PostMapping("/blog/add")
    @ResponseStatus(code = HttpStatus.CREATED)
    public ResponseEntity<String> createBlog(
        @RequestParam("category_name") String categoryName,
        @RequestParam("title") String title,
        @RequestParam("author") String author,
        @RequestParam("description") String description,
        @RequestParam("date") String date, // LocalDate in "yyyy-MM-dd" format
        @RequestParam("blog_image") MultipartFile image,
        @RequestParam("blog_pdf") MultipartFile pdf
    ) {
    	try {
    	    // Define directories for saving files
    	    String uploadDir = "uploads/";
    	    Path imagePath = Paths.get(uploadDir + "images/");
    	    Path pdfPath = Paths.get(uploadDir + "pdfs/");
    	    
    	    // Create directories if they don't exist
    	    Files.createDirectories(imagePath);
    	    Files.createDirectories(pdfPath);
    	    
    	    // Save image file
    	    String imageFileName = "images/" + image.getOriginalFilename();  // Only keep relative path
    	    Files.write(Paths.get(uploadDir + imageFileName), image.getBytes());

    	    // Save PDF file
    	    String pdfFileName = "pdfs/" + pdf.getOriginalFilename();  // Only keep relative path
    	    Files.write(Paths.get(uploadDir + pdfFileName), pdf.getBytes());
    	    
            // Create and save blog entity
            Blogs blog = new Blogs();
            blog.setCategory_name(categoryName);
            blog.setTitle(title);
            blog.setAuthor(author);
            blog.setDescription(description);
            blog.setDate(LocalDate.parse(date));
            blog.setBlog_image(imageFileName);
            blog.setBlog_pdf(pdfFileName);

            repo.save(blog);
            return ResponseEntity.status(HttpStatus.CREATED).body("Blog added successfully!");

        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error saving files: " + e.getMessage());
        }
    }
    @PutMapping("/blog/update/{id}")
    public ResponseEntity<Blogs> updateBlogs(@PathVariable int id, 
                                              @RequestParam("category_name") String categoryName,
                                              @RequestParam("title") String title,
                                              @RequestParam("author") String author,
                                              @RequestParam("description") String description,
                                              @RequestParam("date") String date, // LocalDate in "yyyy-MM-dd" format
                                              @RequestParam(value = "blog_image", required = false) MultipartFile image, 
                                              @RequestParam(value = "blog_pdf", required = false) MultipartFile pdf) {
        
            return repo.findById(id).map(blog -> {
                // Set other fields
                blog.setCategory_name(categoryName);
                blog.setTitle(title);
                blog.setAuthor(author);
                blog.setDescription(description);
                blog.setDate(LocalDate.parse(date));

                // Handle the image update (if a new image is provided)
                if (image != null && !image.isEmpty()) {
                    // Delete old image (optional)
                    String oldImagePath = blog.getBlog_image();
                    if (oldImagePath != null) {
                        Path oldImage = Paths.get("uploads/" + oldImagePath);
                        try {
							Files.deleteIfExists(oldImage);
						} catch (IOException e) {
							// TODO Auto-generated catch block
							e.printStackTrace();
						} // Delete the old image
                    }

                    // Save new image
                    String imageFileName = "images/" + image.getOriginalFilename();
                    Path imagePath = Paths.get("uploads/" + imageFileName);
                    try {
						Files.createDirectories(imagePath.getParent());
					} catch (IOException e) {
						// TODO Auto-generated catch block
						e.printStackTrace();
					}
                    try {
						Files.write(imagePath, image.getBytes());
					} catch (IOException e) {
						// TODO Auto-generated catch block
						e.printStackTrace();
					}

                    blog.setBlog_image(imageFileName); // Set the new image path
                }

                // Handle the PDF update (if a new PDF is provided)
                if (pdf != null && !pdf.isEmpty()) {
                    String pdfFileName = "pdfs/" + pdf.getOriginalFilename();
                    Path pdfPath = Paths.get("uploads/" + pdfFileName);
                    try {
						Files.createDirectories(pdfPath.getParent());
					} catch (IOException e) {
						// TODO Auto-generated catch block
						e.printStackTrace();
					}
                    try {
						Files.write(pdfPath, pdf.getBytes());
					} catch (IOException e) {
						// TODO Auto-generated catch block
						e.printStackTrace();
					}

                    blog.setBlog_pdf(pdfFileName); // Set the new PDF path
                }

                // Save updated blog
                repo.save(blog);
                return ResponseEntity.ok(blog);
            }).orElse(ResponseEntity.status(HttpStatus.NOT_FOUND).build());

        
    }

    @DeleteMapping("blog/delete/{id}") public ResponseEntity<?>
    deleteBlog(@PathVariable int id) { Blogs blog=
    repo.findById(id).get(); repo.delete(blog); return null;
    
    }
}