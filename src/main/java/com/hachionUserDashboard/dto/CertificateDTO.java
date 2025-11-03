package com.hachionUserDashboard.dto;

public record CertificateDTO(Long id, String courseName, String grade, String issueDate, String certificateId,
		String certificatePath // useful if FE wants a ready URL
) {
}