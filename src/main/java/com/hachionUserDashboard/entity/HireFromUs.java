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
@Table(name = "hire_from_us")
public class HireFromUs {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "hire_from_us_id")
	private Long hireFromUsId;

	@Column(name = "first_name")
	private String firstName;

	@Column(name = "last_name")
	private String lastName;

	@Column(name = "email")
	private String email;

	@Column(name = "mobile_number")
	private String mobileNumber;

	@Column(name = "company")
	private String company;

	@Column(name = "company_url")
	private String companyUrl;

	@Column(name = "company_logo")
	private String companyLogo;

	@Column(name = "work_days")
	private String workDays;

	@Column(name = "job_title")
	private String jobTitle;

	@Column(name = "vacancies")
	private String vacancies;

	@Column(name = "experience")
	private String experience;

	@Column(name = "salary")
	private String salary;

	@Column(name = "location")
	private String location;

	@Column(name = "notice_period")
	private String noticePeriod;

	@Column(name = "employment_type")
	private String employmentType;

	@Column(name = "job_type")
	private String jobType;

	@Column(name = "description")
	private String description;

	@Column(name = "qualification")
	private String qualification;

	@Column(name = "date")
	private LocalDate date;

	@Column(name = "job_id", unique = true)
	private String jobId;

	@Column
	private String status;

	public Long getHireFromUsId() {
		return hireFromUsId;
	}

	public void setHireFromUsId(Long hireFromUsId) {
		this.hireFromUsId = hireFromUsId;
	}

	public String getFirstName() {
		return firstName;
	}

	public void setFirstName(String firstName) {
		this.firstName = firstName;
	}

	public String getLastName() {
		return lastName;
	}

	public void setLastName(String lastName) {
		this.lastName = lastName;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public String getMobileNumber() {
		return mobileNumber;
	}

	public void setMobileNumber(String mobileNumber) {
		this.mobileNumber = mobileNumber;
	}

	public String getCompany() {
		return company;
	}

	public void setCompany(String company) {
		this.company = company;
	}

	public String getCompanyUrl() {
		return companyUrl;
	}

	public void setCompanyUrl(String companyUrl) {
		this.companyUrl = companyUrl;
	}

	public String getCompanyLogo() {
		return companyLogo;
	}

	public void setCompanyLogo(String companyLogo) {
		this.companyLogo = companyLogo;
	}

	public String getWorkDays() {
		return workDays;
	}

	public void setWorkDays(String workDays) {
		this.workDays = workDays;
	}

	public String getJobTitle() {
		return jobTitle;
	}

	public void setJobTitle(String jobTitle) {
		this.jobTitle = jobTitle;
	}

	public String getVacancies() {
		return vacancies;
	}

	public void setVacancies(String vacancies) {
		this.vacancies = vacancies;
	}

	public String getExperience() {
		return experience;
	}

	public void setExperience(String experience) {
		this.experience = experience;
	}

	public String getSalary() {
		return salary;
	}

	public void setSalary(String salary) {
		this.salary = salary;
	}

	public String getLocation() {
		return location;
	}

	public void setLocation(String location) {
		this.location = location;
	}

	public String getNoticePeriod() {
		return noticePeriod;
	}

	public void setNoticePeriod(String noticePeriod) {
		this.noticePeriod = noticePeriod;
	}

	public String getEmploymentType() {
		return employmentType;
	}

	public void setEmploymentType(String employmentType) {
		this.employmentType = employmentType;
	}

	public String getJobType() {
		return jobType;
	}

	public void setJobType(String jobType) {
		this.jobType = jobType;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public String getQualification() {
		return qualification;
	}

	public void setQualification(String qualification) {
		this.qualification = qualification;
	}

	public LocalDate getDate() {
		return date;
	}

	public void setDate(LocalDate date) {
		this.date = date;
	}

	public String getJobId() {
		return jobId;
	}

	public void setJobId(String jobId) {
		this.jobId = jobId;
	}

	public String getStatus() {
		return status;
	}

	public void setStatus(String status) {
		this.status = status;
	}

}
