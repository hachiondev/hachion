package com.hachionUserDashboard.dto;

import java.time.LocalDate;

import com.hachionUserDashboard.entity.Trainer;

public class TrainerRequest {

	private int trainer_id;
	private String trainer_name;
	private String category_name;
	private String course_name;
	private String summary;
	private String demo_link_1;
	private String demo_link_2;
	private String demo_link_3;
	private Double trainerRating; // existing column value
	private LocalDate date;
	private Double trainerUserRating; // <<< computed value returned in JSON

	public int getTrainer_id() {
		return trainer_id;
	}

	public void setTrainer_id(int trainer_id) {
		this.trainer_id = trainer_id;
	}

	public String getTrainer_name() {
		return trainer_name;
	}

	public void setTrainer_name(String trainer_name) {
		this.trainer_name = trainer_name;
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

	public String getSummary() {
		return summary;
	}

	public void setSummary(String summary) {
		this.summary = summary;
	}

	public String getDemo_link_1() {
		return demo_link_1;
	}

	public void setDemo_link_1(String demo_link_1) {
		this.demo_link_1 = demo_link_1;
	}

	public String getDemo_link_2() {
		return demo_link_2;
	}

	public void setDemo_link_2(String demo_link_2) {
		this.demo_link_2 = demo_link_2;
	}

	public String getDemo_link_3() {
		return demo_link_3;
	}

	public void setDemo_link_3(String demo_link_3) {
		this.demo_link_3 = demo_link_3;
	}

	public Double getTrainerRating() {
		return trainerRating;
	}

	public void setTrainerRating(Double trainerRating) {
		this.trainerRating = trainerRating;
	}

	public LocalDate getDate() {
		return date;
	}

	public void setDate(LocalDate date) {
		this.date = date;
	}

	public Double getTrainerUserRating() {
		return trainerUserRating;
	}

	public void setTrainerUserRating(Double trainerUserRating) {
		this.trainerUserRating = trainerUserRating;
	}

	public static TrainerRequest from(Trainer t) {
		TrainerRequest d = new TrainerRequest();
		d.setTrainer_id(t.getTrainer_id());
		d.setTrainer_name(t.getTrainer_name());
		d.setCategory_name(t.getCategory_name());
		d.setCourse_name(t.getCourse_name());
		d.setSummary(t.getSummary());
		d.setDemo_link_1(t.getDemo_link_1());
		d.setDemo_link_2(t.getDemo_link_2());
		d.setDemo_link_3(t.getDemo_link_3());
		d.setTrainerRating(t.getTrainerRating());
		d.setDate(t.getDate());
		return d;
	}

}