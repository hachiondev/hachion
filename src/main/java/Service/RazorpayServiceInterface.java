package Service;

import java.util.List;

import com.hachionUserDashboard.dto.PaymentTransactionRequest;
import com.hachionUserDashboard.dto.PaymentTransactionResponse;
import com.hachionUserDashboard.entity.PaymentTransaction;

public interface RazorpayServiceInterface {
	String createOrder(Double amount);

	public String captureOrder(String paymentId, String orderId, String signature, String studentId, String courseName,
			String batchId);

	String captureInstllmentOrder(String paymentId, String orderId, String signature, String studentId,
			String courseName, String batchId, Integer numSelectedInstallments, Integer checkboxClicked);

	public Integer getCheckboxClicked(String studentId, String courseName, String batchId);

	public List<PaymentTransaction> getTransactionsByEmailAndCourse(String payerEmail, String courseName);

	public PaymentTransactionResponse createRequestInstallment(PaymentTransactionRequest paymentTransactionRequest);

	public List<PaymentTransactionResponse> getAllRequestInstallmetns();

	public void updateInstallmentRequestStatus(Long transactionId, String requestStatus);
}
