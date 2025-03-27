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
@Table(name = "userreview")
public class UserReview {
	  @Id
	    @GeneratedValue(strategy = GenerationType.IDENTITY)
	    private int review_id;
	    
	    
	    @Column
	    private String name;
	    
	    @Column
	    private String email;
	    
	    @Lob
	    private String user_image; 
	    
	    public UserReview(String user_image) {
			super();
			this.user_image = user_image;
		}

		public String getUser_image() {
			return user_image;
		}

		public void setUser_image(String user_image) {
			this.user_image = user_image;
		}

		@Column
	    private String type;
	    
	    @Column
	    private String course_name;
	    
	    @Column
	    private String trainer_name;
	    
	    @Column
	    private String social_id;
	    
	    @Column
	    private int rating;
	    
	    @Column
	    private String review;
	    
	    @Column
	    private String location;
	    
	    
	    @Column(name = "date")  // Make sure the name matches your SQL column
	    private LocalDate date;

	    public UserReview() {
	    }

		public int getReview_id() {
			return review_id;
		}

		public void setReview_id(int review_id) {
			this.review_id = review_id;
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

		public String getLocation() {
			return location;
		}

		public void setLocation(String location) {
			this.location = location;
		}

		public String getType() {
			return type;
		}

		public void setType(String type) {
			this.type = type;
		}

		public String getCourse_name() {
			return course_name;
		}

		public void setCourse_name(String course_name) {
			this.course_name = course_name;
		}

		public String getTrainer_name() {
			return trainer_name;
		}

		public void setTrainer_name(String trainer_name) {
			this.trainer_name = trainer_name;
		}

		public String getSocial_id() {
			return social_id;
		}

		public void setSocial_id(String social_id) {
			this.social_id = social_id;
		}

		public int getRating() {
			return rating;
		}

		public void setRating(int rating) {
			this.rating = rating;
		}

		public String getReview() {
			return review;
		}

		public void setReview(String review) {
			this.review = review;
		}

		public LocalDate getDate() {
			return date;
		}

		public void setDate(LocalDate date) {
			this.date = date;
		}

		public UserReview(int review_id, String name, String email, String type, String course_name,String location,
				String trainer_name, String social_id, int rating, String review, LocalDate date) {
			super();
			this.review_id = review_id;
			this.name = name;
			this.email = email;
			this.location=location;
			this.type = type;
			this.course_name = course_name;
			this.trainer_name = trainer_name;
			this.social_id = social_id;
			this.rating = rating;
			this.review = review;
			this.date = date;
		}

		@Override
		public String toString() {
			return "UserReview [review_id=" + review_id + ", name=" + name + ", email=" + email + ", user_image="
					+ user_image + ", type=" + type + ", course_name=" + course_name + ", trainer_name=" + trainer_name
					+ ", social_id=" + social_id + ", rating=" + rating + ", review=" + review + ", location="
					+ location + ", date=" + date + "]";
		}
	    
}
