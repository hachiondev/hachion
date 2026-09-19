package com.hachionUserDashboard.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.hachionUserDashboard.entity.LeadForm;

@Repository
public interface LeadFormRepository extends JpaRepository<LeadForm, Long> {

}
