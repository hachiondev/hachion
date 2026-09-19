package com.hachionUserDashboard.entity;

import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;

@Entity
@Table(name = "payments")
public class Payment {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "payment_id")
	private Long paymentId;

	@Column(name = "student_id", nullable = false)
	private String studentId;

	@Column(name = "student_name", nullable = false)
	private String studentName;

	@Column(name = "email", nullable = false)
	private String email;

	@Column(name = "mobile", nullable = false)
	private String mobile;

	@Column(name = "course_name", nullable = false)
	private String courseName;

	@Column(name = "course_fee", nullable = false)
	private Double courseFee;

	@Column(name = "tax", nullable = false)
	private Integer tax;

	@Column(name = "discount", nullable = false)
	private Integer discount;

	@Column(name = "no_of_installments", nullable = false)
	private Integer numberOfInstallments;

	@Column(name = "no_of_days", nullable = false)
	private Integer numberOfDays;

	@Column(name = "total_amount", nullable = false)
	private Double totalAmount;

	@Column(name = "balance_pay", nullable = false)
	private Double balancePay;

	@Column(name = "invoice_number")
	private String invoiceNumber;

	@Column(name = "status", nullable = false)
	private String status;

	@Column(name = "stop_reminder", nullable = false)
	private String stopReminder;

	@Column(name = "currency", nullable = false)
	private String currency;

	@OneToMany(mappedBy = "payment", cascade = CascadeType.ALL, orphanRemoval = true)
	private List<PaymentInstallment> installments = new ArrayList<>();

	public Long getPaymentId() {
		return paymentId;
	}

	public void setPaymentId(Long paymentId) {
		this.paymentId = paymentId;
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

	public Integer getTax() {
		return tax;
	}

	public void setTax(Integer tax) {
		this.tax = tax;
	}

	public Integer getDiscount() {
		return discount;
	}

	public void setDiscount(Integer discount) {
		this.discount = discount;
	}

	public Integer getNumberOfInstallments() {
		return numberOfInstallments;
	}

	public void setNumberOfInstallments(Integer numberOfInstallments) {
		this.numberOfInstallments = numberOfInstallments;
	}

	public Integer getNumberOfDays() {
		return numberOfDays;
	}

	public void setNumberOfDays(Integer numberOfDays) {
		this.numberOfDays = numberOfDays;
	}

	public Double getTotalAmount() {
		return totalAmount;
	}

	public void setTotalAmount(Double totalAmount) {
		this.totalAmount = totalAmount;
	}

	public Double getBalancePay() {
		return balancePay;
	}

	public void setBalancePay(Double balancePay) {
		this.balancePay = balancePay;
	}

	public List<PaymentInstallment> getInstallments() {
		return installments;
	}

	public void setInstallments(List<PaymentInstallment> installments) {
		this.installments = installments;
	}

	public String getInvoiceNumber() {
		return invoiceNumber;
	}

	public void setInvoiceNumber(String invoiceNumber) {
		this.invoiceNumber = invoiceNumber;
	}

	public String getStatus() {
		return status;
	}

	public void setStatus(String status) {
		this.status = status;
	}

	public String getStopReminder() {
		return stopReminder;
	}

	public void setStopReminder(String stopReminder) {
		this.stopReminder = stopReminder;
	}

	public String getCurrency() {
		return currency;
	}

	public void setCurrency(String currency) {
		this.currency = currency;
	}

}
