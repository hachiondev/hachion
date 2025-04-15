package com.hachionUserDashboard.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;


import com.hachionUserDashboard.entity.Enroll;

public interface EnrollRepository extends JpaRepository <Enroll,Integer> {


	List<Enroll> findByEmail(String email);


}
