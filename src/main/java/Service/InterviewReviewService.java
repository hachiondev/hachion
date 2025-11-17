package Service;

import com.hachionUserDashboard.dto.InterviewReviewRequest;
import com.hachionUserDashboard.dto.InterviewReviewResponse;

public interface InterviewReviewService {

	InterviewReviewResponse saveReview(Long assignmentId, InterviewReviewRequest request);

	InterviewReviewResponse getLatestReviewForAssignment(Long assignmentId);

	InterviewReviewResponse updateReview(Long assignmentId, Long reviewId, InterviewReviewRequest request);

	void deleteReview(Long assignmentId, Long reviewId);

}
