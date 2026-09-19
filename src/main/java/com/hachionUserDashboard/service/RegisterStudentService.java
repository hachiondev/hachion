package com.hachionUserDashboard.service;

import java.sql.Timestamp;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Objects;
import java.util.Set;
import java.util.stream.Collectors;

import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.CellType;
import org.apache.poi.ss.usermodel.DataFormatter;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.ss.usermodel.WorkbookFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.hachionUserDashboard.dto.EnquiryRequest;
import com.hachionUserDashboard.dto.EnquiryResponse;
import com.hachionUserDashboard.dto.ImportResponse;
import com.hachionUserDashboard.dto.LeadDashboardDTO;
import com.hachionUserDashboard.dto.RegisterStudentResponseDTO;
import com.hachionUserDashboard.dto.StudentRemarkRequest;
import com.hachionUserDashboard.dto.StudentRemarkResponse;
import com.hachionUserDashboard.entity.RegisterStudent;
import com.hachionUserDashboard.entity.StudentRemarksHistory;
import com.hachionUserDashboard.repository.RegisterStudentRepository;
import com.hachionUserDashboard.repository.StudentRemarksHistoryRepository;

import jakarta.mail.MessagingException;

@Service
public class RegisterStudentService {

	@Autowired
	private RegisterStudentRepository repository;

	@Autowired
	private StudentRemarksHistoryRepository studentRemarksHistoryRepository;

	@Autowired
	private PasswordEncoder passwordEncoder;

	@Autowired
	private EmailService emailService;

	@Autowired
	private WebhookSenderService webhookSenderService;

	@Autowired
	private WhatsAppService whatsAppService;

