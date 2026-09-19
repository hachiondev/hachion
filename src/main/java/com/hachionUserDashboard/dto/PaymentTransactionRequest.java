package com.hachionUserDashboard.dto;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import com.hachionUserDashboard.entity.OnlinePaymentInstallments;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Lob;
import jakarta.persistence.OneToMany;

public class PaymentTransactionRequest {

	private Long id;

	private String orderId;

	private String transactionId;

	private String status;

	private Double amount;

	private Double discount;

	private String currency;

	private String studentId;

	private String studentName;

	private String courseName;

	private String batchId;

	private String payerEmail;

	private LocalDateTime paymentDate;

	private Boolean isInstallment = false;

	private Integer installmentCount = 0;

	private Double balance = 0.0;

	@Column
	private Double courseFee;

	private Integer numSelectedInstallments = 0;

	private Integer checkboxClicked = 0;

	@Lob
	private String rawResponseJson;

	private String paymentMethod;

	private String requestStatus;

	private String mobile;

	@OneToMany(mappedBy = "paymentTransaction", cascade = CascadeType.ALL, orphanRemoval = true)
	private List<OnlinePaymentInstallments> onlinePaymentInstallments = new ArrayList<>();

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getOrderId() {
		return orderId;
	}

	public void setOrderId(String orderId) {
		this.orderId = orderId;
	}

	public String getTransactionId() {
		return transactionId;
	}

	public void setTransactionId(String transactionId) {
		this.transactionId = transactionId;
	}

	public String getStatus() {
		return status;
	}

	public void setStatus(String status) {
		this.status = status;
	}

	public Double getAmount() {
		return amount;
	}

	public void setAmount(Double amount) {
		this.amount = amount;
	}

	public String getCurrency() {
		return currency;
	}

	public void setCurrency(String currency) {
		this.currency = currency;
	}

	public String getStudentId() {
		return studentId;
	}

	public void setStudentId(String studentId) {
		this.studentId = studentId;
	}

	public String getPayerEmail() {
		return payerEmail;
	}

	public void setPayerEmail(String payerEmail) {
		this.payerEmail = payerEmail;
	}

	public LocalDateTime getPaymentDate() {
		return paymentDate;
	}

	public void setPaymentDate(LocalDateTime paymentDate) {
		this.paymentDate = paymentDate;
	}

	public String getRawResponseJson() {
		return rawResponseJson;
	}

	public void setRawResponseJson(String rawResponseJson) {
		this.rawResponseJson = rawResponseJson;
	}

	public String getCourseName() {
		return courseName;
	}

	public void setCourseName(String courseName) {
		this.courseName = courseName;
	}

	public String getBatchId() {
		return batchId;
	}

	public void setBatchId(String batchId) {
		this.batchId = batchId;
	}

	public Double getDiscount() {
		return discount;
	}

	public void setDiscount(Double discount) {
		this.discount = discount;
	}

	public Boolean getIsInstallment() {
		return isInstallment;
	}

	public void setIsInstallment(Boolean isInstallment) {
		this.isInstallment = isInstallment;
	}

	public Integer getInstallmentCount() {
		return installmentCount;
	}

	public void setInstallmentCount(Integer installmentCount) {
		this.installmentCount = installmentCount;
	}

	public Double getBalance() {
		return balance;
	}

	public void setBalance(Double balance) {
		this.balance = balance;
	}

	public List<OnlinePaymentInstallments> getOnlinePaymentInstallments() {
		return onlinePaymentInstallments;
	}

	public void setOnlinePaymentInstallments(List<OnlinePaymentInstallments> onlinePaymentInstallments) {
		this.onlinePaymentInstallments = onlinePaymentInstallments;
	}

	public Double getCourseFee() {
		return courseFee;
	}

	public void setCourseFee(Double courseFee) {
		this.courseFee = courseFee;
	}

	public Integer getNumSelectedInstallments() {
		return numSelectedInstallments;
	}

	public void setNumSelectedInstallments(Integer numSelectedInstallments) {
		this.numSelectedInstallments = numSelectedInstallments;
	}

	public Integer getCheckboxClicked() {
		return checkboxClicked;
	}

	public void setCheckboxClicked(Integer checkboxClicked) {
		this.checkboxClicked = checkboxClicked;
	}

	public String getPaymentMethod() {
		return paymentMethod;
	}

	public void setPaymentMethod(String paymentMethod) {
		this.paymentMethod = paymentMethod;
	}

	public String getRequestStatus() {
		return requestStatus;
	}

	public void setRequestStatus(String requestStatus) {
		this.requestStatus = requestStatus;
	}

	public String getStudentName() {
		return studentName;
	}

	public void setStudentName(String studentName) {
		this.studentName = studentName;
	}

	public String getMobile() {
		return mobile;
	}

	public void setMobile(String mobile) {
		this.mobile = mobile;
	}

}
