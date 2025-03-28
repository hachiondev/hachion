package com.hachionUserDashboard.entity;

import java.time.LocalDate;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "banner")
public class Banner {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int banner_id;

    @Column
    private String banner_image;
    
    @Column
    private String home_banner_image;

    public String getHome_banner_image() {
		return home_banner_image;
	}

	public void setHome_banner_image(String home_banner_image) {
		this.home_banner_image = home_banner_image;
	}


    @Column(name = "date")  // Ensure the name matches your SQL column
    private LocalDate date;
    

    // Default constructor with default values
 
    // Getters and Setters
    public int getBanner_id() {
        return banner_id;
    }

    public void setBanner_id(int banner_id) {
        this.banner_id = banner_id;
    }

    public String getBanner_image() {
        return banner_image;
    }

    public void setBanner_image(String banner_image) {
        this.banner_image = banner_image;
    }

  

   

    public LocalDate getDate() {
        return date;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }

    @Override
	public String toString() {
		return "Banner [banner_id=" + banner_id + ", banner_image=" + banner_image + ", home_banner_image="
				+ home_banner_image + ", date=" + date + "]";
	}

	public Banner(int banner_id, String banner_image, String home_banner_image, String type, String amount_conversion,
			String country, String status, LocalDate date) {
		super();
		this.banner_id = banner_id;
		this.banner_image = banner_image;
		this.home_banner_image = home_banner_image;
		
		this.date = date;
	}
public Banner() {

}
    // Constructor with all fields

}