	public ImportResponse importExcel(MultipartFile file) throws Exception {

		List<RegisterStudent> validList = new ArrayList<>();
		Set<String> dbDuplicateEmails = new HashSet<>();
		Set<String> excelDuplicateEmails = new HashSet<>();
		Set<String> excelEmails = new HashSet<>();
		List<String> invalidNumbers = new ArrayList<>();

		Set<String> updatedEmails = new HashSet<>();
		Set<String> skippedDuplicates = new HashSet<>();

		String fileName = file.getOriginalFilename();

		if (fileName == null || (!fileName.endsWith(".xlsx") && !fileName.endsWith(".xls"))) {
			throw new RuntimeException("Only Excel files (.xlsx, .xls) are allowed");
		}
		String contentType = file.getContentType();

		if (contentType == null
				|| (!contentType.equals("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")
						&& !contentType.equals("application/vnd.ms-excel"))) {
			throw new RuntimeException("Invalid file type. Please upload Excel file only");
		}
//		Workbook workbook = new XSSFWorkbook(file.getInputStream());

		Workbook workbook = WorkbookFactory.create(file.getInputStream());
		Sheet sheet = workbook.getSheetAt(0);

//		int totalRows = sheet.getPhysicalNumberOfRows();
		int totalRows = sheet.getLastRowNum() + 1;

		boolean useDBCheck = (totalRows - 1) <= 50;

		Set<String> existingEmails = new HashSet<>();
		int studentIdCounter = 0;

		String prefix = "HACH";
		String lastStudentId = repository.findTopByOrderByStudentIdDesc();

		int baseNumber = 0;

		if (lastStudentId != null && lastStudentId.startsWith(prefix)) {
			String numberPart = lastStudentId.substring(prefix.length());
			try {
				baseNumber = Integer.parseInt(numberPart);
			} catch (NumberFormatException e) {
				baseNumber = 0;
			}
		}

		if (!useDBCheck) {

			List<String> emailsFromDB = repository.findAllEmails();
			existingEmails = emailsFromDB.stream().filter(Objects::nonNull).map(String::toLowerCase)
					.collect(Collectors.toSet());
		}
		String tempPassword = "Hach@123";
		String hashedPassword = passwordEncoder.encode(tempPassword);
		;

		for (int i = 1; i <= sheet.getLastRowNum(); i++) {

			Row row = sheet.getRow(i);

			if (row == null || row.getCell(5) == null || getString(row.getCell(5)).isEmpty()) {
				continue;
			}

			RegisterStudent student = new RegisterStudent();
			student.setStatus("ACTIVE");
			student.setDate(getLocalDate(row.getCell(0)));
			student.setAnalyst_name(getString(row.getCell(1)));
			student.setSeoTeam(getString(row.getCell(2)));
			student.setSource(getString(row.getCell(3)));
			student.setUserName(getString(row.getCell(4)));
			String email = getString(row.getCell(5));
			if (email != null)
				email = email.toLowerCase();
			student.setEmail(email);
			student.setCourse_name(getString(row.getCell(6)));

			String rawMobile = getString(row.getCell(7));
			String rawWhatsapp = getString(row.getCell(8));

			String mobile = formatPhoneNumber(rawMobile);
			String whatsapp = formatPhoneNumber(rawWhatsapp);

//			if (mobile == null && rawMobile != null) {
//				mobile = rawMobile;
//				invalidNumbers.add("Mobile: " + rawMobile);
//			}
//
//			if (whatsapp == null && rawWhatsapp != null) {
//				whatsapp = rawWhatsapp;
//				invalidNumbers.add("Whatsapp: " + rawWhatsapp);
//			}

			if (mobile == null && rawMobile != null && !rawMobile.trim().isEmpty()) {
				invalidNumbers.add("Mobile: " + rawMobile);
			}

			if (whatsapp == null && rawWhatsapp != null && !rawWhatsapp.trim().isEmpty()) {
				invalidNumbers.add("Whatsapp: " + rawWhatsapp);
			}
			student.setMobile(mobile);
			student.setWhatsapp(whatsapp);

			student.setCountry(getString(row.getCell(9)));
			student.setStateCity(getString(row.getCell(10)));
			student.setTime_zone(getString(row.getCell(11)));
			student.setCoordinator(getString(row.getCell(12)));

			String remarks = getString(row.getCell(13));
			String callMadeOn = getString(row.getCell(14));
			String finalRemark = getString(row.getCell(15));
			String lastCallMadeOn = getString(row.getCell(16));
			student.setLeadStatus(getString(row.getCell(17)));
			student.setLeadTag(getString(row.getCell(18)));

			StudentRemarksHistory history = null;

			if ((remarks != null && !remarks.isEmpty()) || (callMadeOn != null && !callMadeOn.isEmpty())
					|| (finalRemark != null && !finalRemark.isEmpty())
					|| (lastCallMadeOn != null && !lastCallMadeOn.isEmpty())) {

				history = new StudentRemarksHistory();

				history.setRemark(remarks);
				history.setCallMadeOn(callMadeOn);
				history.setFinalRemark(finalRemark);
				history.setLastCallMadeOn(lastCallMadeOn);
				history.setCoordinator(student.getCoordinator());
				history.setCreatedAt(LocalDate.now());
			}
			student.setMode("Offline");

			student.setPassword(hashedPassword);

			if (email == null || email.isEmpty())
				continue;

			boolean isDbDuplicate;
			boolean isExcelDuplicate = excelEmails.contains(email);

			if (useDBCheck) {
				isDbDuplicate = repository.existsByEmail(email);
			} else {
				isDbDuplicate = existingEmails.contains(email);
			}

			if (isExcelDuplicate) {
				excelDuplicateEmails.add(email);
			}

			if (isDbDuplicate) {
				dbDuplicateEmails.add(email);
			}

			boolean isDuplicate = isDbDuplicate || isExcelDuplicate;

			if (isDuplicate) {

				RegisterStudent existingStudent = repository.findByEmail(email);

				boolean isUpdated = false;

				if (existingStudent != null) {

					// =========================
					// ✅ PARENT TABLE UPDATE (ONLY EMPTY)
					// =========================

					if (isEmpty(existingStudent.getAnalyst_name()) && !isEmpty(student.getAnalyst_name())) {
						existingStudent.setAnalyst_name(student.getAnalyst_name());
						isUpdated = true;
					}

					if (isEmpty(existingStudent.getSeoTeam()) && !isEmpty(student.getSeoTeam())) {
						existingStudent.setSeoTeam(student.getSeoTeam());
						isUpdated = true;
					}

					if (isEmpty(existingStudent.getSource()) && !isEmpty(student.getSource())) {
						existingStudent.setSource(student.getSource());
						isUpdated = true;
					}

					if (isEmpty(existingStudent.getUserName()) && !isEmpty(student.getUserName())) {
						existingStudent.setUserName(student.getUserName());
						isUpdated = true;
					}

					if (isEmpty(existingStudent.getCourse_name()) && !isEmpty(student.getCourse_name())) {
						existingStudent.setCourse_name(student.getCourse_name());
						isUpdated = true;
					}

					if (isEmpty(existingStudent.getMobile()) && !isEmpty(student.getMobile())) {
						existingStudent.setMobile(student.getMobile());
						isUpdated = true;
					}

					if (isEmpty(existingStudent.getWhatsapp()) && !isEmpty(student.getWhatsapp())) {
						existingStudent.setWhatsapp(student.getWhatsapp());
						isUpdated = true;
					}

					if (isEmpty(existingStudent.getCountry()) && !isEmpty(student.getCountry())) {
						existingStudent.setCountry(student.getCountry());
						isUpdated = true;
					}

					if (isEmpty(existingStudent.getStateCity()) && !isEmpty(student.getStateCity())) {
						existingStudent.setStateCity(student.getStateCity());
						isUpdated = true;
					}

					if (isEmpty(existingStudent.getTime_zone()) && !isEmpty(student.getTime_zone())) {
						existingStudent.setTime_zone(student.getTime_zone());
						isUpdated = true;
					}

					if (isEmpty(existingStudent.getCoordinator()) && !isEmpty(student.getCoordinator())) {
						existingStudent.setCoordinator(student.getCoordinator());
						isUpdated = true;
					}

					if (isEmpty(existingStudent.getLeadStatus()) && !isEmpty(student.getLeadStatus())) {
						existingStudent.setLeadStatus(student.getLeadStatus());
						isUpdated = true;
					}

					if (isEmpty(existingStudent.getLeadTag()) && !isEmpty(student.getLeadTag())) {
						existingStudent.setLeadTag(student.getLeadTag());
						isUpdated = true;
					}

					// =========================
					// ✅ CHILD TABLE UPDATE
					// =========================

					boolean hasChildData = !isEmpty(remarks) || !isEmpty(callMadeOn) || !isEmpty(finalRemark)
							|| !isEmpty(lastCallMadeOn);

					if (hasChildData) {

						List<StudentRemarksHistory> historyList = studentRemarksHistoryRepository
								.findByStudent(existingStudent);

						StudentRemarksHistory latest = null;

						if (historyList != null && !historyList.isEmpty()) {
							latest = historyList.get(historyList.size() - 1);
						}

						if (latest == null) {
							// ✅ FIRST CHILD
							StudentRemarksHistory newHistory = new StudentRemarksHistory();
							newHistory.setRemark(remarks);
							newHistory.setCallMadeOn(callMadeOn);
							newHistory.setFinalRemark(finalRemark);
							newHistory.setLastCallMadeOn(lastCallMadeOn);
							newHistory.setCoordinator(existingStudent.getCoordinator());
							newHistory.setCreatedAt(LocalDate.now());
							newHistory.setStudent(existingStudent);

							studentRemarksHistoryRepository.save(newHistory);
							isUpdated = true;

							// ✅ SECOND CHILD (FINAL REMARK)
							if (!isEmpty(finalRemark)) {

								StudentRemarksHistory finalHistory = new StudentRemarksHistory();

								finalHistory.setRemark(finalRemark);
//			                    finalHistory.setCallMadeOn(LocalDate.now().toString());
								finalHistory.setCallMadeOn(LocalDate.now()
										.format(java.time.format.DateTimeFormatter.ofPattern("dd-MMM-yyyy")));
								finalHistory.setLastCallMadeOn(lastCallMadeOn);

								finalHistory.setCoordinator(existingStudent.getCoordinator());
								finalHistory.setCreatedAt(LocalDate.now());
								finalHistory.setStudent(existingStudent);

								studentRemarksHistoryRepository.save(finalHistory);
							}

						} else {
							// ✅ UPDATE ONLY EMPTY FIELDS

							if (isEmpty(latest.getRemark()) && !isEmpty(remarks)) {
								latest.setRemark(remarks);
								isUpdated = true;
							}

							if (isEmpty(latest.getCallMadeOn()) && !isEmpty(callMadeOn)) {
								latest.setCallMadeOn(callMadeOn);
								isUpdated = true;
							}

							if (isEmpty(latest.getFinalRemark()) && !isEmpty(finalRemark)) {
								latest.setFinalRemark(finalRemark);
								isUpdated = true;
							}

							if (isEmpty(latest.getLastCallMadeOn()) && !isEmpty(lastCallMadeOn)) {
								latest.setLastCallMadeOn(lastCallMadeOn);
								isUpdated = true;
							}

							if (isUpdated) {
								studentRemarksHistoryRepository.save(latest);
							}
						}
					}

					// =========================
					// ✅ FINAL TRACKING
					// =========================

					if (isUpdated) {
						try {
							System.out.println("💾 Saving records: " + validList.size());
							repository.saveAll(validList);
						} catch (Exception e) {
							System.out.println("❌ ERROR while saving to DB");
							e.printStackTrace();
							throw new RuntimeException("DB Save Error: " + e.getMessage());
						}
						updatedEmails.add(email);
					} else {
						skippedDuplicates.add(email);
					}
				}
			} else {

				int nextNumber = baseNumber + 1 + studentIdCounter++;
				student.setStudentId(prefix + String.format("%03d", nextNumber));

				validList.add(student);

				if (history != null) {
					history.setStudent(student);

					List<StudentRemarksHistory> historyList = new ArrayList<>();
					historyList.add(history);

					// SECOND CHILD (FINAL REMARK)
					if (finalRemark != null && !finalRemark.trim().isEmpty()) {

						StudentRemarksHistory finalHistory = new StudentRemarksHistory();

						finalHistory.setRemark(finalRemark);
						finalHistory.setCallMadeOn(
								LocalDate.now().format(java.time.format.DateTimeFormatter.ofPattern("dd-MMM-yyyy")));
						finalHistory.setLastCallMadeOn(lastCallMadeOn);

						finalHistory.setCoordinator(student.getCoordinator());
						finalHistory.setCreatedAt(LocalDate.now());
						finalHistory.setStudent(student);

						historyList.add(finalHistory);
					}

					student.setRemarksHistory(historyList);
				}
				excelEmails.add(email);

				existingEmails.add(email);
			}
		}

		repository.saveAll(validList);

		workbook.close();

		ImportResponse response = new ImportResponse();
//		response.setTotalRecords(totalRows - 1);
		response.setTotalRecords(validList.size() + dbDuplicateEmails.size() + excelDuplicateEmails.size());
		response.setSavedRecords(validList.size());
		response.setDuplicateRecords(dbDuplicateEmails.size() + excelDuplicateEmails.size());
		response.setDbDuplicateEmails(new ArrayList<>(dbDuplicateEmails));
		response.setExcelDuplicateEmails(new ArrayList<>(excelDuplicateEmails));
		response.setInvalidNumbers(invalidNumbers);

		response.setUpdatedRecords(updatedEmails.size());
		response.setUpdatedEmails(new ArrayList<>(updatedEmails));
		response.setSkippedDuplicates(new ArrayList<>(skippedDuplicates));
		return response;
	}

