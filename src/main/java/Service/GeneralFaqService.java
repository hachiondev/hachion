package Service;

import java.util.List;

import com.hachionUserDashboard.dto.GeneralFaqRequest;
import com.hachionUserDashboard.dto.GeneralFaqResponse;

public interface GeneralFaqService {

	GeneralFaqResponse create(GeneralFaqRequest req);

	GeneralFaqResponse update(Long id, GeneralFaqRequest req);

	List<GeneralFaqResponse> getAll();

	GeneralFaqResponse getById(Long id);

	void deleteByIds(List<Long> ids);
}