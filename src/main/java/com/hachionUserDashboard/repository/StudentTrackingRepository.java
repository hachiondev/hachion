package com.hachionUserDashboard.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.hachionUserDashboard.entity.StudentTracking;

@Repository
public interface StudentTrackingRepository extends JpaRepository<StudentTracking, Long> {

}
