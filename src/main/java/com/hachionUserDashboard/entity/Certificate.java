package com.hachionUserDashboard.entity;

import java.time.LocalDate;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "certificate")
public class Certificate {
	  @Id
	    @GeneratedValue(strategy = GenerationType.IDENTITY)
	    private int id;
	    
	    
	    @Column
	    private String category_name;
	    
	    @Column
	    private String course_name;
	    
	    @Column
	    private String title;
	    
	    @Column
	    private String certificate_image;
	    
	    @Column
	    private String description;
	    
	    
	    @Column(name = "date")  // Make sure the name matches your SQL column
	    private LocalDate date;
 public Certificate() {
	 
 }
public int getId() {
	return id;
}
public void setId(int id) {
	this.id = id;
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
public String getTitle() {
	return title;
}
public void setTitle(String title) {
	this.title = title;
}
public String getCertificate_image() {
	return certificate_image;
}
public void setCertificate_image(String certificate_image) {
	this.certificate_image = certificate_image;
}
public String getDescription() {
	return description;
}
public void setDescription(String description) {
	this.description = description;
}
public LocalDate getDate() {
	return date;
}
public void setDate(LocalDate date) {
	this.date = date;
}
@Override
public String toString() {
	return "Certificate [id=" + id + ", category_name=" + category_name + ", course_name=" + course_name + ", title="
			+ title + ", certificate_image=" + certificate_image + ", description=" + description + ", date=" + date
			+ "]";
}
public Certificate(int id, String category_name, String course_name, String title, String certificate_image,
		String description, LocalDate date) {
	super();
	this.id = id;
	this.category_name = category_name;
	this.course_name = course_name;
	this.title = title;
	this.certificate_image = certificate_image;
	this.description = description;
	this.date = date;
}
}
