package com.hachionUserDashboard.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.hachionUserDashboard.entity.Curriculum;

@Repository
public interface CurriculumRepository extends JpaRepository <Curriculum,Integer>{

}
