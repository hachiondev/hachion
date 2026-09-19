package com.hachionUserDashboard.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.hachionUserDashboard.entity.ToolsItemEntity;

public interface ToolsItemRepository extends JpaRepository<ToolsItemEntity, Long> {

	@Query(value = """
			    SELECT COUNT(*)
			    FROM course_tools_items ti
			    INNER JOIN course_tools t
			        ON ti.curr_id = t.curr_id
			    WHERE LOWER(t.category_name) = LOWER(:category)
			      AND LOWER(t.course_name) = LOWER(:course)
			      AND LOWER(ti.tools_name) = LOWER(:toolsName)
			""", nativeQuery = true)
	Long countDuplicate(@Param("category") String category, @Param("course") String course,
			@Param("toolsName") String toolsName);

	@Query("""
			    SELECT COUNT(t) FROM ToolsItemEntity t
			    WHERE t.tools.categoryName = :category
			      AND t.tools.courseName = :course
			      AND LOWER(t.toolsName) = LOWER(:toolsName)
			      AND t.id <> :id
			""")
	Long countDuplicateExcludeId(@Param("category") String category, @Param("course") String course,
			@Param("toolsName") String toolsName, @Param("id") Long id);

	Optional<ToolsItemEntity> findById(Long id);

	@Query("""
			    SELECT t
			    FROM ToolsItemEntity t
			    WHERE LOWER(t.toolsName) = LOWER(:toolsName)
			    ORDER BY t.id ASC
			""")
	List<ToolsItemEntity> findByToolsNameIgnoreCaseOrderByIdAsc(String toolsName);

}
