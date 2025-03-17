package com.hachionUserDashboard.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.hachionUserDashboard.entity.Trainer;

@Repository
public interface TrainerRepository extends JpaRepository <Trainer,Integer>{

}
