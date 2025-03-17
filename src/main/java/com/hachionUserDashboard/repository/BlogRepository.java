package com.hachionUserDashboard.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.hachionUserDashboard.entity.Blogs;
import com.hachionUserDashboard.entity.RequestBatch;

public interface BlogRepository extends JpaRepository <Blogs,Integer> {

}
