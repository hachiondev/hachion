package com.hachionUserDashboard.dto;

// certificateId here (despite the name) holds the student's own Student ID,
// not the DB row's certificate_id PK - kept as-is for backward
// compatibility with existing frontend usages that don't yet distinguish
// them. certificateNumber is the actual, separate, admin-entered
// Certificate ID printed on the PDF footer.
public record CertificateDTO(Long id, String courseName, String grade, String issueDate, String certificateId,
		String certificatePath, // useful if FE wants a ready URL
		String certificateNumber) {
}