	private boolean isEmpty(String value) {
		return value == null || value.trim().isEmpty();
	}

	private String getString(Cell cell) {
		if (cell == null)
			return null;

		DataFormatter formatter = new DataFormatter();
		return formatter.formatCellValue(cell).trim();
	}

	private LocalDate getLocalDate(Cell cell) {
		if (cell == null)
			return LocalDate.now();

		try {

			if (cell.getCellType() == CellType.NUMERIC) {
				return cell.getLocalDateTimeCellValue().toLocalDate();
			}

			String value = cell.toString().trim();

			if (value.isEmpty())
				return LocalDate.now();

			if (value.contains(" ")) {
				value = value.split(" ")[0];
			}

			List<java.time.format.DateTimeFormatter> formats = List.of(
					java.time.format.DateTimeFormatter.ofPattern("yyyy-MM-dd"),
					java.time.format.DateTimeFormatter.ofPattern("dd-MM-yyyy"),
					java.time.format.DateTimeFormatter.ofPattern("dd/MM/yyyy"),
					java.time.format.DateTimeFormatter.ofPattern("MM/dd/yyyy"),
					java.time.format.DateTimeFormatter.ofPattern("dd-MMMM-yyyy"),
					java.time.format.DateTimeFormatter.ofPattern("d-MMMM-yyyy"),
					java.time.format.DateTimeFormatter.ofPattern("d-MMM-yyyy"),
					java.time.format.DateTimeFormatter.ofPattern("dd-MMM-yyyy"));

			for (java.time.format.DateTimeFormatter formatter : formats) {
				try {
					return LocalDate.parse(value, formatter);
				} catch (Exception ignored) {
				}
			}

		} catch (Exception e) {
			System.out.println("Invalid date format: " + cell);
		}
		return LocalDate.now();
	}

