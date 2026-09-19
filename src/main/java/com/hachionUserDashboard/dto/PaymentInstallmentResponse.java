package com.hachionUserDashboard.dto;

import java.time.LocalDate;

public class PaymentInstallmentResponse {

    private Long installmentId;
    private Integer numberOfInstallments;
    private LocalDate payDate;
    private LocalDate dueDate;
    private Double actualPay;
    private Double receivedPay;
    private String paymentMethod;
    private String proof;
    private String reference;
	public Long getInstallmentId() {
		return installmentId;
	}
	public void setInstallmentId(Long installmentId) {
		this.installmentId = installmentId;
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
	public String getPaymentMethod() {
		return paymentMethod;
	}
	public void setPaymentMethod(String paymentMethod) {
		this.paymentMethod = paymentMethod;
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