package com.hachionUserDashboard.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.hachionUserDashboard.entity.Faq;


@Repository
public interface FaqRepository extends JpaRepository <Faq,Integer>{

}
