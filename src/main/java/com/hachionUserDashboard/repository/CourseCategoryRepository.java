package com.hachionUserDashboard.repository;

import java.util.List;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import com.hachionUserDashboard.entity.CourseCategory;

@Repository
public interface CourseCategoryRepository extends CrudRepository<CourseCategory, Long> {
    boolean existsByName(String name); // Check if category exists by name
    
    @Query(value = "SELECT id, name, date FROM course_category ORDER BY name ASC", nativeQuery = true)
    List<CourseCategory> findAllByOrderByNameAsc();
}
