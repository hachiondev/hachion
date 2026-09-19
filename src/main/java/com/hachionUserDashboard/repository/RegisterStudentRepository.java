package com.hachionUserDashboard.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import com.hachionUserDashboard.entity.RegisterStudent;

public interface RegisterStudentRepository extends JpaRepository<RegisterStudent, Long> {

	RegisterStudent findByEmail(String email);

	@Query("SELECT u FROM RegisterStudent u WHERE u.email = :email")
	Optional<RegisterStudent> findByEmailForProfile(String email);

	@Query("SELECT COUNT(u) > 0 FROM RegisterStudent u WHERE u.email = :email")
	boolean existsByEmail(@Param("email") String email);

	@Query("SELECT COUNT(u) > 0 FROM RegisterStudent u WHERE u.mobile = :mobile")
	boolean existsByMobile(@Param("mobile") String mobile);

	@Query("SELECT u FROM RegisterStudent u WHERE u.email = :email")
	Optional<RegisterStudent> findBYEmailForOauth(@Param("email") String email);

	@Query("SELECT u FROM RegisterStudent u WHERE u.email = :email AND u.password = :password")
	Optional<RegisterStudent> findOneByEmailAndPassword(@Param("email") String email,
			@Param("password") String password);

	@Modifying
	@Transactional
	@Query(value = "DELETE FROM registerstudent WHERE otp_status = false", nativeQuery = true)
	int deleteExpiredOtps();

	@Query(value = "SELECT student_id FROM registerstudent WHERE student_id IS NOT NULL ORDER BY LENGTH(student_id) DESC, student_id DESC LIMIT 1", nativeQuery = true)
	String findTopByOrderByStudentIdDesc();

	@Query(value = "SELECT name, student_id, email FROM enroll WHERE course_name = :courseName", nativeQuery = true)
	List<Object[]> findUsersByCourseName(@Param("courseName") String courseName);

	@Query(value = "SELECT name, email FROM enroll WHERE student_id = :studentId", nativeQuery = true)
	List<Object[]> findUserNameEmailByStudentId(@Param("studentId") String studentId);

	@Query(value = "SELECT student_id, email FROM enroll WHERE name = :userName", nativeQuery = true)
	List<Object[]> findStudentIdEmailByUserName(@Param("userName") String userName);

	@Query(value = "SELECT e.completion_date " + "FROM enroll e "
			+ "WHERE e.course_name = :courseName AND e.name = :userName", nativeQuery = true)
	String findCompletionDateByCourseAndUser(@Param("courseName") String courseName,
			@Param("userName") String userName);

	@Query(value = "SELECT * FROM registerstudent WHERE status IS NULL OR status <> 'DELETED' ORDER BY date DESC", nativeQuery = true)
	List<RegisterStudent> findAllOrderByDateDescNative();

	@Query(value = "SELECT * FROM registerstudent WHERE student_id = :studentId", nativeQuery = true)
	Optional<RegisterStudent> findByStudentId(@Param("studentId") String studentId);

//	@Modifying
//	@Transactional
//	@Query(value = "DELETE FROM registerstudent WHERE email = :email", nativeQuery = true)
//	void deleteByEmailNative(@Param("email") String email);

	@Modifying
	@Transactional
	@Query(value = "UPDATE registerstudent SET status = 'DISABLED' WHERE LOWER(email) = LOWER(:email)", nativeQuery = true)
	void disableByEmailNative(@Param("email") String email);

	@Query(value = "SELECT COUNT(*) FROM registerstudent WHERE mobile = :mobile", nativeQuery = true)
	int countByMobile(@Param("mobile") String mobile);

	@Query("SELECT r FROM RegisterStudent r WHERE r.email = :email AND r.status = :status")
	Optional<RegisterStudent> findByEmailAndSignupStatus(@Param("email") String email, @Param("status") String status);

