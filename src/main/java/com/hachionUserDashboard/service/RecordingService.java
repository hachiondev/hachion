package com.hachionUserDashboard.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.google.api.services.classroom.Classroom;
import com.google.api.services.classroom.model.Announcement;
import com.google.api.services.classroom.model.Course;
import com.google.api.services.classroom.model.ListCoursesResponse;
import com.google.api.services.drive.Drive;
import com.google.api.services.drive.model.File;
import com.google.api.services.drive.model.FileList;
import com.hachionUserDashboard.entity.CourseSchedule;
import com.hachionUserDashboard.entity.ProcessedRecording;
import com.hachionUserDashboard.repository.CourseScheduleRepository;
import com.hachionUserDashboard.repository.ProcessedRecordingRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class RecordingService {

	@Autowired
	private Drive drive;

	@Autowired
	private Classroom classroom;

	@Autowired
	private CourseScheduleRepository scheduleRepository;

	@Autowired
	private ProcessedRecordingRepository processedRepo;

	public void processRecordings() throws Exception {

		List<String> folderIds = scheduleRepository.findDistinctFolderIds();

		for (String folderId : folderIds) {

			if (folderId == null || folderId.isEmpty()) {
				continue;
			}

			FileList result = drive.files().list()
					.setQ("'" + folderId + "' in parents and createdTime > '" + getLast2HoursTime() + "'")
//					.setFields("files(id,name,webViewLink)").setOrderBy("createdTime asc").execute();
					.setFields("files(id,name,webViewLink,mimeType)").setOrderBy("createdTime asc").execute();

			if (result.getFiles() == null)
				continue;

			FileList allFiles = drive.files().list().setQ("'" + folderId + "' in parents")
					.setFields("files(id,name,webViewLink,mimeType)").execute();

			if (allFiles.getFiles() == null)
				continue;

			for (File file : result.getFiles()) {

				if (file.getMimeType() == null || !file.getMimeType().startsWith("video/")) {
					continue;
				}

				if (processedRepo.existsByFileId(file.getId())) {

					continue;
				}

				String meetingCode = extractMeetingCode(file.getName());

				if (meetingCode == null)
					continue;

				CourseSchedule schedule = scheduleRepository.findByMeetingCode(meetingCode);

				if (schedule == null)
					continue;

				String classroomName = schedule.getBatchId() + "-" + schedule.getSchedule_course_name();

				String courseId = findClassroomId(classroomName);

				if (courseId != null) {

					String formattedDate = extractDateFromFileName(file.getName());

					String videoLink = file.getWebViewLink();
					String notesLink = null;
					String transcriptLink = null;

//					String recordingDateTime = extractDateTimeKey(file.getName());
					String recordingDateTime = normalizeRecordingTime(extractDateTimeKey(file.getName()));
					

					for (File f : allFiles.getFiles()) {

						if (f.getName() == null)
							continue;

						String nameLower = f.getName().toLowerCase();

						if (nameLower.contains("transcript") && f.getName().startsWith(meetingCode)) {
							transcriptLink = f.getWebViewLink();
						}

						if (nameLower.contains("notes")) {

//							String notesDateTime = extractDateTimeKey(f.getName());
							String notesDateTime = extractDateTimeFromNotes(f.getName());

							if (recordingDateTime != null && recordingDateTime.equals(notesDateTime)) {
								notesLink = f.getWebViewLink();
							}
						}
					}

					postAnnouncement(courseId, videoLink, notesLink, transcriptLink, formattedDate);

					ProcessedRecording pr = new ProcessedRecording();
					pr.setFileId(file.getId());
					processedRepo.save(pr);
				}
			}
		}

	}
	private String normalizeRecordingTime(String raw) {
	    try {
	        // Input: 2026-04-18 00:21 GMT-5
	        String[] parts = raw.split(" ");
	        String date = parts[0].replace("-", "/");
	        String time = parts[1];
	        return date + " " + time;
	    } catch (Exception e) {
	        return null;
	    }
	}

	private String extractDateTimeFromNotes(String name) {
	    try {
	        // Example: Meeting started 2026/04/18 00:21 CDT
	        String[] parts = name.split(" ");

	        for (int i = 0; i < parts.length; i++) {
	            if (parts[i].matches("\\d{4}/\\d{2}/\\d{2}")) {
	                return parts[i] + " " + parts[i + 1]; // date + time
	            }
	        }
	    } catch (Exception e) {
	        e.printStackTrace();
	    }
	    return null;
	}
	private String extractMeetingCode(String name) {
		try {
			return name.split(" ")[0];
		} catch (Exception e) {
			return null;
		}
	}

	private String findClassroomId(String classroomName) throws Exception {

		ListCoursesResponse response = classroom.courses().list().execute();

		for (Course course : response.getCourses()) {
			System.out.println("Checking Classroom: " + course.getName());
			if (course.getName().contains(classroomName)) {
				return course.getId();
			}
		}
		return null;
	}

	private void postAnnouncement(String courseId, String videoLink, String notesLink, String transcriptLink,
			String formattedDate) throws Exception {

		StringBuilder message = new StringBuilder();
		message.append("Session Files (").append(formattedDate).append("):\n\n");

		if (videoLink != null) {
			message.append("🎥 Recording:\n").append(videoLink).append("\n\n");
		}

		if (notesLink != null) {
			message.append("📝 Meeting Notes:\n").append(notesLink).append("\n\n");
		}

		if (transcriptLink != null) {
			message.append("💬 Chat Transcript:\n").append(transcriptLink).append("\n\n");
		}

		Announcement announcement = new Announcement();
		announcement.setText(message.toString());

		classroom.courses().announcements().create(courseId, announcement).execute();
	}

	private String extractDateTimeKey(String name) {
		try {
			int start = name.indexOf("(");
			int end = name.indexOf(")");

			if (start != -1 && end != -1) {
				return name.substring(start + 1, end);
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
		return null;
	}

	private String extractDateFromFileName(String name) {
		try {
			int start = name.indexOf("(");
			int end = name.indexOf(")");

			if (start != -1 && end != -1) {

				String dateTime = name.substring(start + 1, end);

				String datePart = dateTime.split(" ")[0];

				java.time.LocalDate date = java.time.LocalDate.parse(datePart);

				java.time.format.DateTimeFormatter formatter = java.time.format.DateTimeFormatter
						.ofPattern("dd-MMMM-yyyy");

				return date.format(formatter);
			}

		} catch (Exception e) {
			e.printStackTrace();
		}

		return "Unknown Date";
	}

	private String getLast2HoursTime() {
		return java.time.Instant.now().minusSeconds(7200).toString();
	}
}