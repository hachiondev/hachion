package com.hachionUserDashboard.entity;

import java.time.LocalDate;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Lob;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;

@JsonIgnoreProperties(ignoreUnknown = true)
@Entity
@Table(name = "course", uniqueConstraints = { @UniqueConstraint(columnNames = { "course_category", "course_name" }) })
public class Course {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private int id;

	@Column(nullable = false)
	private String courseName;

	@Column(name = "seo_h1_title", nullable = false)
	private String seoH1Title;

	@Column(name = "course_category", nullable = false)
	private String courseCategory;
	@Lob
	private String courseImage;

	@Column
	private String youtubeLink;

	@Column(nullable = false)
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

	@Column(nullable = false)
	private Double amount;
	@Column(nullable = false)
	private Double discount;

	@Column(nullable = false)
	private Double total;

	@Column(nullable = false)
	private Double mamount;

	@Column(nullable = false)
	private Double mdiscount;

	@Column(nullable = false)
	private Double mtotal;

	@Column(nullable = false)
	private Double samount;

	@Column(nullable = false)
	private Double sdiscount;

	@Column(nullable = false)
	private Double stotal;

	@Column(nullable = false)
	private Double sqamount;

	@Column(nullable = false)
	private Double sqdiscount;

	@Column(nullable = false)
	private Double sqtotal;

	@Column(nullable = false)
	private Double camount;

	@Column(nullable = false)
	private Double cdiscount;

	@Column(nullable = false)
	private Double ctotal;

	// new columns for india location

	@Column(nullable = false)
	private Double iamount;

	@Column(nullable = false)
	private Double idiscount;

	@Column(nullable = false)
	private Double itotal;

	@Column(nullable = false)
	private Double imamount;

	@Column(nullable = false)
	private Double imdiscount;

	@Column(nullable = false)
	private Double imtotal;

	@Column(nullable = false)
	private Double isamount;

	@Column(nullable = false)
	private Double isdiscount;

	@Column(nullable = false)
	private Double istotal;

	@Column(nullable = false)
	private Double isqamount;

	@Column(nullable = false)
	private Double isqdiscount;

	@Column(nullable = false)
	private Double isqtotal;

	@Column(nullable = false)
	private Double icamount;

	@Column(nullable = false)
	private Double icdiscount;

	@Column(nullable = false)
	private Double ictotal;

	@Column(nullable = false)
	private String shortCourse;

	@Column(columnDefinition = "LONGTEXT")
	private String aboutCourse;

	@Column(nullable = false)
	private int numberOfProjects;

	@Column(columnDefinition = "LONGTEXT")
	private String whatYouWillLearn;

	@Column(columnDefinition = "LONGTEXT")
	private String whoIsThisCourseFor;

	@Column(columnDefinition = "LONGTEXT")
	private String careerOpportunities;

	@Column
	private String avarageSalaryRange;

	@Column(columnDefinition = "LONGTEXT")
	private String prerequisities;

	@Column
	private String level = "All Levels";

	@Column(columnDefinition = "LONGTEXT")
	private String liveTraining;

	@Column(columnDefinition = "LONGTEXT")
	private String crashCourse;

	@Column(columnDefinition = "LONGTEXT")
	private String mentoringMode;

	@Column(columnDefinition = "LONGTEXT")
	private String selfPacedLearning;

	@Column(name = "default_trainer")
	private String defaultTrainer;

	@Column(name = "course_status")
	private String courseStatus;

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

	public Double getSqamount() {
		return sqamount;
	}

	public void setSqamount(Double sqamount) {
		this.sqamount = sqamount;
	}

	public Double getSqdiscount() {
		return sqdiscount;
	}

	public void setSqdiscount(Double sqdiscount) {
		this.sqdiscount = sqdiscount;
	}

	public Double getSqtotal() {
		return sqtotal;
	}

	public void setSqtotal(Double sqtotal) {
		this.sqtotal = sqtotal;
	}

	public String getShortCourse() {
		return shortCourse;
	}

	public void setShortCourse(String shortCourse) {
		this.shortCourse = shortCourse;
	}

	public Double getIamount() {
		return iamount;
	}

	public void setIamount(Double iamount) {
		this.iamount = iamount;
	}

	public Double getIdiscount() {
		return idiscount;
	}

	public void setIdiscount(Double idiscount) {
		this.idiscount = idiscount;
	}

	public Double getItotal() {
		return itotal;
	}

	public void setItotal(Double itotal) {
		this.itotal = itotal;
	}

	public Double getImamount() {
		return imamount;
	}

