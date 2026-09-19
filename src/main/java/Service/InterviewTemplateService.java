package Service;

import java.util.List;

import com.hachionUserDashboard.dto.InterviewTemplateRequest;
import com.hachionUserDashboard.dto.InterviewTemplateResponse;

public interface InterviewTemplateService {

	InterviewTemplateResponse createTemplate(InterviewTemplateRequest request);

	List<InterviewTemplateResponse> getAllTemplates();

	List<InterviewTemplateResponse> getAllActiveTemplates();

	InterviewTemplateResponse getTemplateById(Long id);

	InterviewTemplateResponse updateTemplate(Long id, InterviewTemplateRequest request);

	void deactivateTemplate(Long id);
}
