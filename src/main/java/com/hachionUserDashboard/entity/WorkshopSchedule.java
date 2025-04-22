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
@Table(name = "workshopschedule")
public class WorkshopSchedule {


	@Id
	    @GeneratedValue(strategy = GenerationType.IDENTITY)
	    private int id;
	    
	 @Column
	    private String category_name;
	 
	    @Column
	    private String course_name;
	    
	    @Column
	    private String date;
	    
	    @Column
	    private String time;
	    
	    @Column
	    private String time_zone;
	    
	    @Column // Ensure the field is required
		private String banner_image; 
	    @Lob
		@Column(nullable = true, columnDefinition = "LONGTEXT")
	    private String content;
	    
	    @Lob
		@Column(nullable = true, columnDefinition = "LONGTEXT")
	    private String details;
	    
	    @Lob
	  		@Column(nullable = true, columnDefinition = "LONGTEXT")
	  	    private String meta_title;
	    
	    @Lob
	  		@Column(nullable = true, columnDefinition = "LONGTEXT")
	  	    private String meta_description;
	    
	    @Lob
  		@Column(nullable = true, columnDefinition = "LONGTEXT")
  	    private String meta_keyword;
    
	    
	    @Column(name = "created_date")  // Make sure the name matches your SQL column
	    private LocalDate created_date;
	    
	    public WorkshopSchedule() {
	    	
	    }

		public String getMeta_title() {
			return meta_title;
		}

		public void setMeta_title(String meta_title) {
			this.meta_title = meta_title;
		}

		public String getMeta_description() {
			return meta_description;
		}

		public void setMeta_description(String meta_description) {
			this.meta_description = meta_description;
		}

		public String getMeta_keyword() {
			return meta_keyword;
		}

		public void setMeta_keyword(String meta_keyword) {
			this.meta_keyword = meta_keyword;
		}

		public int getId() {
			return id;
		}

		public LocalDate getCreated_date() {
			return created_date;
		}

		public void setCreated_date(LocalDate created_date) {
			this.created_date = created_date;
		}

		public void setId(int id) {
			this.id = id;
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

		public String getContent() {
			return content;
		}

		public void setContent(String content) {
			this.content = content;
		}

		public String getDetails() {
			return details;
		}

		public void setDetails(String details) {
			this.details = details;
		}
		 public String getBanner_image() {
				return banner_image;
			}

			public void setBanner_image(String banner_image) {
				this.banner_image = banner_image;
			}

		public String getDate() {
			return date;
		}

		public void setDate(String date) {
			this.date = date;
		}

		public String getTime() {
			return time;
		}

		public void setTime(String time) {
			this.time = time;
		}

		public String getTime_zone() {
			return time_zone;
		}

		public void setTime_zone(String time_zone) {
			this.time_zone = time_zone;
		}

		@Override
		public String toString() {
			return "WorkshopSchedule [id=" + id + ", category_name=" + category_name + ", course_name=" + course_name
					+ ", date=" + date + ", time=" + time + ", time_zone=" + time_zone + ", banner_image="
					+ banner_image + ", content=" + content + ", details=" + details + ", meta_title=" + meta_title
					+ ", meta_description=" + meta_description + ", meta_keyword=" + meta_keyword + ", created_date="
					+ created_date + "]";
		}

		public WorkshopSchedule(int id, String category_name, String course_name, String date, String time,
				String time_zone, String banner_image, String content, String details, String meta_title,
				String meta_description, String meta_keyword, LocalDate created_date) {
			super();
			this.id = id;
			this.category_name = category_name;
			this.course_name = course_name;
			this.date = date;
			this.time = time;
			this.time_zone = time_zone;
			this.banner_image = banner_image;
			this.content = content;
			this.details = details;
			this.meta_title = meta_title;
			this.meta_description = meta_description;
			this.meta_keyword = meta_keyword;
			this.created_date = created_date;
		}

	

		
}
