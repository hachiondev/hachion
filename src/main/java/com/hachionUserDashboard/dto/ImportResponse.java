package com.hachionUserDashboard.dto;

import java.util.List;

public class ImportResponse {
	private int totalRecords;
	private int savedRecords;
	private int duplicateRecords;

	private List<String> dbDuplicateEmails;
	private List<String> excelDuplicateEmails;
	
	private List<String> invalidNumbers;
	
	private int updatedRecords;
	private List<String> updatedEmails;
	private List<String> skippedDuplicates;

	public int getTotalRecords() {
		return totalRecords;
	}

	public void setTotalRecords(int totalRecords) {
		this.totalRecords = totalRecords;
	}

	public int getSavedRecords() {
		return savedRecords;
	}

	public void setSavedRecords(int savedRecords) {
		this.savedRecords = savedRecords;
	}

	public int getDuplicateRecords() {
		return duplicateRecords;
	}

	public void setDuplicateRecords(int duplicateRecords) {
		this.duplicateRecords = duplicateRecords;
	}

	public List<String> getDbDuplicateEmails() {
		return dbDuplicateEmails;
	}

	public void setDbDuplicateEmails(List<String> dbDuplicateEmails) {
		this.dbDuplicateEmails = dbDuplicateEmails;
	}

	public List<String> getExcelDuplicateEmails() {
		return excelDuplicateEmails;
	}

	public void setExcelDuplicateEmails(List<String> excelDuplicateEmails) {
		this.excelDuplicateEmails = excelDuplicateEmails;
	}

	public List<String> getInvalidNumbers() {
		return invalidNumbers;
	}

	public void setInvalidNumbers(List<String> invalidNumbers) {
		this.invalidNumbers = invalidNumbers;
	}

	public int getUpdatedRecords() {
		return updatedRecords;
	}

	public void setUpdatedRecords(int updatedRecords) {
		this.updatedRecords = updatedRecords;
	}

	public List<String> getUpdatedEmails() {
		return updatedEmails;
	}

	public void setUpdatedEmails(List<String> updatedEmails) {
		this.updatedEmails = updatedEmails;
	}

	public List<String> getSkippedDuplicates() {
		return skippedDuplicates;
	}

	public void setSkippedDuplicates(List<String> skippedDuplicates) {
		this.skippedDuplicates = skippedDuplicates;
	}

}