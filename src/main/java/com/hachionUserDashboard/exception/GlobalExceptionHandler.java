//package com.hachionUserDashboard.exception;
//
//import org.springframework.http.HttpStatus;
//import org.springframework.http.ResponseEntity;
//import org.springframework.web.bind.annotation.ExceptionHandler;
//import org.springframework.web.bind.annotation.RestControllerAdvice;
//
//@RestControllerAdvice
//public class GlobalExceptionHandler {
//	
//	@ExceptionHandler(ResourceNotFoundException.class)
//	public ResponseEntity<String> handleUSerNotFoundException(ResourceNotFoundException ex) {
//		
//		 return new ResponseEntity<>(ex.getMessage(), HttpStatus.NOT_FOUND);
//	}
//	
//	
//	public ResponseEntity<String> handleGeneralException(Exception ex) {
//		return new ResponseEntity<>("An unexpected error occurred: " + ex.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
//	}
//}
package com.hachionUserDashboard.exception;
import java.util.HashMap;
import java.util.Map;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.dao.IncorrectResultSizeDataAccessException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

@ControllerAdvice
public class GlobalExceptionHandler {

    // Thrown by ToolsRepository.findByCategoryNameAndCourseName() (an
    // Optional-returning, single-result-expected query) if more than one
    // course_tools row exists for the same category+course - a data
    // invariant now enforced by a unique constraint on that table, so this
    // is defense-in-depth rather than an expected path. Without this
    // handler, the generic Exception handler below passed Hibernate's raw
    // "Query did not return a unique result: N results were returned"
    // message straight to the frontend.
    @ExceptionHandler(IncorrectResultSizeDataAccessException.class)
    public ResponseEntity<Map<String, String>> handleIncorrectResultSize(IncorrectResultSizeDataAccessException ex) {
        Map<String, String> error = new HashMap<>();
        error.put("message", "This category and course combination has a data conflict. Please contact support.");
        return new ResponseEntity<>(error, HttpStatus.CONFLICT);
    }

    // Thrown if the course_tools unique constraint (category_name,
    // course_name) is violated - e.g. two near-simultaneous "Add Tool"
    // requests for a category/course that doesn't have a row yet, both
    // finding nothing and both trying to insert. Same clean-message intent
    // as above.
    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<Map<String, String>> handleDataIntegrityViolation(DataIntegrityViolationException ex) {
        Map<String, String> error = new HashMap<>();
        error.put("message", "Tools for this category and course already exist. Please refresh and try again.");
        return new ResponseEntity<>(error, HttpStatus.CONFLICT);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<Map<String, String>> handleException(Exception ex) {
        Map<String, String> error = new HashMap<>();
        error.put("message", ex.getMessage());
        return new ResponseEntity<>(error, HttpStatus.BAD_REQUEST);
    }
}