	public StudentRemarkResponse addStudentRemark(StudentRemarkRequest request) {

		if (!repository.existsByStudentId(request.getStudentId())) {
			throw new RuntimeException("Student not found");
		}

		RegisterStudent student = repository.findByStudentId(request.getStudentId())
				.orElseThrow(() -> new RuntimeException("Student not found"));

		StudentRemarksHistory history = new StudentRemarksHistory();
		history.setRemark(request.getRemark());
		history.setCallMadeOn(request.getCallMadeOn());
		history.setFinalRemark(request.getFinalRemark());
		history.setLastCallMadeOn(request.getLastCallMadeOn());
		history.setCoordinator(request.getCoordinator());
		history.setCreatedAt(java.time.LocalDate.now());
		history.setCallStatus(request.getCallStatus());

		history.setStudent(student);

		StudentRemarksHistory savedHistory = studentRemarksHistoryRepository.save(history);

		StudentRemarkResponse response = new StudentRemarkResponse();
		response.setId(savedHistory.getId());
		response.setStudentId(savedHistory.getStudent().getStudentId());
		response.setRemark(savedHistory.getRemark());
		response.setCallMadeOn(savedHistory.getCallMadeOn());
		response.setFinalRemark(savedHistory.getFinalRemark());
		response.setLastCallMadeOn(savedHistory.getLastCallMadeOn());
		response.setCoordinator(savedHistory.getCoordinator());
		response.setCreatedAt(savedHistory.getCreatedAt());
		response.setCallStatus(savedHistory.getCallStatus());

		return response;
	}

