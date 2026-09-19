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
@Table(name = "support")
public class Support {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int support_id;
    
    
    @Column
    private String name;
    
    @Column
    private String email;
    
    @Column
    private int mobile;
    

    
    @Column
    private String password;
    
    @Column
    private String address;
    
    
    
    @Column(name = "date")  // Make sure the name matches your SQL column
    private LocalDate date;

    public Support() {
    	
    }

	public int getSupport_id() {
		return support_id;
	}

	public void setSupport_id(int support_id) {
		this.support_id = support_id;
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

	public int getMobile() {
		return mobile;
	}

	public void setMobile(int mobile) {
		this.mobile = mobile;
	}

	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
	}

	public String getAddress() {
		return address;
	}

	public void setAddress(String address) {
		this.address = address;
	}

	public LocalDate getDate() {
		return date;
	}

	public void setDate(LocalDate date) {
		this.date = date;
	}

	public Support(int support_id, String name, String email, int mobile, String password, String address,
			LocalDate date) {
		super();
		this.support_id = support_id;
		this.name = name;
		this.email = email;
		this.mobile = mobile;
		this.password = password;
		this.address = address;
		this.date = date;
	}

	@Override
	public String toString() {
		return "Support [support_id=" + support_id + ", name=" + name + ", email=" + email + ", mobile=" + mobile
				+ ", password=" + password + ", address=" + address + ", date=" + date + "]";
	}

	}