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

	@Column
    private String type;

    @Column
    private String amount_conversion;

    @Column
    private String country;

    @Column
    private String status;

    @Column(name = "date")  // Ensure the name matches your SQL column
    private LocalDate date;
    

    // Default constructor with default values
    public Banner() {
        this.status = "disabled";  // Default status
        this.type = "amount conversion";  // Default type
    }

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

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getAmount_conversion() {
        return amount_conversion;
    }

    public void setAmount_conversion(String amount_conversion) {
        this.amount_conversion = amount_conversion;
    }

    public String getCountry() {
        return country;
    }

    public void setCountry(String country) {
        this.country = country;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
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
				+ home_banner_image + ", type=" + type + ", amount_conversion=" + amount_conversion + ", country="
				+ country + ", status=" + status + ", date=" + date + "]";
	}

	public Banner(int banner_id, String banner_image, String home_banner_image, String type, String amount_conversion,
			String country, String status, LocalDate date) {
		super();
		this.banner_id = banner_id;
		this.banner_image = banner_image;
		this.home_banner_image = home_banner_image;
		this.type = type;
		this.amount_conversion = amount_conversion;
		this.country = country;
		this.status = status;
		this.date = date;
	}

    // Constructor with all fields

}