	public List<StudentRemarksHistory> getRemarksByStudentId(String studentId) {

		List<Object[]> rows = studentRemarksHistoryRepository.findRemarksRaw(studentId);

		List<StudentRemarksHistory> list = new ArrayList<>();

		for (Object[] row : rows) {
			StudentRemarksHistory r = new StudentRemarksHistory();

			r.setId(((Number) row[0]).longValue());
			r.setRemark((String) row[1]);
			r.setCallMadeOn((String) row[2]);
			r.setFinalRemark((String) row[3]);
			r.setLastCallMadeOn((String) row[4]);
			r.setCoordinator((String) row[5]);
			r.setCreatedAt(row[6] != null ? ((java.sql.Date) row[6]).toLocalDate() : null);
			r.setCallStatus((String) row[7]);

			list.add(r);
		}

		return list;
	}

	private String formatPhoneNumber(String raw) {

		if (raw == null || raw.trim().isEmpty())
			return null;

		if (raw.contains("/")) {
			raw = raw.split("/")[0];
		}

		String cleaned = raw.replaceAll("[^\\d]", "");

		if (cleaned.isEmpty())
			return null;

		if (cleaned.startsWith("91") && cleaned.length() == 12) {
			return "+91 " + cleaned.substring(2);
		}

		if (cleaned.length() == 10 && cleaned.matches("[6-9]\\d{9}")) {
			return "+91 " + cleaned;
		}

		if (cleaned.startsWith("1") && cleaned.length() == 11) {
			return "+1 " + cleaned.substring(1);
		}

		if (cleaned.length() == 10) {
			return "+1 " + cleaned;
		}

		if (cleaned.startsWith("44") && cleaned.length() >= 12) {
			return "+44 " + cleaned.substring(2);
		}

		if (cleaned.length() > 11 && cleaned.length() <= 13) {

			if (cleaned.startsWith("91")) {
				return "+91 " + cleaned.substring(2);
			}
			if (cleaned.startsWith("1")) {
				return "+1 " + cleaned.substring(1);
			}
			if (cleaned.startsWith("44")) {
				return "+44 " + cleaned.substring(2);
			}
		}

		return null;
	}

