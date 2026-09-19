package com.hachionUserDashboard.dto;

public class InstallmentStatusResponse {
	private String requestStatus;
	private int numSelectedInstallments;
	private String batchId;

	public InstallmentStatusResponse(String requestStatus, int numSelectedInstallments, String batchId) {
		this.requestStatus = requestStatus;
		this.numSelectedInstallments = numSelectedInstallments;
		this.batchId = batchId;
	}

	public String getRequestStatus() {
		return requestStatus;
	}

	public void setRequestStatus(String requestStatus) {
		this.requestStatus = requestStatus;
	}

	public int getNumSelectedInstallments() {
		return numSelectedInstallments;
	}

	public void setNumSelectedInstallments(int numSelectedInstallments) {
		this.numSelectedInstallments = numSelectedInstallments;
	}

	public String getBatchId() {
		return batchId;
	}

	public void setBatchId(String batchId) {
		this.batchId = batchId;
	}

	// getters & setters
}
