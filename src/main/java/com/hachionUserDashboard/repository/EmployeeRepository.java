package com.hachionUserDashboard.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.hachionUserDashboard.entity.Employee;

public interface EmployeeRepository extends JpaRepository<Employee, Long> {

	List<Employee> findByDepartmentIgnoreCase(String department);

	List<Employee> findByDepartmentIn(List<String> departments);

	List<Employee> findAllByName(String name);

	@Query("SELECT DISTINCT e.name FROM Employee e WHERE e.department IN :departments")
	List<String> findEmployeeNamesByDepartmentIn(@Param("departments") List<String> departments);

	@Query(value = "SELECT DISTINCT google_form_url FROM employees WHERE google_form_url IS NOT NULL AND google_form_url <> ''", nativeQuery = true)
	List<String> findUniqueGoogleFormUrls();

	@Query(value = "SELECT COUNT(*) FROM employees WHERE LOWER(email) = LOWER(:email)", nativeQuery = true)
	int countByEmail(@Param("email") String email);
	
	 Optional<Employee> findByNameIgnoreCase(String name);
	 
	 @Query("SELECT e.name FROM Employee e WHERE LOWER(e.department) IN ('SEO', 'Business')")
	 List<String> getAllDropdownEmployees();
	 @Query("SELECT e.name FROM Employee e WHERE LOWER(e.department) = 'SEO'")
	 List<String> getSeoTeamNames();
}