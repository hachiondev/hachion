package com.hachionUserDashboard.entity;


import java.time.LocalDate;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "curriculum")
public class Curriculum {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int curriculum_id;
    
    
    @Column
    private String category_name;
    
    @Column
    private String course_name;
    
    @Column
    private String curriculum_pdf;
    
    @Column
    private String title;
    
    @Column
    private String topic;
    
    
    @Column(name = "date")  // Make sure the name matches your SQL column
    private LocalDate date;

    public Curriculum() {
    }

	public Curriculum(int curriculum_id, String category_name, String course_name, String curriculum_pdf, String title,
			String topic, LocalDate date) {
		super();
		this.curriculum_id = curriculum_id;
		this.category_name = category_name;
		this.course_name = course_name;
		this.curriculum_pdf = curriculum_pdf;
		this.title = title;
		this.topic = topic;
		this.date = date;
	}


	public int getCurriculum_id() {
		return curriculum_id;
	}


	public void setCurriculum_id(int curriculum_id) {
		this.curriculum_id = curriculum_id;
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


	public String getCurriculum_pdf() {
		return curriculum_pdf;
	}


	public void setCurriculum_pdf(String curriculum_pdf) {
		this.curriculum_pdf = curriculum_pdf;
	}


	public String getTitle() {
		return title;
	}


	public void setTitle(String title) {
		this.title = title;
	}


	public String getTopic() {
		return topic;
	}


	public void setTopic(String topic) {
		this.topic = topic;
	}


	public LocalDate getDate() {
		return date;
	}


	public void setDate(LocalDate date) {
		this.date = date;
	}


	@Override
	public String toString() {
		return "Curriculum [curriculum_id=" + curriculum_id + ", category_name=" + category_name + ", course_name="
				+ course_name + ", curriculum_pdf=" + curriculum_pdf + ", title=" + title + ", topic=" + topic
				+ ", date=" + date + "]";
	}
    
}