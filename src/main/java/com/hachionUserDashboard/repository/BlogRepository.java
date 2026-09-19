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

	@Query(value = "SELECT id, category_name, title, short_title, author, author_image, blog_image, date FROM blogs ORDER BY id DESC LIMIT 8", nativeQuery = true)
	List<Object[]> findTop8ForRecentEntries();

	@Query(value = "SELECT DISTINCT category_name FROM blogs ORDER BY category_name ASC", nativeQuery = true)
	List<String> findAllBlogCategories();

//	@Query(value = "SELECT id, category_name, title, author, author_image, blog_image, date " + "FROM blogs "
//			+ "WHERE category_name IN (:categories) " + "ORDER BY id DESC", nativeQuery = true)
//	List<Object[]> findByCategoriesForList(@Param("categories") List<String> categories);

	@Query(value = "SELECT id, category_name, title, short_title, author, author_image, blog_image, date " +
	        "FROM blogs " +
	        "WHERE category_name IN (:categories) " +
	        "ORDER BY category_name DESC, id DESC", nativeQuery = true)
	List<Object[]> findByCategoriesForList(@Param("categories") List<String> categories);

//	@Query(value = """
//			    SELECT
//			        id,
//			        category_name,
//			        title,
//			        author,
//			        date
//			    FROM blogs
//			""", nativeQuery = true)
//	List<Object[]> findAllBlogColumns();
	
	@Query(value = """
            SELECT
                category_name,
                short_title
            FROM blogs
        """, nativeQuery = true)
List<Object[]> findAllBlogColumns();

	@Query(value = "SELECT * FROM blogs WHERE LOWER(REPLACE(title,' ','-')) = LOWER(:slug) LIMIT 1", nativeQuery = true)
	Optional<Blogs> findBySlug(@Param("slug") String slug);

	// TRIM()'d on both sides: some existing rows have a leading/trailing
	// space in short_title (invisible in the admin's text input, predating
	// the controller-level trim added alongside this) and this column's
	// collation does NOT ignore that in an exact `=` comparison (verified
	// live: "best cybersecurity certifications" 404s while "...
	// certifications " - with the trailing space - 200s against the same
	// row) - so an exact match here silently depended on a caller
	// reconstructing that exact stray whitespace. getBlogPath()
	// (src/lib/blogUrl.js, frontend) now builds the clean URL with that
	// whitespace-turned-hyphen trimmed off, which needs the lookup below to
	// find the same row from either form of the query.
	@Query("SELECT COUNT(b) > 0 FROM Blogs b WHERE TRIM(b.shortTitle) = TRIM(:shortTitle)")
	boolean existsByShortTitle(@Param("shortTitle") String shortTitle);

	@Query("SELECT COUNT(b) > 0 FROM Blogs b WHERE TRIM(b.shortTitle) = TRIM(:shortTitle) AND b.id != :id")
	boolean existsByShortTitleAndIdNot(@Param("shortTitle") String shortTitle, @Param("id") int id);

	@Query(value = "SELECT * FROM blogs WHERE TRIM(short_title) = TRIM(:shortTitle) LIMIT 1", nativeQuery = true)
	Optional<Blogs> findBlogByShortTitle(@Param("shortTitle") String shortTitle);

}
