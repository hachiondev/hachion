package com.hachionUserDashboard.repository;

public interface CertificateRow {
	Long getId(); // certificate_id

	String getCourseName(); // course_name

	String getGrade(); // grade

	String getIssueDate(); // completion_date (stored as String in your table)

	String getCertificatePath(); // certificate_path (useful if you ever want direct URLs)
}