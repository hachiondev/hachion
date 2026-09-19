package com.hachionUserDashboard.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.hachionUserDashboard.entity.UserWishlist;

public interface UserWishlistRepository extends JpaRepository<UserWishlist, Long> {

	@Query(value = """
			SELECT *
			FROM user_wishlist
			WHERE email = :email
			ORDER BY created_at DESC
			""", nativeQuery = true)
	List<UserWishlist> findByEmailOrderByCreatedAtDescNative(@Param("email") String email);

	@Query(value = """
			SELECT COUNT(*)
			FROM user_wishlist
			WHERE email = :email AND course_id = :courseId
			""", nativeQuery = true)
	int countByEmailAndCourseIdNative(@Param("email") String email, @Param("courseId") Integer courseId);

	@Modifying
	@Query(value = """
			DELETE FROM user_wishlist
			WHERE email = :email AND course_id = :courseId
			""", nativeQuery = true)
	int deleteByEmailAndCourseIdNative(@Param("email") String email, @Param("courseId") Integer courseId);

	@Query(value = """
			SELECT course_id
			FROM user_wishlist
			WHERE email = :email
			ORDER BY created_at DESC
			""", nativeQuery = true)
	List<Integer> findCourseIdsByEmailNative(@Param("email") String email);

	@Query(value = """
			SELECT *
			FROM user_wishlist
			WHERE email = :email AND course_id = :courseId
			LIMIT 1
			""", nativeQuery = true)
	Optional<UserWishlist> findOneByEmailAndCourseIdNative(@Param("email") String email,
			@Param("courseId") Integer courseId);
}
