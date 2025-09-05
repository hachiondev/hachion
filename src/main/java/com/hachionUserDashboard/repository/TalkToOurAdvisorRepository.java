package com.hachionUserDashboard.repository;

import java.io.Serializable;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.hachionUserDashboard.entity.TalkToOurAdvisor;

@Repository
public interface TalkToOurAdvisorRepository extends JpaRepository<TalkToOurAdvisor, Serializable> {

}
