package com.hachionUserDashboard.service;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.hachionUserDashboard.dto.UploadAllImagesResponse;
import com.hachionUserDashboard.entity.UploadAllImages;
import com.hachionUserDashboard.entity.UploadImagesCategory;
import com.hachionUserDashboard.repository.UploadAllImagesRepository;
import com.hachionUserDashboard.repository.UploadImagesCategoryRepository;

import Service.UploadImagesService;
import jakarta.transaction.Transactional;

@Service
public class UploadImagesServiceImpl implements UploadImagesService {

	@Value("${upload.all.images.path}")
	private String uploadPath;

	@Autowired
	private UploadImagesCategoryRepository categoryRepo;

	@Autowired
	private UploadAllImagesRepository imagesRepository;

//
//	@Override
//	public void saveCategoryWithImages(String categoryName, String courseName, List<MultipartFile> files)
//			throws IOException {
//
//		Optional<UploadImagesCategory> existingCategoryOpt = categoryRepo.findByCategoryNameAndCourseName(categoryName,
//				courseName);
//
//		UploadImagesCategory category;
//		if (existingCategoryOpt.isPresent()) {
//
//			category = existingCategoryOpt.get();
//		} else {
//
//			category = new UploadImagesCategory();
//			category.setCategoryName(categoryName);
//			category.setCourseName(courseName);
//			category.setCreatedDate(LocalDate.now());
//		}
//
//		List<UploadAllImages> imageEntities = new ArrayList<>();
//
//		for (MultipartFile file : files) {
//
//			String originalName = file.getOriginalFilename();
//			String safeCategory = categoryName.replaceAll("\\s+", "_");
//			String safeCourse = courseName.replaceAll("\\s+", "_");
//
//			String fileName = safeCategory + "_" + safeCourse + "_" + originalName;
//
//			Long exists = imagesRepository.countByFileNameAndCategoryAndCourse(fileName, categoryName, courseName);
//			if (exists != null && exists > 0) {
//				throw new IllegalArgumentException("Image already exists for this category & course: " + originalName);
//			}
//
//			UploadAllImages image = new UploadAllImages();
//			image.setFileName(fileName);
//			image.setFileUrl("https://api.hachion.co/prod/upload_all_images/" + fileName);
//			image.setUploadImagesCategory(category);
//
//			imageEntities.add(image);
//		}
//
//		if (category.getImages() != null) {
//			category.getImages().addAll(imageEntities);
//		} else {
//			category.setImages(imageEntities);
//		}
//
//		categoryRepo.save(category);
//	}

	@Transactional
	public void saveCategoryWithImages(String categoryName, String courseName, List<MultipartFile> files)
			throws IOException {

		// 1. Check if category exists
		Optional<UploadImagesCategory> existingCategoryOpt = categoryRepo.findByCategoryNameAndCourseName(categoryName,
				courseName);

		UploadImagesCategory category;
		if (existingCategoryOpt.isPresent()) {
			category = existingCategoryOpt.get();
		} else {
			category = new UploadImagesCategory();
			category.setCategoryName(categoryName);
			category.setCourseName(courseName);
			category.setCreatedDate(LocalDate.now());
		}

		// 2. Prepare list for new images
		List<UploadAllImages> imageEntities = new ArrayList<>();

		// 3. Ensure upload directory exists
		Path uploadDir = Paths.get(uploadPath);
		if (!Files.exists(uploadDir)) {
			Files.createDirectories(uploadDir);
		}

		// 4. Process each file
		for (MultipartFile file : files) {

			String originalName = file.getOriginalFilename();
			String safeCategory = categoryName.replaceAll("\\s+", "_");
			String safeCourse = courseName.replaceAll("\\s+", "_");

			String fileName = safeCategory + "_" + safeCourse + "_" + originalName;

			// 5. Check if the file already exists in DB
			Long exists = imagesRepository.countByFileNameAndCategoryAndCourse(fileName, categoryName, courseName);
			if (exists != null && exists > 0) {
				throw new IllegalArgumentException("Image already exists for this category & course: " + originalName);
			}

			// 6. Save file physically
			Path filePath = uploadDir.resolve(fileName);
			file.transferTo(filePath.toFile());

			// 7. Create DB entity
			UploadAllImages image = new UploadAllImages();
			image.setFileName(fileName);
			image.setFileUrl("https://api.hachion.co/prod/upload_all_images/" + fileName);
			image.setUploadImagesCategory(category);

			imageEntities.add(image);
		}

		// 8. Add images to category and save
		if (category.getImages() != null) {
			category.getImages().addAll(imageEntities);
		} else {
			category.setImages(imageEntities);
		}

		categoryRepo.save(category);
	}

	@Override
	public List<UploadAllImagesResponse> getAllCategoriesWithImages() {
		List<UploadImagesCategory> categories = categoryRepo.findAllCategoriesAlphabetical();

		return categories.stream().flatMap(category -> category.getImages().stream().map(img -> {
			UploadAllImagesResponse dto = new UploadAllImagesResponse();
			dto.setUploadImagesCategoryId(category.getUploadImagesCategoryId());
			dto.setCategoryName(category.getCategoryName());
			dto.setCourseName(category.getCourseName());
			dto.setCreatedDate(category.getCreatedDate());
			dto.setFileName(img.getFileName());
			String safeCategory = category.getCategoryName().replaceAll("\\s+", "_");
			String safeCourse = category.getCourseName().replaceAll("\\s+", "_");
			String prefix = safeCategory + "_" + safeCourse + "_";

			String originalFileName = img.getFileName();
			if (originalFileName.startsWith(prefix)) {
				originalFileName = originalFileName.substring(prefix.length());
			}
			dto.setOriginalFileName(originalFileName);
			dto.setFileUrl(img.getFileUrl());
			return dto;
		})).collect(Collectors.toList());
	}

	@Override
	@Transactional
	public void deleteByFileName(String fileName) {
		Optional<UploadAllImages> imageOpt = imagesRepository.findByFileName(fileName);

		if (imageOpt.isPresent()) {
			UploadAllImages image = imageOpt.get();
			UploadImagesCategory parentCategory = image.getUploadImagesCategory();

			try {
				Path path = Paths.get(uploadPath, image.getFileName());
				System.out.println("Checking file at: " + path.toString());
				if (Files.exists(path)) {
					Files.delete(path);
					System.out.println("Deleted file: " + path.toString());
				}
			} catch (IOException e) {
				System.err.println("Error deleting file: " + image.getFileName());
				e.printStackTrace();
			}

			if (parentCategory != null && parentCategory.getImages() != null) {
				parentCategory.getImages().remove(image);
			}

			categoryRepo.save(parentCategory);

			if (parentCategory != null && parentCategory.getImages().isEmpty()) {
				categoryRepo.delete(parentCategory);
				System.out.println("Deleted parent category: " + parentCategory.getCategoryName());
			}

		} else {
			throw new IllegalArgumentException("Image not found with fileName: " + fileName);
		}
	}

}
