package com.hachionUserDashboard.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.hachionUserDashboard.entity.CourseCategory;
import com.hachionUserDashboard.repository.CourseCategoryRepository;

import java.util.Optional;

@Service
public class CourseCategoryService {

	@Autowired
	private CourseCategoryRepository courseCategoryRepository;

	// Save or update a category
	public CourseCategory saveCategory(CourseCategory category) {
		return courseCategoryRepository.save(category);
	}

	public CourseCategory updateCategory(Long id, CourseCategory category) {

		Optional<CourseCategory> existingCategoryOpt = courseCategoryRepository.findById(id);

		if (existingCategoryOpt.isPresent()) {

			CourseCategory existingCategory = existingCategoryOpt.get();

			String oldCategoryName = existingCategory.getName();

			existingCategory.setName(category.getName());
			existingCategory.setDate(category.getDate());

			CourseCategory savedCategory = courseCategoryRepository.save(existingCategory);

			String newCategoryName = savedCategory.getName();

			courseCategoryRepository.updateBlogsCategory(oldCategoryName, newCategoryName);

			courseCategoryRepository.updateCertificateCategory(oldCategoryName, newCategoryName);

			courseCategoryRepository.updateCorporateReviewCategory(oldCategoryName, newCategoryName);

			courseCategoryRepository.updateCorporateCourseCategory(oldCategoryName, newCategoryName);

			courseCategoryRepository.updateCourseToolsCategory(oldCategoryName, newCategoryName);

			courseCategoryRepository.updateCurriculumCategory(oldCategoryName, newCategoryName);

			courseCategoryRepository.updateDemoVideoCategory(oldCategoryName, newCategoryName);

			courseCategoryRepository.updateFaqCategory(oldCategoryName, newCategoryName);

			courseCategoryRepository.updateGeoKeywordCategory(oldCategoryName, newCategoryName);

			courseCategoryRepository.updateRegularVideoCategory(oldCategoryName, newCategoryName);

			courseCategoryRepository.updateResumeCategory(oldCategoryName, newCategoryName);

			courseCategoryRepository.updateReviewCategory(oldCategoryName, newCategoryName);
			courseCategoryRepository.updateSummerEventsCategory(oldCategoryName, newCategoryName);

			courseCategoryRepository.updateTrainerCategory(oldCategoryName, newCategoryName);

			courseCategoryRepository.updateTrendingCourseCategory(oldCategoryName, newCategoryName);

			courseCategoryRepository.updateUploadImagesCategory(oldCategoryName, newCategoryName);

			courseCategoryRepository.updateUserReviewCategory(oldCategoryName, newCategoryName);

			courseCategoryRepository.updateVideoAccessCategory(oldCategoryName, newCategoryName);

			courseCategoryRepository.updateWorkshopScheduleCategory(oldCategoryName, newCategoryName);

			courseCategoryRepository.updateCourseTableCategory(oldCategoryName, newCategoryName);

			courseCategoryRepository.updateScheduleTableCategory(oldCategoryName, newCategoryName);
			return savedCategory;
		}

		return null;
	}

	// Check if a category exists by name
	public boolean categoryExists(String name) {
		return courseCategoryRepository.existsByName(name);
	}

	// Check if a category exists by ID
	public boolean categoryExistsById(Long id) {
		return courseCategoryRepository.existsById(id);
	}

	// Retrieve all categories
	public Iterable<CourseCategory> getAllCategories() {
		return courseCategoryRepository.findAllByOrderByNameAsc();
	}

	// Retrieve a category by ID
	public Optional<CourseCategory> getCategoryById(Long id) {
		return courseCategoryRepository.findById(id);
	}

	// Delete a category by ID
	public void deleteCategoryById(Long id) {
		courseCategoryRepository.deleteById(id);
	}
}
