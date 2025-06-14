package Service;

public interface PayPalServiceInterface {

	public String createOrder(Double amount, String returnUrl);

	public String captureOrder(String orderId, String studentId, String courseName, String batchId);
}
