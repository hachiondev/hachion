package Service;

import java.util.List;

import org.springframework.web.multipart.MultipartFile;

import com.hachionUserDashboard.dto.ApplyJobDetailsRequest;
import com.hachionUserDashboard.dto.ApplyJobDetailsResponse;
import com.hachionUserDashboard.dto.JobApplicationResponse;

public interface ApplyJobDetailsService {

	public ApplyJobDetailsResponse createApplyJobDetails(ApplyJobDetailsRequest request, MultipartFile resumeFile);

	public List<ApplyJobDetailsResponse> getAllApplyJobDetails();

	public void deleteApplyJobDetails(Long applyJobDetailsId);

	public boolean isAlreadyApplied(String jobId, String email);

	public List<JobApplicationResponse> getApplicationsByEmail(String email);
}
