package com.hachionUserDashboard.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.hachionUserDashboard.entity.Project;

public interface ProjectRepository extends JpaRepository<Project, Long> {

}
