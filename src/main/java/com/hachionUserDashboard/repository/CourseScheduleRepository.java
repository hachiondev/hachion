package com.hachionUserDashboard.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.hachionUserDashboard.entity.CourseSchedule;

import jakarta.transaction.Transactional;

@Repository
public interface CourseScheduleRepository extends JpaRepository<CourseSchedule, Integer> {

	@Modifying
	@Transactional
	@Query(value = """
			    UPDATE schedule
			    SET is_active = FALSE
			    WHERE
			      (schedule_mode = 'Live Demo' AND
			       STR_TO_DATE(CONCAT(schedule_date, ' ', LOWER(schedule_time)), '%Y-%m-%d %h:%i %p')
			       < STR_TO_DATE(:currentDateTime, '%Y-%m-%d %h:%i %p'))
			      OR
			      (schedule_mode = 'Live Class' AND
			       DATE_ADD(STR_TO_DATE(schedule_date, '%Y-%m-%d'), INTERVAL 3 DAY)
			       < STR_TO_DATE(:currentDateTime, '%Y-%m-%d %h:%i %p'))
			""", nativeQuery = true)
	int disablePastWorkshops(@Param("currentDateTime") String currentDateTime);

	@Query(value = "SELECT DISTINCT schedule_course_name FROM schedule", nativeQuery = true)
	List<String> findAllCourseNames();

	@Query(value = "SELECT * FROM schedule WHERE is_active = true", nativeQuery = true)
	List<CourseSchedule> findAllActiveSchedules();

	@Query("SELECT COUNT(s), s.schedule_date FROM CourseSchedule s WHERE s.batchId = :batchId GROUP BY s.schedule_date")
	List<Object[]> findCountAndScheduleDateListByBatchId(@Param("batchId") String batchId);

	@Query("SELECT c.numberOfClasses FROM Course c JOIN CourseSchedule s ON c.courseName = s.schedule_course_name WHERE s.batchId = :batchId")
	String findNumberOfClassesByBatchId(@Param("batchId") String batchId);

	@Query(value = "SELECT batch_id FROM schedule WHERE batch_id = :batchId", nativeQuery = true)
	String findExactBatchId(@Param("batchId") String batchId);

	@Query(value = "SELECT is_active FROM schedule WHERE batch_id = :batchId LIMIT 1", nativeQuery = true)
	Boolean findIsActiveByBatchId(@Param("batchId") String batchId);

	@Query(value = "SELECT * FROM schedule " + "WHERE LOWER(schedule_course_name) = LOWER(:courseName) "
			+ "AND is_active = true " + "ORDER BY course_schedule_id DESC " + "LIMIT 1", nativeQuery = true)
	Optional<CourseSchedule> findTopActiveScheduleByCourseName(@Param("courseName") String courseName);

	@Query(value = "SELECT * FROM schedule WHERE is_active = true ORDER BY schedule_date ASC", nativeQuery = true)
	List<CourseSchedule> findAllByIsActiveTrue();

	@Query(value = "SELECT * FROM schedule WHERE is_active = true AND schedule_mode = :mode", nativeQuery = true)
	List<CourseSchedule> findAllByScheduleMode(@Param("mode") String mode);

	@Query(value = "SELECT * FROM schedule WHERE LOWER(schedule_course_name) = LOWER(:courseName) AND LOWER(schedule_mode) = LOWER(:scheduleMode) AND is_active = true", nativeQuery = true)
	List<CourseSchedule> findByCourseNameAndMode(@Param("courseName") String courseName,
			@Param("scheduleMode") String scheduleMode);

	@Query(value = """
			    SELECT batch_id
			    FROM schedule
			    WHERE schedule_course_name = :courseName
			      AND is_active = 1
			      AND batch_id LIKE 'LCL%'
			""", nativeQuery = true)
	List<String> findActiveBatchIdsByCourse(@Param("courseName") String courseName);

	@Query(value = "SELECT COUNT(*) FROM schedule WHERE schedule_category_name = :category AND schedule_course_name = :courseName AND is_active = true", nativeQuery = true)
	int countActiveSchedules(@Param("category") String category, @Param("courseName") String courseName);

//	@Query(value = "SELECT * FROM schedule WHERE meeting_link LIKE %:code%", nativeQuery = true)
//	CourseSchedule findByMeetingCode(@Param("code") String code);
	@Query(value = """
			    SELECT * FROM schedule
			    WHERE meeting_link LIKE %:code%
			    ORDER BY created_date DESC
			    LIMIT 1
			""", nativeQuery = true)
	CourseSchedule findByMeetingCode(@Param("code") String code);

	@Query("SELECT DISTINCT c.recordingsFolderId FROM CourseSchedule c WHERE c.recordingsFolderId IS NOT NULL")
	List<String> findDistinctFolderIds();

	@Query(value = "SELECT * FROM schedule WHERE batch_id = :batchId AND schedule_course_name = :courseName LIMIT 1", nativeQuery = true)
	CourseSchedule findByBatchIdAndScheduleCourseName(@Param("batchId") String batchId,
			@Param("courseName") String courseName);

//	@Query(value = """
//			SELECT DISTINCT batch_id
//			FROM schedule
//			WHERE schedule_category_name = :categoryName
//			AND schedule_course_name = :courseName
//			AND STR_TO_DATE(schedule_date, '%Y-%m-%d')
//			BETWEEN DATE_SUB(CURDATE(), INTERVAL :months MONTH)
//			AND CURDATE()
//			""", nativeQuery = true)
//	List<String> getBatchIdsByDuration(@Param("categoryName") String categoryName,
//			@Param("courseName") String courseName, @Param("months") int months);
	
	@Query(value = """
		    SELECT DISTINCT batch_id
		    FROM schedule
		    WHERE schedule_category_name = :categoryName
		    AND schedule_course_name = :courseName
		    AND STR_TO_DATE(schedule_date, '%Y-%m-%d')
		    BETWEEN
		        CASE
		            WHEN :months = 12
		            THEN DATE_FORMAT(CURDATE(), '%Y-01-01')

		            ELSE DATE_FORMAT(
		                DATE_SUB(CURDATE(), INTERVAL (:months - 1) MONTH),
		                '%Y-%m-01'
		            )
		        END
		    AND
		        CASE
		            WHEN :months = 12
		            THEN DATE_FORMAT(CURDATE(), '%Y-12-31')

		            ELSE LAST_DAY(CURDATE())
		        END
		    """, nativeQuery = true)
		List<String> getBatchIdsByDuration(
		        @Param("categoryName") String categoryName,
		        @Param("courseName") String courseName,
		        @Param("months") int months);

	@Query(value = """
			SELECT *
			FROM schedule
			WHERE schedule_course_name = :courseName
			AND batch_id = :batchId

			LIMIT 1
			""", nativeQuery = true)
	CourseSchedule getScheduleDetails(@Param("courseName") String courseName, @Param("batchId") String batchId);
	
	@Query(value = """
			SELECT COUNT(*) 
			FROM schedule 
			WHERE schedule_category_name = :categoryName
			AND schedule_course_name = :courseName
			AND schedule_date = :scheduleDate
			AND schedule_time = :scheduleTime
			AND schedule_mode = :scheduleMode
			""", nativeQuery = true)
	long checkScheduleAlreadyExists(
			@Param("categoryName") String categoryName,
			@Param("courseName") String courseName,
			@Param("scheduleDate") String scheduleDate,
			@Param("scheduleTime") String scheduleTime,
			@Param("scheduleMode") String scheduleMode);

}