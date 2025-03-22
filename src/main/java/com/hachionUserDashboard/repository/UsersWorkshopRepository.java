package com.hachionUserDashboard.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.hachionUserDashboard.entity.UsersWorkshop;

@Repository
public interface UsersWorkshopRepository extends JpaRepository<UsersWorkshop, Long> {

}
