package com.hachionUserDashboard.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.hachionUserDashboard.entity.Resume;
import com.hachionUserDashboard.entity.Review;

@Repository
public interface ReviewRepository extends JpaRepository <Review,Integer> {

}