	public EnquiryResponse saveEnquiry(EnquiryRequest req) throws MessagingException {

		RegisterStudent existingStudent = repository.findByEmail(req.getEmail());

		if (existingStudent != null && existingStudent.getCourse_name() != null
				&& existingStudent.getCourse_name().equalsIgnoreCase(req.getCourse())) {

			webhookSenderService.sendGoogleFormRegistrationDetails(existingStudent, true);

			EnquiryResponse response = new EnquiryResponse();
			response.setStatus("failed");
			response.setMessage("You have already submitted this course enquiry. Our team will contact you shortly.");
			return response;
		}

		if (existingStudent != null) {
			existingStudent.setStatus("ACTIVE");
			existingStudent.setMobile(req.getPhone());
			existingStudent.setWhatsapp(req.getPhone());
			existingStudent.setCourse_name(req.getCourse());
			existingStudent.setUserName(req.getName());
			existingStudent.setStateCity(req.getState());
			existingStudent.setCountry(req.getCountry());
			existingStudent.setSeoTeam(req.getSeoTeam());
			existingStudent.setDate(LocalDate.now());

			repository.save(existingStudent);
			emailService.sendEmailForReactGoogleForm(existingStudent.getEmail(), "Hach@123",
					existingStudent.getUserName(), existingStudent.getCourse_name());

			if (Boolean.TRUE.equals(req.getWhatsappConsent())) {
				whatsAppService.sendEnquiryWhatsApp(existingStudent.getMobile(), existingStudent.getUserName(),
						existingStudent.getCourse_name());
			}

			// ✅ WEBHOOK
			webhookSenderService.sendGoogleFormRegistrationDetails(existingStudent, false);

			EnquiryResponse response = new EnquiryResponse();
			response.setEmail(existingStudent.getEmail());
			response.setMobile(existingStudent.getMobile());
			response.setWhatsapp(existingStudent.getWhatsapp());
			response.setCourseName(existingStudent.getCourse_name());
			response.setUserName(existingStudent.getUserName());
			response.setStateCity(existingStudent.getStateCity());
			response.setDate(existingStudent.getDate());
			response.setMode(existingStudent.getMode());
			response.setSeoTeam(existingStudent.getSeoTeam());
			response.setCountry(existingStudent.getCountry());

			response.setStatus("success");
			response.setMessage("Lead updated successfully");

			return response;
		}

		RegisterStudent student = new RegisterStudent();
		student.setStatus("ACTIVE");
		student.setEmail(req.getEmail());
		student.setMobile(req.getPhone());
		student.setWhatsapp(req.getPhone());
		student.setCourse_name(req.getCourse());
		student.setUserName(req.getName());

		String tempPassword = "Hach@123";
		String hashedPassword = passwordEncoder.encode(tempPassword);
		student.setPassword(hashedPassword);

		student.setStateCity(req.getState());
		student.setStudentId(generateNextStudentId());
		student.setDate(LocalDate.now());
		student.setCountry(req.getCountry());
		student.setMode("Offline");
		student.setSeoTeam(req.getSeoTeam());

		RegisterStudent savedStudent = repository.save(student);

		StudentRemarksHistory remark = new StudentRemarksHistory();
		remark.setCoordinator(req.getCoordinator());
		remark.setCreatedAt(LocalDate.now());
		remark.setStudent(savedStudent);

		studentRemarksHistoryRepository.save(remark);

		webhookSenderService.sendGoogleFormRegistrationDetails(savedStudent, false);
		if (Boolean.TRUE.equals(req.getWhatsappConsent())) {
			whatsAppService.sendEnquiryWhatsApp(savedStudent.getMobile(), savedStudent.getUserName(),
					savedStudent.getCourse_name());
		}

		// ✅ EMAIL
		emailService.sendEmailForReactGoogleForm(savedStudent.getEmail(), tempPassword, savedStudent.getUserName(),
				savedStudent.getCourse_name());

		// ✅ RESPONSE
		EnquiryResponse response = new EnquiryResponse();

		response.setEmail(savedStudent.getEmail());
		response.setStudentId(savedStudent.getStudentId());
		response.setMobile(savedStudent.getMobile());
		response.setWhatsapp(savedStudent.getWhatsapp());
		response.setCourseName(savedStudent.getCourse_name());
		response.setUserName(savedStudent.getUserName());
		response.setStateCity(savedStudent.getStateCity());
		response.setDate(savedStudent.getDate());
		response.setMode(savedStudent.getMode());
		response.setCountry(savedStudent.getCountry());

		response.setCoordinator(remark.getCoordinator());
		response.setCreatedAt(remark.getCreatedAt());
		response.setSeoTeam(savedStudent.getSeoTeam());

		response.setStatus("success");
		response.setMessage("Lead created successfully");

		return response;
	}

