package Service;

import java.util.List;

import com.hachionUserDashboard.dto.InterviewResponseDto;
import com.hachionUserDashboard.dto.InterviewResponseRequest;

public interface InterviewResponseService {

	InterviewResponseDto saveResponse(Long assignmentId, String token, InterviewResponseRequest request);

	List<InterviewResponseDto> getResponsesForAssignment(Long assignmentId);
}
