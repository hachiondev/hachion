package Service;

import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;

import com.hachionUserDashboard.dto.StudentTrackingRequest;
import com.hachionUserDashboard.dto.StudentTrackingResponse;

public interface StudentTrackingInterface {

	public List<String> getStudentIdsByCourseName(String courseName);

	public List<Map<String, Object>> getStudentCourseInfo(String studentId, String email, String mobile);

	public List<String> getBatchIdsByFilters(String studentId, String email, String courseName);

	public ResponseEntity<?> getBatchScheduleInfo(String batchId);

	public StudentTrackingResponse addStudentTracking(StudentTrackingRequest studentTrackingRequest);

	public List<StudentTrackingResponse> listOfStudentTrackingDetails();

	List<String> getBatchIdsByStudentFilters(String categoryName, String courseName, String batchType);
}
