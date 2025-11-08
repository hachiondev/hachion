package com.hachionUserDashboard.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.hachionUserDashboard.entity.Employee;

public interface EmployeeRepository extends JpaRepository<Employee, Long> {
}