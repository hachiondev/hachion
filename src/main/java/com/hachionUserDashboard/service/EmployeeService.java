package com.hachionUserDashboard.service;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardOpenOption;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.hachionUserDashboard.entity.Employee;
import com.hachionUserDashboard.repository.EmployeeRepository;

@Service
public class EmployeeService {

	@Autowired
	private EmployeeRepository employeeRepository;

	@Value("${image.upload.uploadEmployeeCompanyImage.path}")
	private String uploadEmployeeCompanyImagePath;

	public List<Employee> getAllEmployees() {
		return employeeRepository.findAll();
	}

	public Employee addEmployee(Employee employee, MultipartFile companyImage) throws IOException {
		if (companyImage != null && !companyImage.isEmpty()) {
			String imagePath = saveOrReplaceImage(null, companyImage, employee.getEmail());
			employee.setCompanyImage(imagePath);
		}
		Employee saved = employeeRepository.save(employee);
		return employeeRepository.findById(saved.getEmployeeId()).orElse(saved);
	}

	public Employee updateEmployee(Long employeeId, Employee updated, MultipartFile companyImage) throws IOException {
		Employee existing = employeeRepository.findById(employeeId)
				.orElseThrow(() -> new RuntimeException("Employee not found: " + employeeId));

		existing.setName(updated.getName());
		existing.setPhone(updated.getPhone());
		existing.setEmail(updated.getEmail());
		existing.setLocation(updated.getLocation());
		existing.setDepartment(updated.getDepartment());
		existing.setRole(updated.getRole());
		existing.setAdditionalInfo(updated.getAdditionalInfo());

		if (companyImage != null && !companyImage.isEmpty()) {
			String imagePath = saveOrReplaceImage(existing.getCompanyImage(), companyImage, existing.getEmail());
			existing.setCompanyImage(imagePath);
		}

		Employee saved = employeeRepository.save(existing);
		return employeeRepository.findById(saved.getEmployeeId()).orElse(saved);
	}

	public void deleteEmployee(Long employeeId) {
		Employee existing = employeeRepository.findById(employeeId)
				.orElseThrow(() -> new RuntimeException("Employee not found: " + employeeId));
		String imagePath = existing.getCompanyImage();
		employeeRepository.deleteById(employeeId);
		deleteImageIfExists(imagePath);
	}

	private String saveOrReplaceImage(String oldRelativePath, MultipartFile image, String email) throws IOException {
		deleteImageIfExists(oldRelativePath);
		File directory = new File(uploadEmployeeCompanyImagePath);
		if (!directory.exists()) {
			directory.mkdirs();
		}
		String relative = buildRelativeImagePath(email, image.getOriginalFilename());
		String fileNameOnly = relative.substring("images/".length());
		Path abs = Paths.get(directory.getAbsolutePath(), fileNameOnly);
		Files.write(abs, image.getBytes(), StandardOpenOption.CREATE, StandardOpenOption.TRUNCATE_EXISTING);
		return relative;
	}

	private String buildRelativeImagePath(String email, String originalFilename) {
		String sanitizedEmail = sanitizeForFilename(email).replace("@", "_at_").replace(".", "_dot_");
		String sanitizedOriginal = sanitizeForFilename(originalFilename);
		return "images/" + sanitizedEmail + "__" + sanitizedOriginal;
	}

	private void deleteImageIfExists(String storedRelativePath) {
		try {
			if (storedRelativePath == null || storedRelativePath.isEmpty())
				return;
			if (!storedRelativePath.startsWith("images/"))
				return;
			String fileNameOnly = storedRelativePath.substring("images/".length());
			Path abs = Paths.get(uploadEmployeeCompanyImagePath, fileNameOnly);
			Files.deleteIfExists(abs);
		} catch (Exception e) {
			System.err.println("Failed to delete old image: " + e.getMessage());
		}
	}

	private String sanitizeForFilename(String raw) {
		if (raw == null)
			return "unknown";
		String s = raw.trim().toLowerCase();
		s = s.replaceAll("[^a-z0-9._-]+", "-");
		s = s.replaceAll("-{2,}", "-");
		if (s.startsWith("-"))
			s = s.substring(1);
		if (s.isEmpty())
			s = "file";
		return s;
	}

	public List<Employee> getEmployeesByDepartment(String department) {
		return employeeRepository.findByDepartmentIgnoreCase(department);
	}
}
