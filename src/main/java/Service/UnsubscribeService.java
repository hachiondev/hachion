package Service;

import java.util.List;

import com.hachionUserDashboard.dto.UnsubscribeRequest;
import com.hachionUserDashboard.dto.UnsubscribeResponse;

public interface UnsubscribeService {

	public UnsubscribeResponse createUnsubscribeDetails(UnsubscribeRequest unsubscribeRequest);

	public List<UnsubscribeResponse> getAllUnsubscribeDetails();

	public void deleteUnsubscribeDetails(Long unsubscribeId);
}
