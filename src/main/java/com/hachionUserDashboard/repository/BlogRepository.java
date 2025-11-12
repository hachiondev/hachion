package com.hachionUserDashboard.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.hachionUserDashboard.entity.Blogs;

public interface BlogRepository extends JpaRepository<Blogs, Integer> {

	@Query(value = "SELECT * FROM blogs WHERE blog_pdf = :blogPdf", nativeQuery = true)
	Optional<Blogs> findByExactPdfName(@Param("blogPdf") String blogPdf);

	@Query(value = "SELECT id, category_name, title, author, author_image, blog_image, date FROM blogs ORDER BY id DESC LIMIT 8", nativeQuery = true)
	List<Object[]> findTop8ForRecentEntries();

}
