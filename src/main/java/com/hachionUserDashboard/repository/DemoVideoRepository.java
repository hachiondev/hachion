package com.hachionUserDashboard.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.hachionUserDashboard.entity.DemoVideo;



@Repository
public interface DemoVideoRepository extends JpaRepository <DemoVideo,Integer> {

}