	@Modifying
	@Transactional
	@Query(value = "UPDATE registerstudent " + "SET facebook = :facebook, " + "    twitter = :twitter, "
			+ "    linkedin = :linkedin, " + "    website = :website, " + "    github = :github "
			+ "WHERE email = :email", nativeQuery = true)
	int updateSocialLinksByEmailQuery(@Param("email") String email, @Param("facebook") String facebook,
			@Param("twitter") String twitter, @Param("linkedin") String linkedin, @Param("website") String website,
			@Param("github") String github);

	Optional<RegisterStudent> getByEmail(String email);

	@Query("SELECT r.email FROM RegisterStudent r")
	List<String> findAllEmails();

	boolean existsByStudentId(String studentId);

	@Query(value = """
			SELECT
			    rs.id,
			    rs.student_id,
			    rs.email,
			    rs.course_name,
			    rs.mobile,
			    rs.whatsapp,
			    rs.user_name,
			    rs.country,
			     rs.location,      
    rs.visa_status, 
			    rs.state_city,
			    rs.coordinator,
			    rs.lead_status,
			    rs.lead_tag,
			    rs.date,

			    sr.remark,
			    sr.call_made_on,
			    sr.last_call_made_on,
			    sr.co_ordinator,

			    rs.mode,
			    rs.time_zone,
			    rs.analyst_name,
			    rs.source,
			    rs.seo_team,
			    rs.status,
			    rs.last_email_sent_at

			FROM registerstudent rs

			LEFT JOIN (
			    SELECT *,
			           ROW_NUMBER() OVER (
			               PARTITION BY student_id
			               ORDER BY created_at DESC, id DESC
			           ) AS rn
			    FROM student_remarks_history
			) sr
			ON rs.student_id = sr.student_id AND sr.rn = 1

			WHERE rs.status IS NULL OR rs.status <> 'DELETED'

			ORDER BY rs.date DESC
			""", nativeQuery = true)
	List<Object[]> getStudentsWithRemarks();

	@Query(value = """
			    SELECT
			        rs.user_name AS name,
			        rs.course_name AS course,
			        rs.lead_tag AS leadTag,
			        rs.lead_status AS leadStatus,
			        srh.last_call_made_on AS lastCallMadeOn,
			        srh.co_ordinator AS coordinator

			    FROM registerstudent rs
			    LEFT JOIN student_remarks_history srh
			        ON srh.student_id = rs.student_id
			        AND srh.id = (
			            SELECT MAX(s2.id)
			            FROM student_remarks_history s2
			            WHERE s2.student_id = rs.student_id
			        )
			""", nativeQuery = true)
	List<Object[]> getLeadDashboardData();

	@Query("SELECT DISTINCT r.leadTag FROM RegisterStudent r WHERE r.leadTag IS NOT NULL AND TRIM(r.leadTag) <> ''")
	List<String> findDistinctLeadTags();

	@Query("SELECT DISTINCT r.leadStatus FROM RegisterStudent r WHERE r.leadStatus IS NOT NULL AND TRIM(r.leadStatus) <> ''")
	List<String> findDistinctLeadStatus();

	@Query(value = "SELECT status FROM registerstudent WHERE email = :email", nativeQuery = true)
	String findStatusByEmail(@Param("email") String email);

	@Query(value = """
			SELECT user_name, status
			FROM registerstudent
			WHERE email = :email
			LIMIT 1
			""", nativeQuery = true)
	List<Object[]> findUserNameAndStatusByEmail(@Param("email") String email);

	@Query(value = """
			SELECT DISTINCT time_zone
			FROM registerstudent
			WHERE time_zone IS NOT NULL
			AND time_zone != ''
			ORDER BY time_zone ASC
			""", nativeQuery = true)
	List<String> findAllTimeZones();

	@Query(value = """
			SELECT *
			FROM registerstudent
			WHERE email = :email
			LIMIT 1
			""", nativeQuery = true)
	Optional<RegisterStudent> getStudentByEmail(@Param("email") String email);

	@Query("SELECT DISTINCT r.seoTeam FROM RegisterStudent r WHERE r.seoTeam IS NOT NULL AND r.seoTeam <> ''")
	List<String> getDistinctSeoTeams();
}
