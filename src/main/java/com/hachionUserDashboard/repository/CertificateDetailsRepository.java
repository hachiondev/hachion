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

//	@Query(value = "SELECT * FROM certificate_details WHERE student_id = :studentId AND course_name = :courseName AND completion_date = :completionDate LIMIT 1", nativeQuery = true)
//	Optional<CertificateEntity> findByStudentIdAndCourseNameAndCompletionDate(@Param("studentId") String studentId,
//	                                                                          @Param("courseName") String courseName,
//	                                                                          @Param("completionDate") String completionDate);

	@Query(value = "SELECT * FROM certificate_details WHERE student_id = :studentId AND course_name = :courseName LIMIT 1", nativeQuery = true)
	Optional<CertificateEntity> findByStudentIdAndCourseNameAndCompletionDate(@Param("studentId") String studentId,
			@Param("courseName") String courseName);

	@Query(value = "SELECT * FROM certificate_details WHERE LOWER(student_name) = LOWER(:studentName)", nativeQuery = true)
	List<CertificateEntity> findByStudentNameNative(@Param("studentName") String studentName);

	@Query(value = """
			SELECT
			  cd.certificate_id      AS id,
			  cd.course_name         AS courseName,
			  cd.grade               AS grade,
			    cd.completion_date   AS issueDate,
			  cd.certificate_path    AS certificatePath
			FROM certificate_details cd
			WHERE cd.student_email = :email
			ORDER BY cd.created_at DESC
			""", nativeQuery = true)
	List<CertificateRow> findAllByStudentEmail(@Param("email") String email);

	@Query(value = """
			SELECT COUNT(*)
			FROM certificate_details cd
			WHERE cd.student_email = :email
			""", nativeQuery = true)
	long countByStudentEmail(@Param("email") String email);

}
