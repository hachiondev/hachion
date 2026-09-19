package com.hachionUserDashboard.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.hachionUserDashboard.entity.ToolsEntity;

public interface ToolsRepository extends JpaRepository<ToolsEntity, Long> {

	Optional<ToolsEntity> findByCategoryNameAndCourseName(String categoryName, String courseName);

	void deleteByCategoryNameAndCourseName(String categoryName, String courseName);

	List<ToolsEntity> findByCourseName(String courseName);

	@Query("""
			    SELECT DISTINCT t.toolsName
			    FROM ToolsItemEntity t
			    WHERE t.toolsName IS NOT NULL
			    ORDER BY t.toolsName ASC
			""")
	List<String> findDistinctToolNamesOrderByAsc();

	@Query(value = """
			    SELECT i.tools_name
			    FROM course_tools t
			    JOIN course_tools_items i ON i.curr_id = t.curr_id
			    WHERE t.course_name = :courseName
			""", nativeQuery = true)
	List<String> findToolNamesByCourseName(@Param("courseName") String courseName);
}
