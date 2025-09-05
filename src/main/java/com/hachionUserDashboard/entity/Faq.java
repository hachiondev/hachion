package com.hachionUserDashboard.entity;

import java.time.LocalDate;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Lob;
import jakarta.persistence.Table;

@Entity
@Table(name = "faq")
public class Faq {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private int faq_id;

	@Column
	private String category_name;

	@Column
	private String course_name;

	@Column
	private String faq_pdf;

	@Lob
	@Column(nullable = true, columnDefinition = "LONGTEXT")
	private String faq_title;

	@Lob
	@Column(nullable = true, columnDefinition = "LONGTEXT")
	private String description;

	@Column(name = "date") // Make sure the name matches your SQL column
	private LocalDate date;

	public Faq() {

	}

	public Faq(int faq_id, String category_name, String course_name, String faq_pdf, String faq_title,
			String description, LocalDate date) {
		super();
		this.faq_id = faq_id;
		this.category_name = category_name;
		this.course_name = course_name;
		this.faq_pdf = faq_pdf;
		this.faq_title = faq_title;
		this.description = description;
		this.date = date;
	}

	public int getFaq_id() {
		return faq_id;
	}

	public void setFaq_id(int faq_id) {
		this.faq_id = faq_id;
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

	public String getFaq_pdf() {
		return faq_pdf;
	}

	public void setFaq_pdf(String faq_pdf) {
		this.faq_pdf = faq_pdf;
	}

	public String getFaq_title() {
		return faq_title;
	}

	public void setFaq_title(String faq_title) {
		this.faq_title = faq_title;
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
		return "Faq [faq_id=" + faq_id + ", category_name=" + category_name + ", course_name=" + course_name
				+ ", faq_pdf=" + faq_pdf + ", faq_title=" + faq_title + ", description=" + description + ", date="
				+ date + "]";
	}
}