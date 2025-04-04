package com.hachionUserDashboard.repository;

import org.springframework.data.jpa.repository.JpaRepository;


import com.hachionUserDashboard.entity.WorkshopSchedule;

public interface WorkshopScheduleRepository extends JpaRepository <WorkshopSchedule,Integer> {

}
