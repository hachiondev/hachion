package Service;

import java.util.List;

import com.hachionUserDashboard.dto.InterviewQuestionRequest;
import com.hachionUserDashboard.dto.InterviewQuestionResponse;

public interface InterviewQuestionService {

	InterviewQuestionResponse addQuestionToTemplate(Long templateId, InterviewQuestionRequest request);

	List<InterviewQuestionResponse> getQuestionsForTemplate(Long templateId);

	InterviewQuestionResponse updateQuestion(Long questionId, InterviewQuestionRequest request);

	void deleteQuestion(Long questionId);
	
	List<InterviewQuestionResponse> getAllQuestions();

}
