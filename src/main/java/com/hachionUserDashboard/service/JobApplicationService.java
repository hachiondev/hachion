package com.hachionUserDashboard.service;

import java.io.File;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.hachionUserDashboard.dto.JobApplicationRequestAboutUs;
import com.hachionUserDashboard.dto.JobApplicationResponseAboutUs;
import com.hachionUserDashboard.entity.JobApplication;
import com.hachionUserDashboard.repository.JobApplicationRepository;

@Service
public class JobApplicationService {

	@Autowired
	private JobApplicationRepository jobApplicationRepository;

	@Value("${file.upload-dir}")
	private String uploadDir;

	public JobApplicationResponseAboutUs createJobApplication(JobApplicationRequestAboutUs request,
			MultipartFile resume) {

		Long count = jobApplicationRepository.checkDuplicateApplication(request.getEmail(), request.getDepartment(),
				request.getPosition());

		if (count > 0) {
			throw new RuntimeException("You already applied for this job");
		}
		try {


			if (resume == null || resume.isEmpty()) {
				throw new RuntimeException("Resume file is required");
			}

			String originalFileName = resume.getOriginalFilename();

			String extension = originalFileName.substring(originalFileName.lastIndexOf(".") + 1).toLowerCase();

			if (!extension.equals("pdf") && !extension.equals("doc") && !extension.equals("docx")) {
				throw new RuntimeException("Only PDF, DOC, DOCX files are allowed");
			}

			long maxSize = 10 * 1024 * 1024;
			if (resume.getSize() > maxSize) {
				throw new RuntimeException("Resume file size must be less than 10MB");
			}

			String resumeFolder = uploadDir + "about-us/resume/";
			File directory = new File(resumeFolder);

			if (!directory.exists()) {
				directory.mkdirs();
			}

			String fileName = request.getEmail() + "_" + request.getPosition() + "_" + originalFileName;
			Path filePath = Paths.get(resumeFolder + fileName);

			Files.copy(resume.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

			String resumePath = "about-us/resume/" + fileName;

			JobApplication entity = new JobApplication();

			entity.setFirstName(request.getFirstName());
			entity.setLastName(request.getLastName());
			entity.setEmail(request.getEmail());
			entity.setPhone(request.getPhone());
			entity.setAddress(request.getAddress());

			entity.setDepartment(request.getDepartment());
			entity.setPosition(request.getPosition());
			entity.setEmploymentType(request.getEmploymentType());
			entity.setExpectedSalary(request.getExpectedSalary());
			entity.setStartDate(request.getStartDate());

			entity.setExperience(request.getExperience());
			entity.setEducation(request.getEducation());
			entity.setSkills(request.getSkills());
			entity.setPortfolio(request.getPortfolio());
			entity.setLinkedin(request.getLinkedin());
			entity.setRelocation(request.getRelocation());
			entity.setNoticePeriod(request.getNoticePeriod());

			entity.setResumePath(resumePath);

			JobApplication saved = jobApplicationRepository.save(entity);

			JobApplicationResponseAboutUs response = new JobApplicationResponseAboutUs();

			response.setJobApplicationId(saved.getJobApplicationId());
			response.setFirstName(saved.getFirstName());
			response.setLastName(saved.getLastName());
			response.setEmail(saved.getEmail());
			response.setPhone(saved.getPhone());
			response.setAddress(saved.getAddress());

			response.setDepartment(saved.getDepartment());
			response.setPosition(saved.getPosition());
			response.setEmploymentType(saved.getEmploymentType());
			response.setExpectedSalary(saved.getExpectedSalary());
			response.setStartDate(saved.getStartDate());

			response.setExperience(saved.getExperience());
			response.setEducation(saved.getEducation());
			response.setSkills(saved.getSkills());
			response.setPortfolio(saved.getPortfolio());
			response.setLinkedin(saved.getLinkedin());
			response.setRelocation(saved.getRelocation());
			response.setNoticePeriod(saved.getNoticePeriod());

			response.setResumePath(saved.getResumePath());
			response.setCreatedAt(saved.getCreatedAt());

			return response;

		} catch (RuntimeException e) {
			throw e; // keep original validation message
		} catch (Exception e) {
			throw new RuntimeException("Failed to upload resume", e);
		}
	}

	public List<JobApplicationResponseAboutUs> getAllApplications() {

		List<JobApplication> applications = jobApplicationRepository.findAll();

		List<JobApplicationResponseAboutUs> responseList = new ArrayList<>();

		for (JobApplication app : applications) {

			JobApplicationResponseAboutUs response = new JobApplicationResponseAboutUs();

			response.setJobApplicationId(app.getJobApplicationId());
			response.setFirstName(app.getFirstName());
			response.setLastName(app.getLastName());
			response.setEmail(app.getEmail());
			response.setPhone(app.getPhone());
			response.setAddress(app.getAddress());

			response.setDepartment(app.getDepartment());
			response.setPosition(app.getPosition());
			response.setEmploymentType(app.getEmploymentType());
			response.setExpectedSalary(app.getExpectedSalary());
			response.setStartDate(app.getStartDate());

			response.setExperience(app.getExperience());
			response.setEducation(app.getEducation());
			response.setSkills(app.getSkills());
			response.setPortfolio(app.getPortfolio());
			response.setLinkedin(app.getLinkedin());
			response.setRelocation(app.getRelocation());
			response.setNoticePeriod(app.getNoticePeriod());

			response.setResumePath(app.getResumePath());
			response.setCreatedAt(app.getCreatedAt());

			responseList.add(response);
		}

		return responseList;
	}
	public void deleteJobApplication(Long id) {

		JobApplication application = jobApplicationRepository.findById(id)
				.orElseThrow(() -> new RuntimeException("Application not found"));

		try {

			String resumePath = application.getResumePath();

			if (resumePath != null && !resumePath.isEmpty()) {

				String fullPath = uploadDir + resumePath;

				File file = new File(fullPath);

				if (file.exists()) {
					file.delete();
				}
			}

			jobApplicationRepository.delete(application);

		} catch (Exception e) {
			throw new RuntimeException("Failed to delete application", e);
		}
	}
}