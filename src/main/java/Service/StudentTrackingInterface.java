package Service;

import com.hachionUserDashboard.dto.StudentTrackingRequest;
import com.hachionUserDashboard.dto.StudentTrackingResponse;

public interface StudentTrackingInterface {

	public StudentTrackingResponse addStudentTracking(StudentTrackingRequest studentTrackingRequest);
}
