package com.hachionUserDashboard.service;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import com.hachionUserDashboard.entity.Course;
import com.hachionUserDashboard.entity.UserWishlist;
import com.hachionUserDashboard.repository.CourseRepository;
import com.hachionUserDashboard.repository.UserWishlistRepository;

import Service.UserWishlistService;

@Service
public class UserWishlistServiceImpl implements UserWishlistService {

	private final UserWishlistRepository wishlistRepo;
	private final CourseRepository courseRepo;

	public UserWishlistServiceImpl(UserWishlistRepository wishlistRepo, CourseRepository courseRepo) {
		this.wishlistRepo = wishlistRepo;
		this.courseRepo = courseRepo;
	}

	private static void requireEmail(String email) {
		if (email == null || email.isBlank()) {
			throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Please login before bookmarking");
		}
	}

	@Override
	@Transactional
	public void add(String email, Integer courseId) {
		requireEmail(email);
		int cnt = wishlistRepo.countByEmailAndCourseIdNative(email, courseId);
		if (cnt == 0) {
			
			wishlistRepo.save(new UserWishlist(email, courseId));
		}
	}

	@Override
	@Transactional
	public void remove(String email, Integer courseId) {
		requireEmail(email);
		wishlistRepo.deleteByEmailAndCourseIdNative(email, courseId); 
	}

	@Override
	public boolean exists(String email, Integer courseId) {
		requireEmail(email);
		return wishlistRepo.countByEmailAndCourseIdNative(email, courseId) > 0;
	}

	@Override
	public List<UserWishlist> listRaw(String email) {
		requireEmail(email);
		return wishlistRepo.findByEmailOrderByCreatedAtDescNative(email);
	}

	@Override
	public List<Course> listCourses(String email) {
		requireEmail(email);
		
		return courseRepo.findCoursesByEmailNative(email);
	}

	@Override
	@Transactional
	public boolean toggle(String email, Integer courseId) {
		requireEmail(email);

		var existing = wishlistRepo.findOneByEmailAndCourseIdNative(email, courseId);
		if (existing.isPresent()) {
			
			wishlistRepo.deleteById(existing.get().getUserWishlistId());
			return false; 
		}

		
		wishlistRepo.save(new UserWishlist(email, courseId));
		return true; 
	}
}