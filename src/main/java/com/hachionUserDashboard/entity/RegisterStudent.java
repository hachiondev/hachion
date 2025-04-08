package com.hachionUserDashboard.entity;

import java.time.LocalDate;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "registerstudent")
public class RegisterStudent {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int student_id;
    
    
    @Column
    private String name;
    
    @Column
    private String email;
    
    @Column
    private String mobile;
    
    @Column
    private String country;
    
    @Column
    private String location;
    @Column
    private String visa_status;
    @Column
    private String time_zone;
    @Column
    private String analyst_name;
    @Column
    private String source;
    @Column
    private String remarks;
    @Column
    private String comments;
    @Column
    private String send_details;
    @Column(nullable = true)
    private String additional_email;

    @Column(nullable = true)
    private Integer additional_phone;

    @Column(nullable = true)
    private String password;

    @Column
    private String course_name;

    
    public RegisterStudent(String password) {
		super();
		this.password = password;
	}

	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
	}

	public RegisterStudent(String additional_email, int additional_phone, String course_name) {
		super();
		this.additional_email = additional_email;
		this.additional_phone = additional_phone;
		this.course_name=course_name;
	}

	public String getAdditional_email() {
		return additional_email;
	}

	public void setAdditional_email(String additional_email) {
		this.additional_email = additional_email;
	}

	public int getAdditional_phone() {
		return additional_phone;
	}

	public void setAdditional_phone(int additional_phone) {
		this.additional_phone = additional_phone;
	}

	@Column(name = "date")  // Make sure the name matches your SQL column
    private LocalDate date;
    
    public RegisterStudent() {
    	
    }

	public RegisterStudent(int student_id, String name, String email, String mobile, String country, String location,
			String visa_status, String time_zone, String analyst_name, String source, String remarks, String comments,
			String send_details, LocalDate date) {
		super();
		this.student_id = student_id;
		this.name = name;
		this.email = email;
		this.mobile = mobile;
		this.country = country;
		this.location = location;
		this.visa_status = visa_status;
		this.time_zone = time_zone;
		this.analyst_name = analyst_name;
		this.source = source;
		this.remarks = remarks;
		this.comments = comments;
		this.send_details = send_details;
		this.date = date;
	}

	public int getStudent_id() {
		return student_id;
	}

	public void setStudent_id(int student_id) {
		this.student_id = student_id;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public String getMobile() {
		return mobile;
	}

	public void setMobile(String mobile) {
		this.mobile = mobile;
	}

	public String getCourse_name() {
		return course_name;
	}

	public void setCourse_name(String course_name) {
		this.course_name = course_name;
	}

	public String getCountry() {
		return country;
	}

	public void setCountry(String country) {
		this.country = country;
	}

	public String getLocation() {
		return location;
	}

	public void setLocation(String location) {
		this.location = location;
	}


	public String getVisa_status() {
		return visa_status;
	}

	public void setVisa_status(String visa_status) {
		this.visa_status = visa_status;
	}

	public String getTime_zone() {
		return time_zone;
	}

	public void setTime_zone(String time_zone) {
		this.time_zone = time_zone;
	}

	public String getAnalyst_name() {
		return analyst_name;
	}

	public void setAnalyst_name(String analyst_name) {
		this.analyst_name = analyst_name;
	}

	public String getSource() {
		return source;
	}

	public void setSource(String source) {
		this.source = source;
	}

	public String getRemarks() {
		return remarks;
	}

	public void setRemarks(String remarks) {
		this.remarks = remarks;
	}

	public String getComments() {
		return comments;
	}

	public void setComments(String comments) {
		this.comments = comments;
	}

	public String getSend_details() {
		return send_details;
	}

	public void setSend_details(String send_details) {
		this.send_details = send_details;
	}

	public LocalDate getDate() {
		return date;
	}

	public void setDate(LocalDate date) {
		this.date = date;
	}

	@Override
	public String toString() {
		return "RegisterStudent [student_id=" + student_id + ", name=" + name + ", email=" + email + ", mobile="
				+ mobile + ", country=" + country + ", location=" + location + ", visa_status=" + visa_status
				+ ", time_zone=" + time_zone + ", analyst_name=" + analyst_name + ", source=" + source + ", remarks="
				+ remarks + ", comments=" + comments + ", send_details=" + send_details + ", additional_email="
				+ additional_email + ", additional_phone=" + additional_phone + ", course_name=" + course_name
				+ ", password=" + password + ", date=" + date + "]";
	}
}
