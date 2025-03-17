package com.hachionUserDashboard.entity;

import java.time.LocalDate;
import java.util.Arrays;

import jakarta.persistence.*;

@Entity
@Table(name = "course")
public class Course {
	   @Id
	    @GeneratedValue(strategy = GenerationType.IDENTITY)
	    private int id;
	
	    @Column
	    private String courseName;
	    
	    
	    @Lob
	    private String courseImage; 
	    
	    @Column
	    private String youtubeLink;
	    
	    @Column
	    private String numberOfClasses;
	    
	    @Column
	    private String dailySessions;
	    
	    @Column
	    private String liveTrainingHours;
	    
	    @Column
	    private String labExerciseHours;
	    
	    @Column
	    private String realTimeProjects;
	    @Column
	    private int starRating;
	    @Column
	    private int ratingByNumberOfPeople;
	    @Column
	    private int totalEnrollment;
	  
	    @Column
	    private String keyHighlights1 ;
	    @Column
	    private String keyHighlights2;
	    @Column
	    private String keyHighlights3;
	    @Column
	    private String keyHighlights4;
	    @Column
	    private String keyHighlights5;
	    @Column
	    private String keyHighlights6;
	    @Column
	    private Double amount;
	    @Column
	    private Double discount;
	    @Column
	    private Double total;
	    @Column
	    private String mentoring1;
	    @Column
	    private String mentoring2;
	    @Column
	    private String self1;
	    @Column
	    private String self2;
	    @Column
	    private String headerTitle;
	    @Column
	    private String courseKeyword;
	    @Column
	    private String courseKeywordDescription;
	    @Column
	    private String courseHighlight;
	    @Column
	    private String courseDescription;
	    
	    
	    @Column(name = "date")  
	    private LocalDate date;
	    
	    @Column
	    private String courseCategory;
	    
    public Course() {
    }

