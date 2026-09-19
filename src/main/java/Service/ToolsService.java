package Service;

import java.util.List;
import com.hachionUserDashboard.dto.*;

public interface ToolsService {

	ToolsResponse addTools(ToolsRequest request);

	List<ToolsResponse> getAllTools();

	ToolsResponse updateTools(Long currId, ToolsRequest request);

	void deleteTools(Long currId);
}