package com.hachionUserDashboard.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;


import com.hachionUserDashboard.entity.Resume;

@Repository
public interface ResumeRepository extends JpaRepository <Resume,Integer> {

}
