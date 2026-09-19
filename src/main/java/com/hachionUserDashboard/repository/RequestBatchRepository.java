package com.hachionUserDashboard.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.hachionUserDashboard.entity.RequestBatch;
@Repository
public interface RequestBatchRepository extends JpaRepository <RequestBatch,Integer>{

}
