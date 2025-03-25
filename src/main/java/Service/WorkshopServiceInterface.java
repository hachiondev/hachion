package Service;

import java.util.List;
import java.util.Optional;

import com.hachionUserDashboard.dto.WorkshopRequest;

import Response.WorkshopResponse;

public interface WorkshopServiceInterface {

	public WorkshopResponse createWorkshop(WorkshopRequest workshopRequest);

	public Optional<WorkshopResponse> getByWorkshopId(Long workshopId);

	public List<WorkshopResponse> getFindByAllWorkshops();

	public WorkshopResponse updateWorkshop(WorkshopRequest workshopRequest);
	
//	public Optional<WorkshopResponse> getByWorkshopCategory(String courseCategory);

	public void deleteById(Long workshopId);
	
//	public WorkshopResponse userWorkshopRegistration(WorkshopRequest formRequest) throws MessagingException;

//	public List<Workshop> getAllUsers();
}