	public int getId() {
		return id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public String getCourseName() {
		return courseName;
	}

	public void setCourseName(String courseName) {
		this.courseName = courseName;
	}

	public String getCourseImage() {
		return courseImage;
	}

	public void setCourseImage(String courseImage) {
		this.courseImage = courseImage;
	}

	public String getYoutubeLink() {
		return youtubeLink;
	}

	public void setYoutubeLink(String youtubeLink) {
		this.youtubeLink = youtubeLink;
	}

	public String getNumberOfClasses() {
		return numberOfClasses;
	}

	public void setNumberOfClasses(String numberOfClasses) {
		this.numberOfClasses = numberOfClasses;
	}

	public String getDailySessions() {
		return dailySessions;
	}

	public void setDailySessions(String dailySessions) {
		this.dailySessions = dailySessions;
	}

	public String getLiveTrainingHours() {
		return liveTrainingHours;
	}

	public void setLiveTrainingHours(String liveTrainingHours) {
		this.liveTrainingHours = liveTrainingHours;
	}

	public String getLabExerciseHours() {
		return labExerciseHours;
	}

	public void setLabExerciseHours(String labExerciseHours) {
		this.labExerciseHours = labExerciseHours;
	}

	public String getRealTimeProjects() {
		return realTimeProjects;
	}

	public void setRealTimeProjects(String realTimeProjects) {
		this.realTimeProjects = realTimeProjects;
	}

	public int getStarRating() {
		return starRating;
	}

	public void setStarRating(int starRating) {
		this.starRating = starRating;
	}

	public int getRatingByNumberOfPeople() {
		return ratingByNumberOfPeople;
	}

	public void setRatingByNumberOfPeople(int ratingByNumberOfPeople) {
		this.ratingByNumberOfPeople = ratingByNumberOfPeople;
	}

	public int getTotalEnrollment() {
		return totalEnrollment;
	}

	public void setTotalEnrollment(int totalEnrollment) {
		this.totalEnrollment = totalEnrollment;
	}

	public String getKeyHighlights1() {
		return keyHighlights1;
	}

	public void setKeyHighlights1(String keyHighlights1) {
		this.keyHighlights1 = keyHighlights1;
	}

	public String getKeyHighlights2() {
		return keyHighlights2;
	}

	public void setKeyHighlights2(String keyHighlights2) {
		this.keyHighlights2 = keyHighlights2;
	}

	public String getKeyHighlights3() {
		return keyHighlights3;
	}

	public void setKeyHighlights3(String keyHighlights3) {
		this.keyHighlights3 = keyHighlights3;
	}

	public String getKeyHighlights4() {
		return keyHighlights4;
	}

	public void setKeyHighlights4(String keyHighlights4) {
		this.keyHighlights4 = keyHighlights4;
	}

	public String getKeyHighlights5() {
		return keyHighlights5;
	}

	public void setKeyHighlights5(String keyHighlights5) {
		this.keyHighlights5 = keyHighlights5;
	}

	public String getKeyHighlights6() {
		return keyHighlights6;
	}

	public void setKeyHighlights6(String keyHighlights6) {
		this.keyHighlights6 = keyHighlights6;
	}

	public Double getAmount() {
		return amount;
	}

	public void setAmount(Double amount) {
		this.amount = amount;
	}

	public Double getDiscount() {
		return discount;
	}

	public void setDiscount(Double discount) {
		this.discount = discount;
	}

	public Double getTotal() {
		return total;
	}

	public void setTotal(Double total) {
		this.total = total;
	}

	public String getMentoring1() {
		return mentoring1;
	}

	public void setMentoring1(String mentoring1) {
		this.mentoring1 = mentoring1;
	}

	public String getMentoring2() {
		return mentoring2;
	}

	public void setMentoring2(String mentoring2) {
		this.mentoring2 = mentoring2;
	}

	public String getSelf1() {
		return self1;
	}

	public void setSelf1(String self1) {
		this.self1 = self1;
	}

	public String getSelf2() {
		return self2;
	}

	public void setSelf2(String self2) {
		this.self2 = self2;
	}

	public String getHeaderTitle() {
		return headerTitle;
	}

	public void setHeaderTitle(String headerTitle) {
		this.headerTitle = headerTitle;
	}

	public String getCourseKeyword() {
		return courseKeyword;
	}

	public void setCourseKeyword(String courseKeyword) {
		this.courseKeyword = courseKeyword;
	}

	public String getCourseKeywordDescription() {
		return courseKeywordDescription;
	}

	public void setCourseKeywordDescription(String courseKeywordDescription) {
		this.courseKeywordDescription = courseKeywordDescription;
	}

	public String getCourseHighlight() {
		return courseHighlight;
	}

	public void setCourseHighlight(String courseHighlight) {
		this.courseHighlight = courseHighlight;
	}

	public String getCourseDescription() {
		return courseDescription;
	}

	public void setCourseDescription(String courseDescription) {
		this.courseDescription = courseDescription;
	}

	public LocalDate getDate() {
		return date;
	}

	public void setDate(LocalDate date) {
		this.date = date;
	}

	public String getCourseCategory() {
		return courseCategory;
	}

	public void setCourseCategory(String courseCategory) {
		this.courseCategory = courseCategory;
	}

	public Course(int id, String courseName, String courseImage, String youtubeLink, String numberOfClasses,
			String dailySessions, String liveTrainingHours, String labExerciseHours, String realTimeProjects,
			int starRating, int ratingByNumberOfPeople, int totalEnrollment, String keyHighlights1,
			String keyHighlights2, String keyHighlights3, String keyHighlights4, String keyHighlights5,
			String keyHighlights6, Double amount, Double discount, Double total, String mentoring1, String mentoring2,
			String self1, String self2, String headerTitle, String courseKeyword, String courseKeywordDescription,
			String courseHighlight, String courseDescription, LocalDate date, String courseCategory) {
		super();
		this.id = id;
		this.courseName = courseName;
		this.courseImage = courseImage;
		this.youtubeLink = youtubeLink;
		this.numberOfClasses = numberOfClasses;
		this.dailySessions = dailySessions;
		this.liveTrainingHours = liveTrainingHours;
		this.labExerciseHours = labExerciseHours;
		this.realTimeProjects = realTimeProjects;
		this.starRating = starRating;
		this.ratingByNumberOfPeople = ratingByNumberOfPeople;
		this.totalEnrollment = totalEnrollment;
		this.keyHighlights1 = keyHighlights1;
		this.keyHighlights2 = keyHighlights2;
		this.keyHighlights3 = keyHighlights3;
		this.keyHighlights4 = keyHighlights4;
		this.keyHighlights5 = keyHighlights5;
		this.keyHighlights6 = keyHighlights6;
		this.amount = amount;
		this.discount = discount;
		this.total = total;
		this.mentoring1 = mentoring1;
		this.mentoring2 = mentoring2;
		this.self1 = self1;
		this.self2 = self2;
		this.headerTitle = headerTitle;
		this.courseKeyword = courseKeyword;
		this.courseKeywordDescription = courseKeywordDescription;
		this.courseHighlight = courseHighlight;
		this.courseDescription = courseDescription;
		this.date = date;
		this.courseCategory = courseCategory;
	}

	@Override
	public String toString() {
		return "Course [id=" + id + ", courseName=" + courseName + ", courseImage=" + courseImage + ", youtubeLink="
				+ youtubeLink + ", numberOfClasses=" + numberOfClasses + ", dailySessions=" + dailySessions
				+ ", liveTrainingHours=" + liveTrainingHours + ", labExerciseHours=" + labExerciseHours
				+ ", realTimeProjects=" + realTimeProjects + ", starRating=" + starRating + ", ratingByNumberOfPeople="
				+ ratingByNumberOfPeople + ", totalEnrollment=" + totalEnrollment + ", keyHighlights1=" + keyHighlights1
				+ ", keyHighlights2=" + keyHighlights2 + ", keyHighlights3=" + keyHighlights3 + ", keyHighlights4="
				+ keyHighlights4 + ", keyHighlights5=" + keyHighlights5 + ", keyHighlights6=" + keyHighlights6
				+ ", amount=" + amount + ", discount=" + discount + ", total=" + total + ", mentoring1=" + mentoring1
				+ ", mentoring2=" + mentoring2 + ", self1=" + self1 + ", self2=" + self2 + ", headerTitle="
				+ headerTitle + ", courseKeyword=" + courseKeyword + ", courseKeywordDescription="
				+ courseKeywordDescription + ", courseHighlight=" + courseHighlight + ", courseDescription="
				+ courseDescription + ", date=" + date + ", courseCategory=" + courseCategory + "]";
	}
	
	

	
    
}
