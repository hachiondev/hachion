package com.hachionUserDashboard.entity;

import java.time.LocalDate;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "offline_payment")
public class OfflinePayment {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "offline_payment_id")
	private Long offlinePaymentId;

	@Column(name = "student_id")
	private String studentId;

	@Column(name = "student_name")
	private String studentName;

	@Column(name = "email")
	private String email;

	@Column(name = "mobile")
	private Long mobile;

	@Column(name = "course_name")
	private String courseName;

	@Column(name = "course_fee")
	private Double courseFee;

	@Column(name = "tax")
	private Integer tax;

	@Column(name = "discount")
	private Integer discount;

	@Column(name = "no_of_installments")
	private Integer numberOfInstallements;

	@Column(name = "no_of_days")
	private Integer numberOfDays;

	@Column(name = "pay_date")
	private LocalDate payDate;

	@Column(name = "due_date")
	private LocalDate dueDate;

	@Column(name = "payment_method")
	private String paymentMethod;

	@Column(name = "installment")
	private Integer installment;

	@Column(name = "actual_pay")
	private Double actualPay;

	@Column(name = "received_pay")
	private Double received_pay;

	@Column(name = "proof")
	private String proof;

	@Column(name = "reference")
	private String reference;

	@Column(name = "total_amount")
	private Double totalAmount;

	@Column(name = "balancce_pay")
	private Double balancePay;

	public Long getOfflinePaymentId() {
		return offlinePaymentId;
	}

	public void setOfflinePaymentId(Long offlinePaymentId) {
		this.offlinePaymentId = offlinePaymentId;
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

	public Long getMobile() {
		return mobile;
	}

	public void setMobile(Long mobile) {
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

	public Integer getNumberOfInstallements() {
		return numberOfInstallements;
	}

	public void setNumberOfInstallements(Integer numberOfInstallements) {
		this.numberOfInstallements = numberOfInstallements;
	}

	public Integer getNumberOfDays() {
		return numberOfDays;
	}

	public void setNumberOfDays(Integer numberOfDays) {
		this.numberOfDays = numberOfDays;
	}

	public LocalDate getPayDate() {
		return payDate;
	}

	public void setPayDate(LocalDate payDate) {
		this.payDate = payDate;
	}

	public LocalDate getDueDate() {
		return dueDate;
	}

	public void setDueDate(LocalDate dueDate) {
		this.dueDate = dueDate;
	}

	public String getPaymentMethod() {
		return paymentMethod;
	}

	public void setPaymentMethod(String paymentMethod) {
		this.paymentMethod = paymentMethod;
	}

	public Integer getInstallment() {
		return installment;
	}

	public void setInstallment(Integer installment) {
		this.installment = installment;
	}

	public Double getActualPay() {
		return actualPay;
	}

	public void setActualPay(Double actualPay) {
		this.actualPay = actualPay;
	}

	public Double getReceived_pay() {
		return received_pay;
	}

	public void setReceived_pay(Double received_pay) {
		this.received_pay = received_pay;
	}

	public String getProof() {
		return proof;
	}

	public void setProof(String proof) {
		this.proof = proof;
	}

	public String getReference() {
		return reference;
	}

	public void setReference(String reference) {
		this.reference = reference;
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

	public OfflinePayment(Long offlinePaymentId, String studentId, String studentName, String email, Long mobile,
			String courseName, Double courseFee, Integer tax, Integer discount, Integer numberOfInstallements,
			Integer numberOfDays, LocalDate payDate, LocalDate dueDate, String paymentMethod, Integer installment,
			Double actualPay, Double received_pay, String proof, String reference, Double totalAmount,
			Double balancePay) {
		super();
		this.offlinePaymentId = offlinePaymentId;
		this.studentId = studentId;
		this.studentName = studentName;
		this.email = email;
		this.mobile = mobile;
		this.courseName = courseName;
		this.courseFee = courseFee;
		this.tax = tax;
		this.discount = discount;
		this.numberOfInstallements = numberOfInstallements;
		this.numberOfDays = numberOfDays;
		this.payDate = payDate;
		this.dueDate = dueDate;
		this.paymentMethod = paymentMethod;
		this.installment = installment;
		this.actualPay = actualPay;
		this.received_pay = received_pay;
		this.proof = proof;
		this.reference = reference;
		this.totalAmount = totalAmount;
		this.balancePay = balancePay;
	}

	public OfflinePayment() {
		super();
		// TODO Auto-generated constructor stub
	}

}
