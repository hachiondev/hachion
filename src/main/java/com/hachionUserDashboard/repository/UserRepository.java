////package com.hachionUserDashboard.repository;
////
////import com.hachionUserDashboard.entity.User;
////import org.springframework.data.jpa.repository.JpaRepository;
////
////import java.util.Optional;
////
////public interface UserRepository extends JpaRepository<User, Integer> {
////    Optional<User> findByEmail(String email);
////
////    User findByUserName(String userName);
////}
//


package com.hachionUserDashboard.repository;

import com.hachionUserDashboard.dto.UserRegistrationRequest;
import com.hachionUserDashboard.entity.User;

import org.springframework.data.jdbc.repository.query.Query;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {


	   User findByEmail(String email);

	    // Method to find a user by email and password
	    @Query("SELECT u FROM User u WHERE u.email = :email AND u.password = :password")
	    Optional<User> findOneByEmailAndPassword(@Param("email") String email, @Param("password") String password);
	
	
}
