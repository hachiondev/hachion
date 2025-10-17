package com.hachionUserDashboard.entity;

import java.time.LocalDate;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@JsonIgnoreProperties(ignoreUnknown = true)
@Entity
@Table(name = "payment_installments")
public class PaymentInstallment {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "installment_id")
	private Long installmentId;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "payment_id")
	private Payment payment;

	@Column(name = "no_of_installments")
	private Integer numberOfInstallments;

	@Column(name = "pay_date")
	private LocalDate payDate;

	@Column(name = "due_date")
	private LocalDate dueDate;

	@Column(name = "payment_method")
	private String paymentMethod;

	@Column(name = "actual_pay")
	private Double actualPay;

	@Column(name = "received_pay")
	private Double receivedPay;

	@Column(name = "proof")
	private String proof;

	@Column(name = "reference")
	private String reference;

	public Long getInstallmentId() {
		return installmentId;
	}

	public void setInstallmentId(Long installmentId) {
		this.installmentId = installmentId;
	}

	public Payment getPayment() {
		return payment;
	}

	public void setPayment(Payment payment) {
		this.payment = payment;
	}

	public Integer getNumberOfInstallments() {
		return numberOfInstallments;
	}

	public void setNumberOfInstallments(Integer numberOfInstallments) {
		this.numberOfInstallments = numberOfInstallments;
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

	public Double getActualPay() {
		return actualPay;
	}

	public void setActualPay(Double actualPay) {
		this.actualPay = actualPay;
	}

	public Double getReceivedPay() {
		return receivedPay;
	}

	public void setReceivedPay(Double receivedPay) {
		this.receivedPay = receivedPay;
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

}