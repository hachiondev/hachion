package Service;

import java.util.List;

import com.hachionUserDashboard.dto.HireFromUsRequest;
import com.hachionUserDashboard.dto.HireFromUsResponse;

public interface HireFromUsService {

	public HireFromUsResponse createHireFromUs(HireFromUsRequest hireFromUsRequest);

	public HireFromUsResponse updateHireFromUs(HireFromUsRequest hireFromUsRequest);

	public List<HireFromUsResponse> getAllHireFromUs();

	public void deleteHireFromUs();
	
	public List<HireFromUsResponse> getAllApprovedJobs();
}
