package com.hachionUserDashboard.entity;

import java.time.LocalDate;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "trendingcourse")
public class TrendingCourse {
	  @Id
	    @GeneratedValue(strategy = GenerationType.IDENTITY)
	    private int trendingcourse_id;
	  
	  @Column
	    private String category_name;
	    
	    @Column
	    private String course_name;
	    
	    @Column
	    private boolean status;
	    
	    @Column(name = "date")  // Make sure the name matches your SQL column
	    private LocalDate date;
	 
	    public TrendingCourse() {
	    	
	    }

		public int getTrendingcourse_id() {
			return trendingcourse_id;
		}

		public void setTrendingcourse_id(int trendingcourse_id) {
			this.trendingcourse_id = trendingcourse_id;
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

		public TrendingCourse(int trendingcourse_id, String category_name, String course_name, boolean status,
				LocalDate date) {
			super();
			this.trendingcourse_id = trendingcourse_id;
			this.category_name = category_name;
			this.course_name = course_name;
			this.status = status;
			this.date = date;
		}

		@Override
		public String toString() {
			return "TrendingCourse [trendingcourse_id=" + trendingcourse_id + ", category_name=" + category_name
					+ ", course_name=" + course_name + ", status=" + status + ", date=" + date + "]";
		}


		
}
