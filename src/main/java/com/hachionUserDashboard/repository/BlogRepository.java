package com.hachionUserDashboard.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.hachionUserDashboard.entity.Blogs;

public interface BlogRepository extends JpaRepository <Blogs,Integer> {

	@Query(value = "SELECT * FROM blogs WHERE blog_pdf = :blogPdf", nativeQuery = true)
	Optional<Blogs> findByExactPdfName(@Param("blogPdf") String blogPdf);

}
