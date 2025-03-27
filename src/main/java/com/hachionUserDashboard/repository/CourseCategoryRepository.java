package com.hachionUserDashboard.repository;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import com.hachionUserDashboard.entity.CourseCategory;

@Repository
public interface CourseCategoryRepository extends CrudRepository<CourseCategory, Long> {
    boolean existsByName(String name); // Check if category exists by name
}
