package com.hachionUserDashboard.entity;

import java.time.LocalDate;
import java.util.Arrays;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Lob;
import jakarta.persistence.Table;

@Entity
@Table(name = "review")
public class Review {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int review_id;
    
    
    @Column
    private String category_name;
    
    @Column
    private String course_name;
    
    @Column
    private String student_name;
    
    @Lob
    private byte[] Image; 
    
    @Column
    private String source;
    
    @Column
    private String comment;
    
    
    
    @Column(name = "date")  // Make sure the name matches your SQL column
    private LocalDate date;

    public Review() {
    	
    }

	public int getReview_id() {
		return review_id;
	}

	public void setReview_id(int review_id) {
		this.review_id = review_id;
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

	public String getStudent_name() {
		return student_name;
	}

	public void setStudent_name(String student_name) {
		this.student_name = student_name;
	}

	public byte[] getImage() {
		return Image;
	}

	public void setImage(byte[] image) {
		Image = image;
	}

	public String getSource() {
		return source;
	}

	public void setSource(String source) {
		this.source = source;
	}

	public String getComment() {
		return comment;
	}

	public void setComment(String comment) {
		this.comment = comment;
	}

	public LocalDate getDate() {
		return date;
	}

	public void setDate(LocalDate date) {
		this.date = date;
	}

	public Review(int review_id, String category_name, String course_name, String student_name, byte[] image,
			String source, String comment, LocalDate date) {
		super();
		this.review_id = review_id;
		this.category_name = category_name;
		this.course_name = course_name;
		this.student_name = student_name;
		Image = image;
		this.source = source;
		this.comment = comment;
		this.date = date;
	}

	@Override
	public String toString() {
		return "Review [review_id=" + review_id + ", category_name=" + category_name + ", course_name=" + course_name
				+ ", student_name=" + student_name + ", Image=" + Arrays.toString(Image) + ", source=" + source
				+ ", comment=" + comment + ", date=" + date + "]";
	}

}