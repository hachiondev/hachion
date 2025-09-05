package com.hachionUserDashboard.entity;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Lob;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;

@Entity
@Table(name = "payment_transactions")
public class PaymentTransaction {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@Column(name = "order_id")
	private String orderId;

	@Column(name = "transaction_id")
	private String transactionId;

	@Column(name = "status")
	private String status;

	@Column(name = "amount")
	private Double amount = 0.0;

	@Column(name = "discount")
	private Double discount = 0.0;

	@Column(name = "currency")
	private String currency;

	@Column(name = "student_id")
	private String studentId;

	@Column(name = "student_name")
	private String studentName;

	@Column(name = "course_name")
	private String courseName;

	@Column(name = "batch_id")
	private String batchId;

	@Column(name = "payer_email")
	private String payerEmail;

	@Column(name = "payment_date")
	private LocalDateTime paymentDate;

	@Column(name = "request_date")
	private LocalDate requestDate;

	@Column(name = "is_installment")
	private Boolean isInstallment = false;

	@Column(name = "installment_count")
	private Integer installmentCount = 0;

	@Column(name = "balance")
	private Double balance = 0.0;

	@Column
	private Double courseFee = 0.0;

	@Column(name = "number_of_installments")
	private Integer numSelectedInstallments = 0;

	@Column(name = "checkbox_clicked")
	private Integer checkboxClicked = 0;

	@Lob
	private String rawResponseJson;

	@Column(name = "payment_method")
	private String paymentMethod;

	@Column(name = "request_status")
	private String requestStatus;

	@Column(name = "mobile")
	private String mobile;

	@Column(name = "coupon_code")
	private String couponCode;

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

	public LocalDate getRequestDate() {
		return requestDate;
	}

	public void setRequestDate(LocalDate requestDate) {
		this.requestDate = requestDate;
	}

	public String getMobile() {
		return mobile;
	}

	public void setMobile(String mobile) {
		this.mobile = mobile;
	}

	public String getCouponCode() {
		return couponCode;
	}

	public void setCouponCode(String couponCode) {
		this.couponCode = couponCode;
	}

}
