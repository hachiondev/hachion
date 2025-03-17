package com.hachionUserDashboard.repository;


import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.hachionUserDashboard.entity.RegularVideo;
import com.hachionUserDashboard.entity.VideoAccess;



@Repository
public interface VideoAccessRepository extends JpaRepository <VideoAccess,Integer> {

}
