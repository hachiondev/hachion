package com.hachionUserDashboard.entity;


import java.time.LocalDate;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Lob;
import jakarta.persistence.Table;

@JsonIgnoreProperties(ignoreUnknown = true)
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
    private String assessment_pdf;
    
    @Lob
	@Column(nullable = true, columnDefinition = "LONGTEXT")
    private String title;
    
    @Lob
	@Column(nullable = true, columnDefinition = "LONGTEXT")
    private String topic;
    
    @Column
    private String link;
    
    
    public String getLink() {
		return link;
	}

	public void setLink(String link) {
		this.link = link;
	}


	@Column(name = "date")  // Make sure the name matches your SQL column
    private LocalDate date;

    public Curriculum() {
    }

	public Curriculum(int curriculum_id, String category_name, String course_name, String curriculum_pdf, String title,String link,
			String topic, LocalDate date) {
		super();
		this.curriculum_id = curriculum_id;
		this.category_name = category_name;
		this.course_name = course_name;
		this.curriculum_pdf = curriculum_pdf;
		this.title = title;
		this.link=link;
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
				+ ", link=" + link + ", date=" + date + "]";
	}

	public void setCurriculum_pdf(byte[] bytes) {
		// TODO Auto-generated method stub
		
	}

	public String getAssessment_pdf() {
		return assessment_pdf;
	}

	public void setAssessment_pdf(String assessment_pdf) {
		this.assessment_pdf = assessment_pdf;
	}
    
}