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

	@PostMapping("blog/add")
	public ResponseEntity<?> addBlog(@RequestPart("blogData") String blogData,
			@RequestPart(value = "blogImage", required = false) MultipartFile blogImage,
			@RequestPart(value = "blogPdf", required = false) MultipartFile blogPdf,
			@RequestPart(value = "authorImage", required = false) MultipartFile authorImage // NEW (author-image)
	) {
		try {
			ObjectMapper objectMapper = new ObjectMapper();
			objectMapper.registerModule(new JavaTimeModule());
			Blogs blog = objectMapper.readValue(blogData, Blogs.class);

			// Blog main image
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

			// NEW (author-image): optional author image upload to "author-images"
			if (authorImage != null && !authorImage.isEmpty()) {
				String authorImagePath = saveFile(authorImage, "author-images");
				if (authorImagePath != null) {
					blog.setAuthorImage(authorImagePath);
				} else {
					return ResponseEntity.badRequest().body("Failed to save author image.");
				}
			} else {
				blog.setAuthorImage("");
			}

			// PDF
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
			@RequestPart(value = "blogPdf", required = false) MultipartFile blogPdf,
			@RequestPart(value = "authorImage", required = false) MultipartFile authorImage // NEW (author-image)
	) {

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
//                blog.setDate(LocalDate.now());

				// Replace blog image if a new one is uploaded
				if (blogImage != null && !blogImage.isEmpty()) {
					String oldImagePath = blog.getBlog_image();
					if (oldImagePath != null && !oldImagePath.trim().isEmpty()) {
						Path oldImage = Paths.get(uploadDir + oldImagePath);
						try {
							Files.deleteIfExists(oldImage);
						} catch (IOException e) {
							System.err.println("Could not delete old image: " + e.getMessage());
						}
					}
					String imagePath = saveFile(blogImage, "images");
					blog.setBlog_image(imagePath);
				}

				// NEW (author-image): replace author image if provided
				if (authorImage != null && !authorImage.isEmpty()) {
					String oldAuthorImagePath = blog.getAuthorImage();
					if (oldAuthorImagePath != null && !oldAuthorImagePath.trim().isEmpty()) {
						Path oldAuthorImage = Paths.get(uploadDir + oldAuthorImagePath);
						try {
							Files.deleteIfExists(oldAuthorImage);
						} catch (IOException e) {
							System.err.println("Could not delete old author image: " + e.getMessage());
						}
					}
					String authorImagePath = saveFile(authorImage, "author-images");
					blog.setAuthorImage(authorImagePath);
				}

				// Replace PDF if a new one is uploaded
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

					String oldPdfPath = blog.getBlog_pdf();
					if (oldPdfPath != null && !oldPdfPath.isEmpty()) {
						File oldFile = new File(uploadDir + oldPdfPath);
						if (oldFile.exists()) {
							boolean deleted = oldFile.delete();
							// (silent if failed; you already follow this pattern)
						}
					}

					String pdfPath = saveFile(blogPdf, "pdfs");
					if (pdfPath != null) {
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
			// NEW (author-image): allow author-images as a valid type
			if (!type.equals("images") && !type.equals("pdfs") && !type.equals("author-images")) {
				return ResponseEntity.badRequest().build();
			}

			Path filePath = Paths.get(uploadDir + type + "/" + filename);

			if (!Files.exists(filePath)) {
				return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
			}

			Resource resource = new UrlResource(filePath.toUri());

			MediaType mediaType;
			if (type.equals("pdfs")) {
				mediaType = MediaType.APPLICATION_PDF;
			} else {
				// images / author-images
				mediaType = MediaType.IMAGE_JPEG; // keep same behavior as your current code
			}

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
		if (blog.getBlog_image() != null && !blog.getBlog_image().isEmpty()) {
			String imagePath = uploadDir + blog.getBlog_image();
			File imageFile = new File(imagePath);
			if (imageFile.exists()) {
				boolean deleted = imageFile.delete();
				if (!deleted) {
					return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to delete image file.");
				}
			}
		}
		// NEW (author-image): delete author image file too
		if (blog.getAuthorImage() != null && !blog.getAuthorImage().isEmpty()) {
			String authorImgPath = uploadDir + blog.getAuthorImage();
			File authorImgFile = new File(authorImgPath);
			if (authorImgFile.exists()) {
				boolean deleted = authorImgFile.delete();
				if (!deleted) {
					return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
							.body("Failed to delete author image file.");
				}
			}
		}

		repo.delete(blog);
		return ResponseEntity.ok("Blog deleted successfully.");
	}

	@GetMapping("/blogs/images/{imageName:.+}")
	public ResponseEntity<Resource> getImage(@PathVariable String imageName) {
		try {
			Path imagePath = Paths.get(upload + "blogs/images/").resolve(imageName).normalize();
			Resource resource = new UrlResource(imagePath.toUri());

			if (resource.exists() && resource.isReadable()) {
				return ResponseEntity.ok().contentType(MediaType.IMAGE_PNG).body(resource);
			} else {
				return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
			}
		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
		}
	}

	// OPTIONAL convenience endpoint mirroring getImage() for author-images
	// Comment out if you don't need it.
	@GetMapping("/blogs/author-images/{imageName:.+}") // NEW (author-image)
	public ResponseEntity<Resource> getAuthorImage(@PathVariable String imageName) {
		try {
			Path imagePath = Paths.get(upload + "blogs/author-images/").resolve(imageName).normalize();
			Resource resource = new UrlResource(imagePath.toUri());

			if (resource.exists() && resource.isReadable()) {
				return ResponseEntity.ok().contentType(MediaType.IMAGE_PNG).body(resource);
			} else {
				return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
			}
		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
		}
	}

	@GetMapping("/blog/recent")
	public List<Object[]> getAllBlogsLightweight() {
		return repo.findTop8ForRecentEntries();
	}

}
