package com.hachionUserDashboard.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "enroll")
public class Enroll {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column
    private String name;
    
    @Column
    private String email;
    

    @Column
    private String mobile;
    
    @Column
    private String course_name;
    
    @Column
    private String enroll_date;
    @Column
    private String week;
    
    @Column
    private String time;
    @Column
    private String amount;
    
    @Column
    private String mode;
    
    @Column
    private String type;
    
    @Column
    private String trainer;
    
    @Column
    private String completion_date;
    
    public Enroll() {
    	
    }

	public int getId() {
		return id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public String getMobile() {
		return mobile;
	}

	public void setMobile(String mobile) {
		this.mobile = mobile;
	}

	public String getCourse_name() {
		return course_name;
	}

	public void setCourse_name(String course_name) {
		this.course_name = course_name;
	}

	public String getEnroll_date() {
		return enroll_date;
	}

	public void setEnroll_date(String enroll_date) {
		this.enroll_date = enroll_date;
	}

	public String getWeek() {
		return week;
	}

	public void setWeek(String week) {
		this.week = week;
	}

	public String getTime() {
		return time;
	}

	public void setTime(String time) {
		this.time = time;
	}

	public String getAmount() {
		return amount;
	}

	public void setAmount(String amount) {
		this.amount = amount;
	}

	public String getMode() {
		return mode;
	}

	public void setMode(String mode) {
		this.mode = mode;
	}

	public String getType() {
		return type;
	}

	public void setType(String type) {
		this.type = type;
	}

	public String getTrainer() {
		return trainer;
	}

	public void setTrainer(String trainer) {
		this.trainer = trainer;
	}

	public String getCompletion_date() {
		return completion_date;
	}

	public void setCompletion_date(String completion_date) {
		this.completion_date = completion_date;
	}

	@Override
	public String toString() {
		return "Enroll [id=" + id + ", name=" + name + ", email=" + email + ", mobile=" + mobile + ", course_name="
				+ course_name + ", enroll_date=" + enroll_date + ", week=" + week + ", time=" + time + ", amount="
				+ amount + ", mode=" + mode + ", type=" + type + ", trainer=" + trainer + ", completion_date="
				+ completion_date + "]";
	}

	public Enroll(int id, String name, String email, String mobile, String course_name, String enroll_date, String week,
			String time, String amount, String mode, String type, String trainer, String completion_date) {
		super();
		this.id = id;
		this.name = name;
		this.email = email;
		this.mobile = mobile;
		this.course_name = course_name;
		this.enroll_date = enroll_date;
		this.week = week;
		this.time = time;
		this.amount = amount;
		this.mode = mode;
		this.type = type;
		this.trainer = trainer;
		this.completion_date = completion_date;
	}
    
    
    
    
    
    
    
    



}
