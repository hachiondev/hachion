package com.hachionUserDashboard.dto;

import java.time.LocalDate;

public class PaymentTransactionSummaryResponse {
	private int serialNo;
	private String studentId;
	private String studentName;
	private String email;
	private String mobile;
	private String courseName;
	private Double courseFee;
	private String coupon; // or String if you store coupon codes
	private Integer numOfInstallments;
	private Integer paidInstallments;
	private Double balanceFee;
	private String status;
	private String paymentMethod;
	private LocalDate createdDate;

	public int getSerialNo() {
		return serialNo;
	}

	public void setSerialNo(int serialNo) {
		this.serialNo = serialNo;
	}

	public String getStudentId() {
		return studentId;
	}

	public void setStudentId(String studentId) {
		this.studentId = studentId;
	}

	public String getStudentName() {
		return studentName;
	}

	public void setStudentName(String studentName) {
		this.studentName = studentName;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public String getMobile() {
		return mobile;
	}

	public void setMobile(String mobile) {
		this.mobile = mobile;
	}

	public String getCourseName() {
		return courseName;
	}

	public void setCourseName(String courseName) {
		this.courseName = courseName;
	}

	public Double getCourseFee() {
		return courseFee;
	}

	public void setCourseFee(Double courseFee) {
		this.courseFee = courseFee;
	}

	public String getCoupon() {
		return coupon;
	}

	public void setCoupon(String coupon) {
		this.coupon = coupon;
	}

	public Integer getNumOfInstallments() {
		return numOfInstallments;
	}

	public void setNumOfInstallments(Integer numOfInstallments) {
		this.numOfInstallments = numOfInstallments;
	}

	public Integer getPaidInstallments() {
		return paidInstallments;
	}

	public void setPaidInstallments(Integer paidInstallments) {
		this.paidInstallments = paidInstallments;
	}

	public Double getBalanceFee() {
		return balanceFee;
	}

	public void setBalanceFee(Double balanceFee) {
		this.balanceFee = balanceFee;
	}

	public String getStatus() {
		return status;
	}

	public void setStatus(String status) {
		this.status = status;
	}

	public String getPaymentMethod() {
		return paymentMethod;
	}

	public void setPaymentMethod(String paymentMethod) {
		this.paymentMethod = paymentMethod;
	}

	public LocalDate getCreatedDate() {
		return createdDate;
	}

	public void setCreatedDate(LocalDate createdDate) {
		this.createdDate = createdDate;
	}

}
