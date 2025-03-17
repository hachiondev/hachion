package com.hachionUserDashboard.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.hachionUserDashboard.entity.CourseCategory;
import com.hachionUserDashboard.service.CourseCategoryService;

import java.util.Optional;

@RestController
@RequestMapping("/course-categories")
@CrossOrigin
//@CrossOrigin(origins = {"http://localhost:3000", "http://hachion.co"})
public class CourseCategoryController {

    @Autowired
    private CourseCategoryService categoryService;

    // Create course category
    @PostMapping("/add")
    public ResponseEntity<String> addCategory(@RequestBody CourseCategory category) {
        if (categoryService.categoryExists(category.getName())) {
            return ResponseEntity.status(400).body("Course Category already exists");
        }
        categoryService.saveCategory(category);
        return ResponseEntity.ok("Course Category added successfully");
    }

    // Get all categories
    @GetMapping("/all")
    public Iterable<CourseCategory> getAllCategories() {
        return categoryService.getAllCategories();
    }

    // Update an existing category by ID
    @PutMapping("/update/{id}")
    public ResponseEntity<String> updateCategory(@PathVariable Long id, @RequestBody CourseCategory category) {
        Optional<CourseCategory> existingCategory = categoryService.getCategoryById(id);
        if (existingCategory.isPresent()) {
            CourseCategory updatedCategory = existingCategory.get();
            updatedCategory.setName(category.getName());
            updatedCategory.setDate(category.getDate());
            categoryService.saveCategory(updatedCategory);
            return ResponseEntity.ok("Course Category updated successfully");
        } else {
            return ResponseEntity.status(404).body("Course Category not found");
        }
    }

    // Delete a category by ID
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<String> deleteCategory(@PathVariable Long id) {
        if (categoryService.categoryExistsById(id)) {
            categoryService.deleteCategoryById(id);
            return ResponseEntity.ok("Course Category deleted successfully");
        } else {
            return ResponseEntity.status(404).body("Course Category not found");
        }
    }

    // Get a single category by ID (optional endpoint if needed by frontend)
    @GetMapping("/{id}")
    public ResponseEntity<CourseCategory> getCategoryById(@PathVariable Long id) {
        Optional<CourseCategory> category = categoryService.getCategoryById(id);
        return category.map(ResponseEntity::ok)
                       .orElseGet(() -> ResponseEntity.status(404).body(null));
    }
}
