package com.hachionUserDashboard.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.hachionUserDashboard.entity.UserReview;



public interface UserReviewRepository extends JpaRepository <UserReview,Integer> {

}
