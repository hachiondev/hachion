package com.hachionUserDashboard.dto;

public class PaymentSummaryDTO {
	private String currency;
	private Double totalRevenue;
	private Double pendingAmount;
	private Long overdueCount;
	private Long paidCount;
	private Double totalPayments;
	public String getCurrency() {
		return currency;
	}
	public void setCurrency(String currency) {
		this.currency = currency;
	}
	public Double getTotalRevenue() {
		return totalRevenue;
	}
	public void setTotalRevenue(Double totalRevenue) {
		this.totalRevenue = totalRevenue;
	}
	public Double getPendingAmount() {
		return pendingAmount;
	}
	public void setPendingAmount(Double pendingAmount) {
		this.pendingAmount = pendingAmount;
	}
	public Long getOverdueCount() {
		return overdueCount;
	}
	public void setOverdueCount(Long overdueCount) {
		this.overdueCount = overdueCount;
	}
	public Long getPaidCount() {
		return paidCount;
	}
	public void setPaidCount(Long paidCount) {
		this.paidCount = paidCount;
	}
	public Double getTotalPayments() {
		return totalPayments;
	}
	public void setTotalPayments(Double totalPayments) {
		this.totalPayments = totalPayments;
	}
	public PaymentSummaryDTO(String currency, Double totalRevenue, Double pendingAmount, Long overdueCount,
			Long paidCount, Double totalPayments) {
		super();
		this.currency = currency;
		this.totalRevenue = totalRevenue;
		this.pendingAmount = pendingAmount;
		this.overdueCount = overdueCount;
		this.paidCount = paidCount;
		this.totalPayments = totalPayments;
	}


}