	public void setImamount(Double imamount) {
		this.imamount = imamount;
	}

	public Double getImdiscount() {
		return imdiscount;
	}

	public void setImdiscount(Double imdiscount) {
		this.imdiscount = imdiscount;
	}

	public Double getImtotal() {
		return imtotal;
	}

	public void setImtotal(Double imtotal) {
		this.imtotal = imtotal;
	}

	public Double getIsamount() {
		return isamount;
	}

	public void setIsamount(Double isamount) {
		this.isamount = isamount;
	}

	public Double getIsdiscount() {
		return isdiscount;
	}

	public void setIsdiscount(Double isdiscount) {
		this.isdiscount = isdiscount;
	}

	public Double getIstotal() {
		return istotal;
	}

	public void setIstotal(Double istotal) {
		this.istotal = istotal;
	}

	public Double getIsqamount() {
		return isqamount;
	}

	public void setIsqamount(Double isqamount) {
		this.isqamount = isqamount;
	}

	public Double getIsqdiscount() {
		return isqdiscount;
	}

	public void setIsqdiscount(Double isqdiscount) {
		this.isqdiscount = isqdiscount;
	}

	public Double getIsqtotal() {
		return isqtotal;
	}

	public void setIsqtotal(Double isqtotal) {
		this.isqtotal = isqtotal;
	}

	public Double getIcamount() {
		return icamount;
	}

	public void setIcamount(Double icamount) {
		this.icamount = icamount;
	}

	public Double getIcdiscount() {
		return icdiscount;
	}

	public void setIcdiscount(Double icdiscount) {
		this.icdiscount = icdiscount;
	}

	public Double getIctotal() {
		return ictotal;
	}

	public void setIctotal(Double ictotal) {
		this.ictotal = ictotal;
	}

	public String getAboutCourse() {
		return aboutCourse;
	}

	public void setAboutCourse(String aboutCourse) {
		this.aboutCourse = aboutCourse;
	}

	public String getLevel() {
		return level;
	}

	public void setLevel(String level) {
		this.level = level;
	}

	public String getWhatYouWillLearn() {
		return whatYouWillLearn;
	}

	public void setWhatYouWillLearn(String whatYouWillLearn) {
		this.whatYouWillLearn = whatYouWillLearn;
	}

	public String getWhoIsThisCourseFor() {
		return whoIsThisCourseFor;
	}

	public void setWhoIsThisCourseFor(String whoIsThisCourseFor) {
		this.whoIsThisCourseFor = whoIsThisCourseFor;
	}

	public String getCareerOpportunities() {
		return careerOpportunities;
	}

	public void setCareerOpportunities(String careerOpportunities) {
		this.careerOpportunities = careerOpportunities;
	}

	public String getAvarageSalaryRange() {
		return avarageSalaryRange;
	}

	public void setAvarageSalaryRange(String avarageSalaryRange) {
		this.avarageSalaryRange = avarageSalaryRange;
	}

	public String getPrerequisities() {
		return prerequisities;
	}

	public void setPrerequisities(String prerequisities) {
		this.prerequisities = prerequisities;
	}

	public int getNumberOfProjects() {
		return numberOfProjects;
	}

	public void setNumberOfProjects(int numberOfProjects) {
		this.numberOfProjects = numberOfProjects;
	}

	public String getLiveTraining() {
		return liveTraining;
	}

	public void setLiveTraining(String liveTraining) {
		this.liveTraining = liveTraining;
	}

	public String getCrashCourse() {
		return crashCourse;
	}

	public void setCrashCourse(String crashCourse) {
		this.crashCourse = crashCourse;
	}

	public String getMentoringMode() {
		return mentoringMode;
	}

	public void setMentoringMode(String mentoringMode) {
		this.mentoringMode = mentoringMode;
	}

	public String getSelfPacedLearning() {
		return selfPacedLearning;
	}

	public void setSelfPacedLearning(String selfPacedLearning) {
		this.selfPacedLearning = selfPacedLearning;
	}

	public String getDefaultTrainer() {
		return defaultTrainer;
	}

	public void setDefaultTrainer(String defaultTrainer) {
		this.defaultTrainer = defaultTrainer;
	}

	public String getCourseStatus() {
		return courseStatus;
	}

	public void setCourseStatus(String courseStatus) {
		this.courseStatus = courseStatus;
	}

	public String getSeoH1Title() {
		return seoH1Title;
	}

	public void setSeoH1Title(String seoH1Title) {
		this.seoH1Title = seoH1Title;
	}

}
