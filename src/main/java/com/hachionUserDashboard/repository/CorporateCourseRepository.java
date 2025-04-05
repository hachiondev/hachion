package com.hachionUserDashboard.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.hachionUserDashboard.entity.CorporateCourse;
import com.hachionUserDashboard.entity.TrendingCourse;

public interface CorporateCourseRepository extends JpaRepository <CorporateCourse,Integer> {

}
