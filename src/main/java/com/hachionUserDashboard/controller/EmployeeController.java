package com.hachionUserDashboard.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.hachionUserDashboard.entity.Employee;
import com.hachionUserDashboard.service.EmployeeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/employees")
@CrossOrigin
public class EmployeeController {

	@Autowired
	private EmployeeService employeeService;

	@PostMapping(value = "/add", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
	public ResponseEntity<?> addEmployee(@RequestPart("employee") String employeeJson,
			@RequestPart(value = "companyImage", required = false) MultipartFile imageFile) {
		try {

			ObjectMapper mapper = new ObjectMapper();
			Employee employee = mapper.readValue(employeeJson, Employee.class);

			Employee saved = employeeService.addEmployee(employee, imageFile);
			return ResponseEntity.status(HttpStatus.CREATED).body(saved);
		} catch (IllegalArgumentException iae) {
			return ResponseEntity.badRequest().body(iae.getMessage());
		} catch (IOException ioe) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
					.body("Error saving image: " + ioe.getMessage());
		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
					.body("Error adding employee: " + e.getMessage());
		}
	}

	@PutMapping(value = "/update/{employeeId}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
	public ResponseEntity<?> updateEmployee(@PathVariable Long employeeId, @RequestPart("employee") String employeeJson,
			@RequestPart(value = "companyImage", required = false) MultipartFile imageFile) {
		try {
			ObjectMapper mapper = new ObjectMapper();
			Employee employee = mapper.readValue(employeeJson, Employee.class);

			Employee updated = employeeService.updateEmployee(employeeId, employee, imageFile);
			return ResponseEntity.ok(updated);
		} catch (IllegalArgumentException iae) {
			return ResponseEntity.badRequest().body(iae.getMessage());
		} catch (IOException ioe) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
					.body("Error saving image: " + ioe.getMessage());
		} catch (RuntimeException re) {
			return ResponseEntity.status(HttpStatus.NOT_FOUND).body(re.getMessage());
		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
					.body("Error updating employee: " + e.getMessage());
		}
	}

	@DeleteMapping("/delete/{employeeId}")
	public ResponseEntity<?> deleteEmployee(@PathVariable Long employeeId) {
		try {
			employeeService.deleteEmployee(employeeId);
			return ResponseEntity.noContent().build();
		} catch (RuntimeException re) {
			return ResponseEntity.status(HttpStatus.NOT_FOUND).body(re.getMessage());
		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
					.body("Error deleting employee: " + e.getMessage());
		}
	}

	@GetMapping
	public ResponseEntity<List<Employee>> getEmployees(
			@RequestParam(name = "department", required = false) String department) {

		if (department == null || department.isBlank()) {
			return ResponseEntity.ok(employeeService.getAllEmployees());
		} else {
			return ResponseEntity.ok(employeeService.getEmployeesByDepartment(department));
		}
	}
}