	private String generateNextStudentId() {
		String prefix = "HACH";
		String lastStudentId = repository.findTopByOrderByStudentIdDesc();

		int nextNumber = 1;

		if (lastStudentId != null && lastStudentId.startsWith(prefix)) {
			String numberPart = lastStudentId.substring(prefix.length());
			try {
				nextNumber = Integer.parseInt(numberPart) + 1;
			} catch (NumberFormatException e) {
				nextNumber = 1;
			}
		}

		return prefix + String.format("%03d", nextNumber);
	}

	public List<RegisterStudentResponseDTO> getStudentsWithRemarks() {

		List<Object[]> results = repository.getStudentsWithRemarks();

		return results.stream().map(obj -> new RegisterStudentResponseDTO(

				((Number) obj[0]).longValue(), // id
				(String) obj[1],  // studentId
				(String) obj[2],  // email
				(String) obj[3],  // course_name
				(String) obj[4],  // mobile
				(String) obj[5],  // whatsapp
				(String) obj[6],  // userName
				(String) obj[7],   // country
				(String) obj[8],   // location
				(String) obj[9],   // visaStatus
				(String) obj[10],  // stateCity
				(String) obj[11],  // coordinator
				(String) obj[12],  // leadStatus
				(String) obj[13],  // leadTag
				obj[14] != null ? obj[14].toString() : null,
				(String) obj[15],  // remark
				(String) obj[16],  // callMadeOn
				(String) obj[17],  // lastCallMadeOn
				(String) obj[18],  // remarkCoordinator
				(String) obj[19],  // mode
				(String) obj[20],  // timeZone
				(String) obj[21],  // analystName
				(String) obj[22],  // source
				(String) obj[23],  // seoTeam
				(String) obj[24],  // status
				obj[25] != null ? ((Timestamp) obj[25]).toLocalDateTime() : null

		)).toList();
	}

	public List<LeadDashboardDTO> getLeadDashboard() {

		List<Object[]> results = repository.getLeadDashboardData();

		List<LeadDashboardDTO> list = new ArrayList<>();

		for (Object[] row : results) {
			list.add(new LeadDashboardDTO((String) row[0], // name
					(String) row[1], // course
					(String) row[2], // leadTag
					(String) row[3], // leadStatus
					row[4] != null ? row[4].toString() : null, // lastCallMadeOn
					(String) row[5] // coordinator
			));
		}

		return list;
	}

	public List<String> getAllUniqueLeadTags() {
		return repository.findDistinctLeadTags();
	}

	public List<String> getAllUniqueLeadStatus() {
		return repository.findDistinctLeadStatus();
	}

	public String getStudentStatus(String email) {

		String status = repository.findStatusByEmail(email);

		// No active registration for this email — either it was never
		// registered (status == null) or it was removed via Admin Panel ->
		// Student Admin -> Register (soft delete, status == "DELETED"; see
		// RegisterStudentController.deleteRegisterStudent). Both cases must
		// be treated identically: the email is available for a new signup,
		// matching the same DELETED-exclusion already used by
		// Userimpl.sendOtp(), RegisterStudentController.addStudent(), and
		// Userimpl.LoginUser(). Previously the null case threw "ACTIVE" as
		// the error message (a confusing leftover under which a brand-new,
		// never-registered email looked identical to an active account),
		// and the DELETED case fell through to `return status` below with
		// HTTP 200 — which the /register page's existing-email check then
		// read as "this email already exists", incorrectly blocking
		// re-registration after an admin deletion. "Email not found."
		// matches the wording already used by regenerateOtp() below for the
		// same not-registered condition.
		if (status == null || "DELETED".equalsIgnoreCase(status)) {
			throw new RuntimeException("Email not found.");
		}

		// 🔴 If DISABLED → throw error
		if ("DISABLED".equalsIgnoreCase(status)) {
			throw new RuntimeException("Your account is disabled. Please activate your account.");
		}

		return status;
	}
	public List<String> getAllTimeZones() {
		return repository.findAllTimeZones();
	}

	public List<String> getSeoTeams() {
		return repository.getDistinctSeoTeams();
	}
}