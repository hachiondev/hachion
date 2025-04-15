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
	private int starRating;
	@Column
	private int ratingByNumberOfPeople;
	@Column
	private int totalEnrollment;

	@Column
	private String keyHighlights1;
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
	private Double mamount;
	@Column
	private Double mdiscount;
	@Column
	private Double mtotal;
	@Column
	private Double samount;
	@Column
	private Double sdiscount;
	@Column
	private Double stotal;
	@Column
	private Double camount;
	@Column
	private Double cdiscount;
	@Column
	private Double ctotal;

	public Double getMamount() {
		return mamount;
	}

	public void setMamount(Double mamount) {
		this.mamount = mamount;
	}

	public Double getMdiscount() {
		return mdiscount;
	}

	public void setMdiscount(Double mdiscount) {
		this.mdiscount = mdiscount;
	}

	public Double getMtotal() {
		return mtotal;
	}

	public void setMtotal(Double mtotal) {
		this.mtotal = mtotal;
	}

	public Double getSamount() {
		return samount;
	}

	public void setSamount(Double samount) {
		this.samount = samount;
	}

	public Double getSdiscount() {
		return sdiscount;
	}

	public void setSdiscount(Double sdiscount) {
		this.sdiscount = sdiscount;
	}

	public Double getStotal() {
		return stotal;
	}

	public void setStotal(Double stotal) {
		this.stotal = stotal;
	}

	public Double getCamount() {
		return camount;
	}

	public void setCamount(Double camount) {
		this.camount = camount;
	}

	public Double getCdiscount() {
		return cdiscount;
	}

	public void setCdiscount(Double cdiscount) {
		this.cdiscount = cdiscount;
	}

	public Double getCtotal() {
		return ctotal;
	}

	public void setCtotal(Double ctotal) {
		this.ctotal = ctotal;
	}

	@Column
	private String mentoring1;
	@Column
	private String mentoring2;
	@Column
	private String self1;
	@Column
	private String self2;

	@Lob
	@Column(nullable = true, columnDefinition = "LONGTEXT")
	private String metaTitle;

	@Lob
	@Column(nullable = true, columnDefinition = "LONGTEXT")
	private String metaKeyword;

	@Lob
	@Column(nullable = true, columnDefinition = "LONGTEXT")
	private String metaDescription;

	@Lob
	@Column(columnDefinition = "LONGTEXT")
	private String courseHighlight;

	@Lob
	@Column(name = "course_description", nullable = true, columnDefinition = "LONGTEXT")
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

	public String getMetaTitle() {
		return metaTitle;
	}

	public void setMetaTitle(String metaTitle) {
		this.metaTitle = metaTitle;
	}

	public String getMetaKeyword() {
		return metaKeyword;
	}

	public void setMetaKeyword(String metaKeyword) {
		this.metaKeyword = metaKeyword;
	}

	public String getMetaDescription() {
		return metaDescription;
	}

	public void setMetaDescription(String metaDescription) {
		this.metaDescription = metaDescription;
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
			String dailySessions, int starRating, int ratingByNumberOfPeople, int totalEnrollment,
			String keyHighlights1, String keyHighlights2, String keyHighlights3, String keyHighlights4,
			String keyHighlights5, String keyHighlights6, Double amount, Double discount, Double total, Double mamount,
			Double mdiscount, Double mtotal, Double samount, Double sdiscount, Double stotal, Double camount,
			Double cdiscount, Double ctotal, String mentoring1, String mentoring2, String self1, String self2,
			String metaTitle, String metaKeyword, String metaDescription, String courseHighlight,
			String courseDescription, LocalDate date, String courseCategory) {
		super();
		this.id = id;
		this.courseName = courseName;
		this.courseImage = courseImage;
		this.youtubeLink = youtubeLink;
		this.numberOfClasses = numberOfClasses;
		this.dailySessions = dailySessions;

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
		this.mamount = mamount;
		this.mdiscount = mdiscount;
		this.mtotal = mtotal;
		this.samount = samount;
		this.sdiscount = sdiscount;
		this.stotal = stotal;
		this.camount = camount;
		this.cdiscount = cdiscount;
		this.ctotal = ctotal;
		this.mentoring1 = mentoring1;
		this.mentoring2 = mentoring2;
		this.self1 = self1;
		this.self2 = self2;
		this.metaTitle = metaTitle;
		this.metaKeyword = metaKeyword;
		this.metaDescription = metaDescription;
		this.courseHighlight = courseHighlight;
		this.courseDescription = courseDescription;
		this.date = date;
		this.courseCategory = courseCategory;
	}

	@Override
	public String toString() {
		return "Course [id=" + id + ", courseName=" + courseName + ", courseImage=" + courseImage + ", youtubeLink="
				+ youtubeLink + ", numberOfClasses=" + numberOfClasses + ", dailySessions=" + dailySessions
				+ ", starRating=" + starRating + ", ratingByNumberOfPeople=" + ratingByNumberOfPeople
				+ ", totalEnrollment=" + totalEnrollment + ", keyHighlights1=" + keyHighlights1 + ", keyHighlights2="
				+ keyHighlights2 + ", keyHighlights3=" + keyHighlights3 + ", keyHighlights4=" + keyHighlights4
				+ ", keyHighlights5=" + keyHighlights5 + ", keyHighlights6=" + keyHighlights6 + ", amount=" + amount
				+ ", discount=" + discount + ", total=" + total + ", mamount=" + mamount + ", mdiscount=" + mdiscount
				+ ", mtotal=" + mtotal + ", samount=" + samount + ", sdiscount=" + sdiscount + ", stotal=" + stotal
				+ ", camount=" + camount + ", cdiscount=" + cdiscount + ", ctotal=" + ctotal + ", mentoring1="
				+ mentoring1 + ", mentoring2=" + mentoring2 + ", self1=" + self1 + ", self2=" + self2 + ", metaTitle="
				+ metaTitle + ", metaKeyword=" + metaKeyword + ", metaDescription=" + metaDescription
				+ ", courseHighlight=" + courseHighlight + ", courseDescription=" + courseDescription + ", date=" + date
				+ ", courseCategory=" + courseCategory + "]";
	}

}
