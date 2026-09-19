package com.hachionUserDashboard.dto;

public class TrainerSummaryDTO {

	private String trainerName;
	private String courseName;
	private String trainerImage;
	private Double trainerRating;

	public TrainerSummaryDTO(String trainerName, String courseName, String trainerImage, Double trainerRating) {
		this.trainerName = trainerName;
		this.courseName = courseName;
		this.trainerImage = trainerImage;
		this.trainerRating = trainerRating;
	}

	public String getTrainerName() {
		return trainerName;
	}

	public String getCourseName() {
		return courseName;
	}

	public String getTrainerImage() {
		return trainerImage;
	}

	public Double getTrainerRating() {
		return trainerRating;
	}
}