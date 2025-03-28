package com.hachionUserDashboard.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "haveanyquery")
public class Query {
	@Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;
    
	@Column
    private String name;
	
	@Column
    private String email;
	
	@Column
    private String mobile;
	
	@Column
    private String comment;
	
	
	
public  Query() {
	
}



public int getId() {
	return id;
}



public void setId(int id) {
	this.id = id;
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



public String getComment() {
	return comment;
}



public void setComment(String comment) {
	this.comment = comment;
}



@Override
public String toString() {
	return "Query [id=" + id + ", name=" + name + ", email=" + email + ", mobile=" + mobile + ", comment=" + comment
			+ "]";
}



public Query(int id, String name, String email, String mobile, String comment) {
	super();
	this.id = id;
	this.name = name;
	this.email = email;
	this.mobile = mobile;
	this.comment = comment;
}
}