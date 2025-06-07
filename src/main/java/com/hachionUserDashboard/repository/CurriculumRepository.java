package com.hachionUserDashboard.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.hachionUserDashboard.entity.Curriculum;

@Repository
public interface CurriculumRepository extends JpaRepository<Curriculum, Integer> {

	@Query(value = "SELECT * FROM curriculum WHERE curriculum_pdf = :curriculumPdf", nativeQuery = true)
	Optional<Curriculum> findPdfByExactName(@Param("curriculumPdf") String curriculumPdf);

	@Query(value = "SELECT * FROM curriculum WHERE assessment_pdf = :assessmentPdf", nativeQuery = true)
	Optional<Curriculum> findPdfByAssessmentExactName(@Param("assessmentPdf") String assessmentPdf);

}
