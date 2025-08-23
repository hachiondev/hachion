package com.hachionUserDashboard.entity;

import java.time.LocalDate;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "online_payment_installments")
public class OnlinePaymentInstallments {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "online_payment_installment_id")
	private Long onlinePaymentInstallmentsId;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "payment_transaction_id", nullable = false)
	private PaymentTransaction paymentTransaction;

	@Column(name = "installment_number")
	private Integer installmentNumber;

	@Column(name = "installment_amount")
	private Double installmentAmount;

	@Column(name = "paid_amount")
	private Double paidAmount = 0.0;

	@Column(name = "due_date")
	private LocalDate dueDate;

	@Column(name = "status")
	private String status;

	@Column(name = "payment_date")
	private LocalDate paymentDate;

	@Column(name = "payment_method")
	private String paymentMethod;

	@Column(name = "proof_file")
	private String proofFile;

	@Column(name = "created_date")
	private LocalDate createdDate;

	@Column(name = "order_id")
	private String orderId;

	@Column(name = "transaction_id")
	private String transactionId;

	public Long getOnlinePaymentInstallmentsId() {
		return onlinePaymentInstallmentsId;
	}

	public void setOnlinePaymentInstallmentsId(Long onlinePaymentInstallmentsId) {
		this.onlinePaymentInstallmentsId = onlinePaymentInstallmentsId;
	}

	public PaymentTransaction getPaymentTransaction() {
		return paymentTransaction;
	}

	public void setPaymentTransaction(PaymentTransaction paymentTransaction) {
		this.paymentTransaction = paymentTransaction;
	}

	public Integer getInstallmentNumber() {
		return installmentNumber;
	}

	public void setInstallmentNumber(Integer installmentNumber) {
		this.installmentNumber = installmentNumber;
	}

	public Double getInstallmentAmount() {
		return installmentAmount;
	}

	public void setInstallmentAmount(Double installmentAmount) {
		this.installmentAmount = installmentAmount;
	}

	public Double getPaidAmount() {
		return paidAmount;
	}

	public void setPaidAmount(Double paidAmount) {
		this.paidAmount = paidAmount;
	}

	public LocalDate getDueDate() {
		return dueDate;
	}

	public void setDueDate(LocalDate dueDate) {
		this.dueDate = dueDate;
	}

	public String getStatus() {
		return status;
	}

	public void setStatus(String status) {
		this.status = status;
	}

	public LocalDate getPaymentDate() {
		return paymentDate;
	}

	public void setPaymentDate(LocalDate paymentDate) {
		this.paymentDate = paymentDate;
	}

	public String getPaymentMethod() {
		return paymentMethod;
	}

	public void setPaymentMethod(String paymentMethod) {
		this.paymentMethod = paymentMethod;
	}

	public String getProofFile() {
		return proofFile;
	}

	public void setProofFile(String proofFile) {
		this.proofFile = proofFile;
	}

	public LocalDate getCreatedDate() {
		return createdDate;
	}

	public void setCreatedDate(LocalDate createdDate) {
		this.createdDate = createdDate;
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

}
