package Service;

import java.util.List;

import com.hachionUserDashboard.dto.PopupOnboardingRequest;
import com.hachionUserDashboard.dto.PopupOnboardingResponse;

public interface PopupOnboardingService {

	public PopupOnboardingResponse createPopupOnboarding(PopupOnboardingRequest popupOnboardingRequest);

//	public PopupOnboardingResponse updatePopupOnboarding(PopupOnboardingRequest popupOnboardingRequest);

	
	public void deletePopupOnboarding(Long popupOnboardingId);

	public PopupOnboardingResponse findByStudentEmail(String studetnEmail);

	public List<PopupOnboardingResponse> getAllPopupOnboardings();
	
	PopupOnboardingResponse updatePopupOnboardingByEmail(String email, PopupOnboardingRequest request);
}
