package com.hachionUserDashboard.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "requestbatch")
public class RequestBatch {
	@Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int batch_id;
    
	@Column
    private String email;
	
	@Column
    private String mobile;
	
	@Column
    private String userName;
	
	@Column
    private String country;
	
	@Column
    private String course_name;
	
	@Column
    private String schedule_date;
	
	@Column
    private String time_zone;
	
	@Column
    private String mode;
	
public  RequestBatch() {
	
}

public int getBatch_id() {
	return batch_id;
}

public void setBatch_id(int batch_id) {
	this.batch_id = batch_id;
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

public String getCountry() {
	return country;
}

public void setCountry(String country) {
	this.country = country;
}

public String getCourse_name() {
	return course_name;
}

public void setCourse_name(String course_name) {
	this.course_name = course_name;
}

public String getSchedule_date() {
	return schedule_date;
}

public void setSchedule_date(String schedule_date) {
	this.schedule_date = schedule_date;
}

public String getTime_zone() {
	return time_zone;
}

public void setTime_zone(String time_zone) {
	this.time_zone = time_zone;
}

public String getMode() {
	return mode;
}

public void setMode(String mode) {
	this.mode = mode;
}

public String getUserName() {
	return userName;
}

public void setUserName(String userName) {
	this.userName = userName;
}

public RequestBatch(int batch_id, String email, String mobile, String userName, String country, String course_name,
		String schedule_date, String time_zone, String mode) {
	super();
	this.batch_id = batch_id;
	this.email = email;
	this.mobile = mobile;
	this.userName = userName;
	this.country = country;
	this.course_name = course_name;
	this.schedule_date = schedule_date;
	this.time_zone = time_zone;
	this.mode = mode;
}

@Override
public String toString() {
	return "RequestBatch [batch_id=" + batch_id + ", email=" + email + ", mobile=" + mobile + ", userName=" + userName
			+ ", country=" + country + ", course_name=" + course_name + ", schedule_date=" + schedule_date
			+ ", time_zone=" + time_zone + ", mode=" + mode + "]";
}


}
