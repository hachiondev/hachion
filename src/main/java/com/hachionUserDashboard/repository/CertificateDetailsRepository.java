package com.hachionUserDashboard.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.hachionUserDashboard.entity.CertificateEntity;

public interface CertificateDetailsRepository extends JpaRepository<CertificateEntity, Long> {

	@Query(value = "SELECT * FROM certificate_details WHERE certificate_id = :certificateId", nativeQuery = true)
	CertificateEntity findByCertificateId(@Param("certificateId") Long certificateId);

	Optional<CertificateEntity> findById(Long certificateId);
	
	@Query(value = "SELECT * FROM certificate_details WHERE student_id = :studentId AND course_name = :courseName AND completion_date = :completionDate LIMIT 1", nativeQuery = true)
	Optional<CertificateEntity> findByStudentIdAndCourseNameAndCompletionDate(@Param("studentId") String studentId,
	                                                                          @Param("courseName") String courseName,
	                                                                          @Param("completionDate") String completionDate);
	@Query(value = "SELECT * FROM certificate_details WHERE LOWER(student_name) = LOWER(:studentName)", nativeQuery = true)
	List<CertificateEntity> findByStudentNameNative(@Param("studentName") String studentName);


	
}

