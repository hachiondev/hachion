package com.hachionUserDashboard.entity;

import java.time.LocalDate;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "corporatecourse")
public class CorporateCourse {
	@Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int corporatecourse_id;
  
  @Column
    private String category_name;
    
    @Column
    private String course_name;
    
    @Column
    private boolean status;
    
    @Column(name = "date")  // Make sure the name matches your SQL column
    private LocalDate date;

    public CorporateCourse() {
    	
    }

	public int getCorporatecourse_id() {
		return corporatecourse_id;
	}

	public void setCorporatecourse_id(int corporatecourse_id) {
		this.corporatecourse_id = corporatecourse_id;
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

	public boolean isStatus() {
		return status;
	}

	public void setStatus(boolean status) {
		this.status = status;
	}

	public LocalDate getDate() {
		return date;
	}

	public void setDate(LocalDate date) {
		this.date = date;
	}

	@Override
	public String toString() {
		return "CorporateCourse [corporatecourse_id=" + corporatecourse_id + ", category_name=" + category_name
				+ ", course_name=" + course_name + ", status=" + status + ", date=" + date + "]";
	}

	public CorporateCourse(int corporatecourse_id, String category_name, String course_name, boolean status,
			LocalDate date) {
		super();
		this.corporatecourse_id = corporatecourse_id;
		this.category_name = category_name;
		this.course_name = course_name;
		this.status = status;
		this.date = date;
	}
}
