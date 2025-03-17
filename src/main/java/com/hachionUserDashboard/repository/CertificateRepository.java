package com.hachionUserDashboard.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.hachionUserDashboard.entity.Blogs;
import com.hachionUserDashboard.entity.Certificate;

public interface CertificateRepository extends JpaRepository <Certificate,Integer> {

}
