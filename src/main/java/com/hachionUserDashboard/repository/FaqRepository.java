package com.hachionUserDashboard.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.hachionUserDashboard.entity.Faq;


@Repository
public interface FaqRepository extends JpaRepository <Faq,Integer>{

	@Query(value = "SELECT * FROM faq WHERE faq_pdf = :faqPdf", nativeQuery = true)
	Optional<Faq> findPdfByExactName(@Param("faqPdf") String faqPdf);

}
