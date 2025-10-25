package Service;

import java.util.List;

import com.hachionUserDashboard.dto.FaqQueryRequest;
import com.hachionUserDashboard.dto.FaqQueryResponse;

public interface FaqQueryService {

	FaqQueryResponse create(FaqQueryRequest request);

	FaqQueryResponse update(Long id, FaqQueryRequest request);

	FaqQueryResponse get(Long id);

	List<FaqQueryResponse> getAll();

	void delete(Long id);
}