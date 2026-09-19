//////package com.hachionUserDashboard.repository;
//////
//////import com.hachionUserDashboard.entity.User;
//////import org.springframework.data.jpa.repository.JpaRepository;
//////
//////import java.util.Optional;
//////
//////public interface UserRepository extends JpaRepository<User, Integer> {
//////    Optional<User> findByEmail(String email);
//////
//////    User findByUserName(String userName);
//////}
////
//
//package com.hachionUserDashboard.repository;
//
//import java.util.List;
//import java.util.Optional;
//
//import org.springframework.data.jpa.repository.Modifying;
//import org.springframework.data.jpa.repository.Query;
//import org.springframework.data.repository.ListCrudRepository;
//import org.springframework.data.repository.query.Param;
//import org.springframework.stereotype.Repository;
//import org.springframework.transaction.annotation.Transactional;
//
//import com.hachionUserDashboard.entity.User;
//
//@Repository
//public interface UserRepository extends ListCrudRepository<User, Long> {
//
//	User findByEmail(String email);
//	
//	@Query("SELECT u FROM User u WHERE u.email = :email")
//	Optional<User> findByEmailForProfile(String email);
//
//	@Query("SELECT u FROM User u WHERE u.email = :email")
//	Optional<User> findBYEmailForOauth(@Param("email") String email);
//
//	@Query("SELECT u FROM User u WHERE u.email = :email AND u.password = :password")
//	Optional<User> findOneByEmailAndPassword(@Param("email") String email, @Param("password") String password);
//
//	@Modifying
//	@Transactional
//	@Query(value = "DELETE FROM user_tbl WHERE otp_status = false", nativeQuery = true)
//	int deleteExpiredOtps();
//
//	@Query(value = "SELECT student_id FROM user_tbl WHERE student_id IS NOT NULL ORDER BY LENGTH(student_id) DESC, student_id DESC LIMIT 1", nativeQuery = true)
//	String findTopByOrderByStudentIdDesc();
//
////	@Query(value = "SELECT u.user_name AS userName, u.student_id AS studentId, u.email " + "FROM user_tbl u "
////			+ "JOIN enroll e ON u.user_name = e.name " + "WHERE e.course_name = :courseName", nativeQuery = true)
////	List<Object[]> findUsersByCourseName(@Param("courseName") String courseName);
//
//	@Query(value = "SELECT name, student_id, email FROM enroll WHERE course_name = :courseName", nativeQuery = true)
//	List<Object[]> findUsersByCourseName(@Param("courseName") String courseName);
//	
//	@Query(value = "SELECT user_name, email FROM user_tbl WHERE student_id = :studentId", nativeQuery = true)
//	List<Object[]> findUserNameEmailByStudentId(@Param("studentId") String studentId);
//
//	@Query(value = "SELECT student_id, email FROM user_tbl WHERE user_name = :userName", nativeQuery = true)
//	List<Object[]> findStudentIdEmailByUserName(@Param("userName") String userName);
//
//	@Query(value = "SELECT e.completion_date " +
//            "FROM user_tbl u " +
//            "JOIN enroll e ON u.user_name = e.name " +
//            "WHERE e.course_name = :courseName AND u.user_name = :userName", nativeQuery = true)
//String findCompletionDateByCourseAndUser(@Param("courseName") String courseName,
//                                       @Param("userName") String userName);
//
//}
