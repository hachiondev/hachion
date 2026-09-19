package com.hachionUserDashboard.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.hachionUserDashboard.entity.GeoKeywordGroup;

public interface GeoKeywordGroupRepository extends JpaRepository<GeoKeywordGroup, Long> {

	Optional<GeoKeywordGroup> findByCategoryNameAndCourseName(String categoryName, String courseName);

	Optional<GeoKeywordGroup> findByCourseNameIgnoreCase(String courseName);

}