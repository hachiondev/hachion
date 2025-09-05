package com.hachionUserDashboard.dto;

import java.time.LocalDate;

public class BatchScheduleResponse {

	private String batchId;
	private long count;
	private LocalDate startDate;
	private LocalDate completionDate;
	private String numberOfClasses;

	public String getBatchId() {
		return batchId;
	}

	public void setBatchId(String batchId) {
		this.batchId = batchId;
	}

	public long getCount() {
		return count;
	}

	public void setCount(long count) {
		this.count = count;
	}

	public LocalDate getStartDate() {
		return startDate;
	}

	public void setStartDate(LocalDate startDate) {
		this.startDate = startDate;
	}

	public LocalDate getCompletionDate() {
		return completionDate;
	}

	public void setCompletionDate(LocalDate completionDate) {
		this.completionDate = completionDate;
	}

	public String getNumberOfClasses() {
		return numberOfClasses;
	}

	public void setNumberOfClasses(String numberOfClasses) {
		this.numberOfClasses = numberOfClasses;
	}

	public BatchScheduleResponse(String batchId, long count, LocalDate startDate, LocalDate completionDate,
			String numberOfClasses) {
		super();
		this.batchId = batchId;
		this.count = count;
		this.startDate = startDate;
		this.completionDate = completionDate;
		this.numberOfClasses = numberOfClasses;
	}

}
