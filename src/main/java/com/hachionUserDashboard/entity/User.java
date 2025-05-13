////package com.hachionUserDashboard.entity;
////
////import jakarta.persistence.Entity;
////import jakarta.persistence.Id;
////import jakarta.persistence.Table;
////
////@Entity
////@Table(name = "USER_TBL")
////public class User {
////
////	@Id
////	private int id;
////	private String userName;
////	private String password;
////	private String email;
////
////	public User() {
////	}
////
////	public User(int id, String userName, String password, String email) {
////		this.id = id;
////		this.userName = userName;
////		this.password = password;
////		this.email = email;
////	}
////
////	public int getId() {
////		return id;
////	}
////
////	public void setId(int id) {
////		this.id = id;
////	}
////
////	public String getUserName() {
////		return userName;
////	}
////
////	public void setUserName(String userName) {
////		this.userName = userName;
////	}
////
////	public String getPassword() {
////		return password;
////	}
////
////	public void setPassword(String password) {
////		this.password = password;
////	}
////
////	public String getEmail() {
////		return email;
////	}
////
////	public void setEmail(String email) {
////		this.email = email;
////	}
////}
//
//
//package com.hachionUserDashboard.entity;
//
//import jakarta.persistence.Entity;
//import jakarta.persistence.GeneratedValue;
//import jakarta.persistence.GenerationType;
//import jakarta.persistence.Id;
//import jakarta.persistence.Table;
//
//@Entity
//@Table(name = "USER_TBL")
//public class User {
//
//    @Id
//    @GeneratedValue(strategy = GenerationType.IDENTITY)
//    private int id;
//    private String userName;  // This will be either the user's email or a specific username
//    private String password;  // Encrypted password
//    private String email;     // Email address
//
//    // Constructors
//    public User() {
//    }
//
//    public User(int id, String userName, String password, String email) {
//        this.id = id;
//        this.userName = userName;
//        this.password = password;
//        this.email = email;
//    }
//
//	public int getId() {
//		return id;
//	}
//
//	public void setId(int id) {
//		this.id = id;
//	}
//
//	public String getUserName() {
//		return userName;
//	}
//
//	public void setUserName(String userName) {
//		this.userName = userName;
//	}
//
//	public String getPassword() {
//		return password;
//	}
//
//	public void setPassword(String password) {
//		this.password = password;
//	}
//
//	public String getEmail() {
//		return email;
//	}
//
//	public void setEmail(String email) {
//		this.email = email;
//	}
//
//	public void setVerified(boolean b) {
//		// TODO Auto-generated method stub
//		
//	}
// 
//}

package com.hachionUserDashboard.entity;

import java.time.LocalDateTime;
import java.time.temporal.Temporal;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "user_tbl") // Replace with your actual table name
public class User {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

//	@Column(name = "first_name", nullable = false)
	private String firstName;
	
//	@Column(name = "last_name", nullable = false)
	private String lastName;
	
//    @Column(name = "user_name", nullable = false)
	private String userName;

	@Column(name = "email", nullable = false, unique = true)
	private String email;

	@Column(name = "student_id")
	private String studentId;

//    @Column(name = "mobile",nullable=true)
	private Long mobile;

//    @Column(name = "password", nullable = false)
	private String password;

	private String OTP;

	@Column(name = "otp_status")
	private boolean OTPStatus;

	public boolean isOTPStatus() {
		return OTPStatus;
	}

	public void setOTPStatus(boolean oTPStatus) {
		OTPStatus = oTPStatus;
	}

	public User() {

	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getUserName() {
		return userName;
	}

	public void setUserName(String userName) {
		this.userName = userName;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
	}

	public User(Long id, String userName, String email, Long mobile, String password, String oTP) {
		super();
		this.id = id;
		this.userName = userName;
		this.email = email;
		this.mobile = mobile;
		this.password = password;
		OTP = oTP;
	}

	public Long getMobile() {
		return mobile;
	}

	public void setMobile(Long mobile) {
		this.mobile = (long) mobile;
	}

	@Override
	public String toString() {
		return "User [id=" + id + ", userName=" + userName + ", email=" + email + ", mobile=" + mobile + ", password="
				+ password + ", OTP=" + OTP + "]";
	}

	public static void setActive(boolean active) {
		active = active;
	}

	public String getOTP() {
		return OTP;
	}

	public void setOTP(String oTP) {
		OTP = oTP;
	}

	public boolean isEmpty() {
		// TODO Auto-generated method stub
		return false;
	}

	public User get() {
		// TODO Auto-generated method stub
		return null;
	}

	public Temporal getOtpgeneratedTime() {
		// TODO Auto-generated method stub
		return null;
	}

	public void setOtpGeneratedTime(LocalDateTime now) {
		// TODO Auto-generated method stub

	}

	public User orElseThrow(Object object) {
		// TODO Auto-generated method stub
		return null;
	}

	public boolean isActive() {
		// TODO Auto-generated method stub
		return false;
	}

	public String getStudentId() {
		return studentId;
	}

	public void setStudentId(String studentId) {
		this.studentId = studentId;
	}

	public User(String userName, String email, Long mobile) {
		super();
		this.userName = userName;
		this.email = email;
		this.mobile = mobile;
	}
	
	

	public String getFirstName() {
		return firstName;
	}

	public void setFirstName(String firstName) {
		this.firstName = firstName;
	}

	public String getLastName() {
		return lastName;
	}

	public void setLastName(String lastName) {
		this.lastName = lastName;
	}
	

}
