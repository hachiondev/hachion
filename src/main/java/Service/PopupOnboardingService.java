package Service;

import java.util.List;

import com.hachionUserDashboard.dto.PopupOnboardingRequest;
import com.hachionUserDashboard.dto.PopupOnboardingResponse;

public interface PopupOnboardingService {

	public PopupOnboardingResponse createPopupOnboarding(PopupOnboardingRequest popupOnboardingRequest);

	public PopupOnboardingResponse updatePopupOnboarding(PopupOnboardingRequest popupOnboardingRequest);

	public List<PopupOnboardingResponse> getAllPopupOnboarding();

	public void deletePopupOnboarding(Long popupOnboardingId);
	
	PopupOnboardingResponse updatePopupOnboardingByEmail(String email, PopupOnboardingRequest request);
}
