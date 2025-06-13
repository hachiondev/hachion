package com.hachionUserDashboard.entity;

import java.time.LocalDate;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "summerevents")
public class SummerEvents {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private int summerevents_id;

	@Column
	private String category_name;

	@Column
	private String course_name;

	@Column
	private boolean status;

	@Column(name = "date")
	private LocalDate date;

	public SummerEvents() {

	}

	public int getSummerevents_id() {
		return summerevents_id;
	}

	public void setSummerevents_id(int summerevents_id) {
		this.summerevents_id = summerevents_id;
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

	public SummerEvents(int summerevents_id, String category_name, String course_name, boolean status, LocalDate date) {
		super();
		this.summerevents_id = summerevents_id;
		this.category_name = category_name;
		this.course_name = course_name;
		this.status = status;
		this.date = date;
	}

	@Override
	public String toString() {
		return "SummerEvents [summerevents_id=" + summerevents_id + ", category_name=" + category_name
				+ ", course_name=" + course_name + ", status=" + status + ", date=" + date + "]";
	}

}
