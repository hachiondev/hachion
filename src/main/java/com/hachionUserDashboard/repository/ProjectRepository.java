package com.hachionUserDashboard.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.hachionUserDashboard.entity.Project;

public interface ProjectRepository extends JpaRepository<Project, Long> {

	@Query(value = """
			    SELECT project_name, description
			    FROM project
			    WHERE course_name = :courseName
			    ORDER BY date DESC
			""", nativeQuery = true)
	List<Object[]> findByCourseName(@Param("courseName") String courseName);
}
