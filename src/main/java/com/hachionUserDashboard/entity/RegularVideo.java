package com.hachionUserDashboard.entity;

import java.time.LocalDate;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;


@JsonIgnoreProperties(ignoreUnknown = true)
@Entity
@Table(name = "regularvideo")
public class RegularVideo {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int regularvideo_id;
    
    
    @Column
    private String category_name;
    
    @Column
    private String course_name;
    
    @Column
    private String video_link;
    
    @Column
    private String video_description;
    
    @Column
    private String video_duration;
    
    @Column
    private String week;
    @Column
    private String day;
    
    
    @Column(name = "date")  // Make sure the name matches your SQL column
    private LocalDate date;

    public RegularVideo() {
    	
    }

	public int getRegularvideo_id() {
		return regularvideo_id;
	}

	public void setRegularvideo_id(int regularvideo_id) {
		this.regularvideo_id = regularvideo_id;
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

	public String getVideo_link() {
		return video_link;
	}

	public void setVideo_link(String video_link) {
		this.video_link = video_link;
	}

	public String getVideo_description() {
		return video_description;
	}

	public void setVideo_description(String video_description) {
		this.video_description = video_description;
	}

	public String getVideo_duration() {
		return video_duration;
	}

	public void setVideo_duration(String video_duration) {
		this.video_duration = video_duration;
	}

	public String getWeek() {
		return week;
	}

	public void setWeek(String week) {
		this.week = week;
	}

	public String getDay() {
		return day;
	}

	public void setDay(String day) {
		this.day = day;
	}

	public LocalDate getDate() {
		return date;
	}

	public void setDate(LocalDate date) {
		this.date = date;
	}

	@Override
	public String toString() {
		return "RegularVideo [regularvideo_id=" + regularvideo_id + ", category_name=" + category_name
				+ ", course_name=" + course_name + ", video_link=" + video_link + ", video_description="
				+ video_description + ", video_duration=" + video_duration + ", week=" + week + ", day=" + day
				+ ", date=" + date + "]";
	}

	public RegularVideo(int regularvideo_id, String category_name, String course_name, String video_link,
			String video_description, String video_duration, String week, String day, LocalDate date) {
		super();
		this.regularvideo_id = regularvideo_id;
		this.category_name = category_name;
		this.course_name = course_name;
		this.video_link = video_link;
		this.video_description = video_description;
		this.video_duration = video_duration;
		this.week = week;
		this.day = day;
		this.date = date;
	}

	
    }
