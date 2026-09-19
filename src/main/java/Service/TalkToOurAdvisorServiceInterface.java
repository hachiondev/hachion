package Service;

import java.util.List;
import java.util.Optional;

import com.hachionUserDashboard.dto.TalkToOurAdvisorRequest;

import Response.TalkToOurAdvisorResponse;

public interface TalkToOurAdvisorServiceInterface {

	public TalkToOurAdvisorResponse createTalkToOurAdvisor(TalkToOurAdvisorRequest ourAdvisor);

	public List<TalkToOurAdvisorResponse> getAllTalkToOurAdvisor();

	public Optional<TalkToOurAdvisorResponse> getById(Long id);

	public String deleteTalkToAdvisor(Long id);
}
