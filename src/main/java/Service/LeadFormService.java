package Service;

import java.util.List;

import com.hachionUserDashboard.dto.LeadFormRequest;
import com.hachionUserDashboard.dto.LeadFormResponse;

public interface LeadFormService {

	public LeadFormResponse createLeadForm(LeadFormRequest leadFormRequest);

	public LeadFormResponse updateLeadForm(LeadFormRequest leadFormRequest);

	public List<LeadFormResponse> getAllLeadFormDetails();

	public void deleteLeadForm(Long leadFormId);
}
