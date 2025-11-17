package Service;

import java.util.List;

import com.hachionUserDashboard.dto.InterviewAssignmentRequest;
import com.hachionUserDashboard.dto.InterviewAssignmentResponse;

public interface InterviewAssignmentService {

	InterviewAssignmentResponse createAssignment(Long templateId, InterviewAssignmentRequest request);

	List<InterviewAssignmentResponse> getAssignmentsForTemplate(Long templateId);

	InterviewAssignmentResponse getAssignmentForCandidate(Long assignmentId, String token);

	InterviewAssignmentResponse startInterview(Long assignmentId, String token);

	InterviewAssignmentResponse completeInterview(Long assignmentId, String token);

	List<InterviewAssignmentResponse> searchAssignments(Long templateId, String status, String search);

	void deleteAssignment(Long assignmentId);

	InterviewAssignmentResponse updateAssignment(Long assignmentId, InterviewAssignmentRequest request);

}
