package Service;

import java.util.List;
import java.util.Optional;

import com.hachionUserDashboard.dto.OfflinePaymentRequest;
import com.hachionUserDashboard.dto.OfflinePaymentResponse;

public interface OfflinePaymentService {

	public OfflinePaymentResponse addOfflinePayment(OfflinePaymentRequest offlinePaymentRequest);

	public OfflinePaymentResponse updateOfflinePayment(OfflinePaymentRequest offlinePaymentRequest);

	public Optional<OfflinePaymentResponse> findByOfflineId(Long offlinePaymentId);

	public List<OfflinePaymentResponse> findAllOfflinePaymentdetails();

	public void deleteByOfflineId(Long offlinePaymentId);

}
