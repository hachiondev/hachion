package com.hachionUserDashboard.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.hachionUserDashboard.entity.Banner;
import com.hachionUserDashboard.entity.Blogs;

public interface BannerRepository extends JpaRepository <Banner,Integer> {

}
