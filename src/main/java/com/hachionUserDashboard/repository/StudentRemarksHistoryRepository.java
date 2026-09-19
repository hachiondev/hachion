package com.hachionUserDashboard.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.hachionUserDashboard.entity.RegisterStudent;
import com.hachionUserDashboard.entity.StudentRemarksHistory;

public interface StudentRemarksHistoryRepository extends JpaRepository<StudentRemarksHistory, Long> {

	@Query(value = "SELECT id, remark, call_made_on, final_remark, last_call_made_on, co_ordinator, created_at, call_status FROM student_remarks_history WHERE student_id = :studentId ORDER BY created_at DESC", nativeQuery = true)
	List<Object[]> findRemarksRaw(@Param("studentId") String studentId);

	@Query(value = "SELECT * FROM student_remarks_history WHERE student_id = :#{#student.studentId} ORDER BY id DESC", nativeQuery = true)
	List<StudentRemarksHistory> findByStudent(@Param("student") RegisterStudent student);

	@Query(value = "SELECT COALESCE(sr.remark) " + "FROM student_remarks_history sr "
			+ "JOIN registerstudent rs ON sr.student_id = rs.student_id " + "WHERE rs.email = :email "
			+ "ORDER BY sr.id  DESC LIMIT 1", nativeQuery = true)
	String findLatestRemarkByEmail(@Param("email") String email);
	
	@Query(value = "SELECT sr.co_ordinator FROM student_remarks_history sr " +
	        "WHERE sr.student_id = (SELECT student_id FROM registerstudent WHERE email = :email) " +
	        "ORDER BY sr.id DESC LIMIT 1", nativeQuery = true)
	String findLatestCoordinatorByEmail(@Param("email") String email);
}
