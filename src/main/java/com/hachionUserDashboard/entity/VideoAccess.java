package com.hachionUserDashboard.entity;


import java.time.LocalDate;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "videoaccess")
public class VideoAccess {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int videoaccess_id;
    
    
    @Column
    private String category_name;
    
    @Column
    private String course_name;
    
    @Column
    private String user_email;
    
    @Column
    private String description;
    
    @Column
    private boolean permission;
    
   @Column
   private String trainer_name;
    
    @Column(name = "date")  // Make sure the name matches your SQL column
    private LocalDate date;
    
public VideoAccess() {
    	
    }

public int getVideoaccess_id() {
	return videoaccess_id;
}

public void setVideoaccess_id(int videoaccess_id) {
	this.videoaccess_id = videoaccess_id;
}

public String getCategory_name() {
	return category_name;
}

public void setCategory_name(String category_name) {
	this.category_name = category_name;
}

public String getCourse_name() {
	return course_name;
}

public void setCourse_name(String course_name) {
	this.course_name = course_name;
}

public String getUser_email() {
	return user_email;
}

public void setUser_email(String user_email) {
	this.user_email = user_email;
}

public String getDescription() {
	return description;
}

public void setDescription(String description) {
	this.description = description;
}

public boolean getPermission() {
	return permission;
}

public void setPermission(boolean permission) {
	this.permission = permission;
}

public String getTrainer_name() {
	return trainer_name;
}

public void setTrainer_name(String trainer_name) {
	this.trainer_name = trainer_name;
}

public LocalDate getDate() {
	return date;
}

public void setDate(LocalDate date) {
	this.date = date;
}

@Override
public String toString() {
	return "VideoAccess [videoaccess_id=" + videoaccess_id + ", category_name=" + category_name + ", course_name="
			+ course_name + ", user_email=" + user_email + ", description=" + description + ", permission=" + permission
			+ ", trainer_name=" + trainer_name + ", date=" + date + "]";
}

public VideoAccess(int videoaccess_id, String category_name, String course_name, String user_email, String description,
		boolean permission, String trainer_name, LocalDate date) {
	super();
	this.videoaccess_id = videoaccess_id;
	this.category_name = category_name;
	this.course_name = course_name;
	this.user_email = user_email;
	this.description = description;
	this.permission = permission;
	this.trainer_name = trainer_name;
	this.date = date;
}


}