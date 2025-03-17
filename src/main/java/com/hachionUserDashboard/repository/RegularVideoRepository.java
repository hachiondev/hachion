package com.hachionUserDashboard.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.hachionUserDashboard.entity.RegularVideo;



@Repository
public interface RegularVideoRepository extends JpaRepository <RegularVideo,Integer> {

}
