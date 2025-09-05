package com.hachionUserDashboard.dto;

public class InstallmentStatusResponse {
	private String requestStatus;
	private Integer numSelectedInstallments;

	public InstallmentStatusResponse(String requestStatus, Integer numSelectedInstallments) {
		this.requestStatus = requestStatus;
		this.numSelectedInstallments = numSelectedInstallments;
	}

	// getters & setters
	public String getRequestStatus() {
		return requestStatus;
	}

	public void setRequestStatus(String requestStatus) {
		this.requestStatus = requestStatus;
	}

	public Integer getNumSelectedInstallments() {
		return numSelectedInstallments;
	}

	public void setNumSelectedInstallments(Integer numSelectedInstallments) {
		this.numSelectedInstallments = numSelectedInstallments;
	}
}