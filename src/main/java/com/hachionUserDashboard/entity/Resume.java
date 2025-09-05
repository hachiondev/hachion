package com.hachionUserDashboard.entity;

import java.time.LocalDate;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "resume")
public class Resume {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int resume_id;
    
    
    @Column
    private String category_name;
    
    @Column
    private String course_name;
    
    @Column
    private String junior_level;
    
    @Column
    private String middle_level;
    
    @Column
    private String senior_level;
    
    
    
    @Column(name = "date")  // Make sure the name matches your SQL column
    private LocalDate date;

    public Resume() {
    	
    }

	public int getResume_id() {
		return resume_id;
	}

	public void setResume_id(int resume_id) {
		this.resume_id = resume_id;
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

	public String getJunior_level() {
		return junior_level;
	}

	public void setJunior_level(String junior_level) {
		this.junior_level = junior_level;
	}

	public String getMiddle_level() {
		return middle_level;
	}

	public void setMiddle_level(String middle_level) {
		this.middle_level = middle_level;
	}

	public String getSenior_level() {
		return senior_level;
	}

	public void setSenior_level(String senior_level) {
		this.senior_level = senior_level;
	}

	public LocalDate getDate() {
		return date;
	}

	public void setDate(LocalDate date) {
		this.date = date;
	}

	public Resume(int resume_id, String category_name, String course_name, String junior_level, String middle_level,
			String senior_level, LocalDate date) {
		super();
		this.resume_id = resume_id;
		this.category_name = category_name;
		this.course_name = course_name;
		this.junior_level = junior_level;
		this.middle_level = middle_level;
		this.senior_level = senior_level;
		this.date = date;
	}

	@Override
	public String toString() {
		return "Resume [resume_id=" + resume_id + ", category_name=" + category_name + ", course_name=" + course_name
				+ ", junior_level=" + junior_level + ", middle_level=" + middle_level + ", senior_level=" + senior_level
				+ ", date=" + date + "]";
	}
}