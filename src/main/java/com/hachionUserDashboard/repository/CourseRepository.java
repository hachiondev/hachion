package com.hachionUserDashboard.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import com.hachionUserDashboard.entity.Course;
import com.hachionUserDashboard.entity.CourseCategory;
import com.hachionUserDashboard.entity.Faq;


@Repository
public interface CourseRepository extends JpaRepository <Course,Integer>{

}
