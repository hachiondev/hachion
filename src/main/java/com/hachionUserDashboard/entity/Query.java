package com.hachionUserDashboard.entity;

import java.time.LocalDate;

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
	
	 @Column(name = "date")  // Ensure the name matches your SQL column
	    private LocalDate date;
	 
	 @Column
	 private String country;
	
	
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



public String getCountry() {
	return country;
}



public void setCountry(String country) {
	this.country = country;
}



public LocalDate getDate() {
	return date;
}



public void setDate(LocalDate date) {
	this.date = date;
}



@Override
public String toString() {
	return "Query [id=" + id + ", name=" + name + ", email=" + email + ", mobile=" + mobile + ", comment=" + comment
			+ ", date=" + date + ", country=" + country + "]";
}



public Query(int id, String name, String email, String mobile, String comment, LocalDate date, String country) {
	super();
	this.id = id;
	this.name = name;
	this.email = email;
	this.mobile = mobile;
	this.comment = comment;
	this.date = date;
	this.country=country;
}




}