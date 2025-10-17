//package com.hachionUserDashboard.controller;
//
//import java.util.List;
//
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.http.HttpStatus;
//import org.springframework.http.ResponseEntity;
//import org.springframework.web.bind.annotation.DeleteMapping;
//import org.springframework.web.bind.annotation.GetMapping;
//import org.springframework.web.bind.annotation.PathVariable;
//import org.springframework.web.bind.annotation.PostMapping;
//import org.springframework.web.bind.annotation.RequestMapping;
//import org.springframework.web.bind.annotation.RequestParam;
//import org.springframework.web.bind.annotation.RestController;
//import org.springframework.web.multipart.MultipartFile;
//
//import com.hachionUserDashboard.dto.UploadAllImagesResponse;
//
//import Service.UploadImagesService;
//
//@RestController
//@RequestMapping("/upload_images")
//public class UploadImagesController {
//
//	@Autowired
//	private UploadImagesService uploadService;
//
//	@PostMapping("/upload")
//	public ResponseEntity<?> uploadCategoryWithImages(@RequestParam String categoryName,
//			@RequestParam String courseName, @RequestParam("files") List<MultipartFile> files) {
//		try {
//			uploadService.saveCategoryWithImages(categoryName, courseName, files);
//			return ResponseEntity
//					.ok("Images uploaded successfully for category: " + categoryName + ", course: " + courseName);
//		} catch (IllegalArgumentException e) {
//			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
//		} catch (Exception e) {
//			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
//					.body("Error uploading images: " + e.getMessage());
//		}
//	}
//
//	@GetMapping("/all")
//	public ResponseEntity<List<UploadAllImagesResponse>> getAllCategoryCourses() {
//		List<UploadAllImagesResponse> response = uploadService.getAllCategoriesWithImages();
//		return ResponseEntity.ok(response);
//	}
//
//	@DeleteMapping("/delete/{fileName}")
//	public ResponseEntity<String> deleteByFileName(@PathVariable String fileName) {
//		try {
//			uploadService.deleteByFileName(fileName);
//			return ResponseEntity.ok("Image deleted successfully: " + fileName);
//		} catch (IllegalArgumentException e) {
//			return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
//		} catch (Exception e) {
//			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
//					.body("Error while deleting image: " + fileName);
//		}
//	}
//}
