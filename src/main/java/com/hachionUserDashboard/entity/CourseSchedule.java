package com.hachionUserDashboard.entity;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.util.Locale;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
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
	@Column
	private String meeting_link;

	public CourseSchedule() {
	}

	public CourseSchedule(String schedule_category_name, String schedule_course_name, String schedule_date,
			String schedule_week, String schedule_time, String schedule_duration, String schedule_mode,
			String trainer_name, String meeting_link) {
		this.schedule_category_name = schedule_category_name;
		this.schedule_course_name = schedule_course_name;
		this.schedule_date = schedule_date;
		this.schedule_week = schedule_week;
		this.schedule_time = schedule_time;
		this.schedule_duration = schedule_duration;
		this.schedule_mode = schedule_mode;
		this.trainer_name = trainer_name;
		this.meeting_link = meeting_link;
	}

	public String getMeeting_link() {
		return meeting_link;
	}

	public void setMeeting_link(String meeting_link) {
		this.meeting_link = meeting_link;
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
				+ trainer_name + ", created_date=" + created_date + ", meeting_link=" + meeting_link + "]";
	}

	@Column(name = "batch_id")
	private String batchId;

	@PrePersist
	public void generateBatchId() {
		String prefix = "";
		if (schedule_mode != null) {
			if (schedule_mode.equalsIgnoreCase("Live Demo")) {
				prefix = "LDEMO/";
			} else if (schedule_mode.equalsIgnoreCase("Live Class")) {
				prefix = "LCLASS/";
			}
		}

		String cat = schedule_category_name != null ? schedule_category_name.replaceAll("\\s", "") : "";
		String course = schedule_course_name != null ? schedule_course_name.replaceAll("\\s", "") : "";

		String categoryPart = cat.length() >= 2 ? cat.substring(0, 2).toUpperCase() : cat.toUpperCase();
		String coursePart = course.length() >= 5 ? course.substring(0, 5).toUpperCase() : course.toUpperCase();

		String dateFormatted = "";
		if (schedule_date != null) {
			try {
				LocalDate date = LocalDate.parse(schedule_date);
				dateFormatted = date.format(DateTimeFormatter.ofPattern("MMMddyyyy", Locale.ENGLISH)).toUpperCase(); // JUN052025
			} catch (DateTimeParseException e) {

			}
		}

//		String timePart = schedule_time != null ? schedule_time.toUpperCase() : "";
		String timePart = schedule_time != null ? schedule_time.replaceAll("\\s", "").toUpperCase() : "";

		this.batchId = prefix + categoryPart + coursePart + dateFormatted + "-" + timePart;
	}

	public String getBatchId() {
		return batchId;
	}

	public void setBatchId(String batchId) {
		this.batchId = batchId;
	}
	

}