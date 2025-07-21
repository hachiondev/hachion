package com.hachionUserDashboard.service;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.hachionUserDashboard.dto.ApplyJobDetailsRequest;
import com.hachionUserDashboard.dto.ApplyJobDetailsResponse;
import com.hachionUserDashboard.entity.ApplyJobDetails;
import com.hachionUserDashboard.repository.ApplyJobDetailsRepository;

import Service.ApplyJobDetailsService;

@Service
public class ApplyJobDetailsServiceImpl implements ApplyJobDetailsService {

	@Autowired
	private ApplyJobDetailsRepository applyJobDetailsRepository;

	@Value("${applyjob.resume.upload.dir}")
	private String resumeUploadDir;

	@Override
	public ApplyJobDetailsResponse createApplyJobDetails(ApplyJobDetailsRequest request, MultipartFile resumeFile) {
		ApplyJobDetails applyJobDetails = new ApplyJobDetails();

		applyJobDetails.setJobId(request.getJobId());
		applyJobDetails.setStudentName(request.getStudentName());
		applyJobDetails.setEmail(request.getEmail());
		applyJobDetails.setMobileNumber(request.getMobileNumber());
		applyJobDetails.setCompanyLogo(request.getCompanyLogo());
		applyJobDetails.setCompanyName(request.getCompanyName());
		applyJobDetails.setJobTitle(request.getJobTitle());
		applyJobDetails.setDate(LocalDate.now());

		String resumeFileName = saveResumeToDisk(resumeFile);
		applyJobDetails.setResume(resumeFileName);

		ApplyJobDetails saved = applyJobDetailsRepository.save(applyJobDetails);
		return createApplyJobDetailsResponse(saved);
	}

	@Override
	public List<ApplyJobDetailsResponse> getAllApplyJobDetails() {

		List<ApplyJobDetailsResponse> listOfApplyJobDetailsResponses = new ArrayList<>();

		List<ApplyJobDetails> listOfApplyJobDetails = applyJobDetailsRepository.findAll();

		for (ApplyJobDetails applyJobDetails : listOfApplyJobDetails) {
			ApplyJobDetailsResponse applyJobDetailsResponse = createApplyJobDetailsResponse(applyJobDetails);
			listOfApplyJobDetailsResponses.add(applyJobDetailsResponse);
		}

		return listOfApplyJobDetailsResponses;
	}

	@Override
	public void deleteApplyJobDetails(Long id) {
		Optional<ApplyJobDetails> optional = applyJobDetailsRepository.findById(id);
		if (optional.isPresent()) {
			ApplyJobDetails details = optional.get();

			String fileName = details.getResume();
			Path filePath = Paths.get(resumeUploadDir, fileName);
			try {
				Files.deleteIfExists(filePath);
			} catch (IOException e) {
				System.err.println("⚠️ Failed to delete resume file: " + fileName);
				e.printStackTrace();
			}

			applyJobDetailsRepository.deleteById(id);
		}
	}

	private ApplyJobDetailsResponse createApplyJobDetailsResponse(ApplyJobDetails saved) {
		ApplyJobDetailsResponse response = new ApplyJobDetailsResponse();
		response.setApplyJobDetailsId(saved.getApplyJobDetailsId());
		response.setJobId(saved.getJobId());
		response.setStudentName(saved.getStudentName());
		response.setEmail(saved.getEmail());
		response.setMobileNumber(saved.getMobileNumber());
		response.setCompanyLogo(saved.getCompanyLogo());
		response.setCompanyName(saved.getCompanyName());
		response.setJobTitle(saved.getJobTitle());
		response.setDate(saved.getDate());
		response.setResume(saved.getResume());
		return response;
	}

	private String saveResumeToDisk(MultipartFile file) {
		String originalFileName = file.getOriginalFilename();
		String newFileName = originalFileName;

		try {
			File dir = new File(resumeUploadDir);
			if (!dir.exists()) {
				dir.mkdirs();
			}

			Path filePath = Paths.get(resumeUploadDir, newFileName);

			if (Files.exists(filePath)) {
				Files.delete(filePath);
			}

			Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

			return newFileName;
		} catch (IOException e) {
			throw new RuntimeException("Failed to save resume", e);
		}
	}

}
