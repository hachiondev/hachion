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
        return courseCategoryRepository.findAll();
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
