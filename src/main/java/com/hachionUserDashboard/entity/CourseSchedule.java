package com.hachionUserDashboard.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "schedule")
public class CourseSchedule {
	   @Id
	    @GeneratedValue(strategy = GenerationType.IDENTITY)
	    private int course_schedule_id;
	
	    @Column
	    private String schedule_category_name;
	    
	    @Column
	    private String schedule_course_name;
	    
	    @Column
	    private String schedule_date;
	    
	    @Column
	    private String schedule_week;
	    
	    @Column
	    private String schedule_time;
	    
	    @Column
	    private String schedule_duration;
	    
	    @Column
	    private String schedule_mode;
	    @Column
	    private String trainer_name;
	    @Column
	    private String created_date;
	    



public CourseSchedule() {
}

public CourseSchedule(String schedule_category_name, String schedule_course_name, String schedule_date, String schedule_week, String schedule_time,
               String schedule_duration, String schedule_mode,String trainer_name) {
    this.schedule_category_name = schedule_category_name;
    this.schedule_course_name = schedule_course_name;
    this.schedule_date =schedule_date;
    this.schedule_week = schedule_week;
    this.schedule_time = schedule_time;
    this.schedule_duration= schedule_duration;
    this.schedule_mode = schedule_mode;
    this.trainer_name = trainer_name;
}

public int getCourse_schedule_id() {
	return course_schedule_id;
}

public void setCourse_schedule_id(int course_schedule_id) {
	this.course_schedule_id = course_schedule_id;
}

public String getSchedule_category_name() {
	return schedule_category_name;
}

public void setSchedule_category_name(String schedule_category_name) {
	this.schedule_category_name = schedule_category_name;
}

public String getSchedule_course_name() {
	return schedule_course_name;
}

public void setSchedule_course_name(String schedule_course_name) {
	this.schedule_course_name = schedule_course_name;
}

public String getSchedule_date() {
	return schedule_date;
}

public void setSchedule_date(String schedule_date) {
	this.schedule_date = schedule_date;
}

public String getSchedule_week() {
	return schedule_week;
}

public void setSchedule_week(String schedule_week) {
	this.schedule_week = schedule_week;
}

public String getSchedule_time() {
	return schedule_time;
}

public void setSchedule_time(String schedule_time) {
	this.schedule_time = schedule_time;
}

public String getSchedule_duration() {
	return schedule_duration;
}

public void setSchedule_duration(String schedule_duration) {
	this.schedule_duration = schedule_duration;
}

public String getSchedule_mode() {
	return schedule_mode;
}

public void setSchedule_mode(String schedule_mode) {
	this.schedule_mode = schedule_mode;
}

public String getTrainer_name() {
	return trainer_name;
}

public void setTrainer_name(String trainer_name) {
	this.trainer_name = trainer_name;
}

public String getCreated_date() {
	return created_date;
}

public void setCreated_date(String created_date) {
	this.created_date = created_date;
}



@Override
public String toString() {
	return "CourseSchedule [course_schedule_id=" + course_schedule_id + ", schedule_category_name="
			+ schedule_category_name + ", schedule_course_name=" + schedule_course_name + ", schedule_date="
			+ schedule_date + ", schedule_week=" + schedule_week + ", schedule_time=" + schedule_time
			+ ", schedule_duration=" + schedule_duration + ", schedule_mode=" + schedule_mode + ", trainer_name="
			+ trainer_name + ", created_date=" + created_date + "]";
}


}