package com.hachionUserDashboard.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.hachionUserDashboard.entity.Blogs;

public interface BlogRepository extends JpaRepository <Blogs,Integer> {

}
