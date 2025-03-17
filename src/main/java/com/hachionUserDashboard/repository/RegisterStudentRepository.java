package com.hachionUserDashboard.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.hachionUserDashboard.entity.Faq;
import com.hachionUserDashboard.entity.RegisterStudent;

public interface RegisterStudentRepository extends JpaRepository <RegisterStudent,Integer> {

}
