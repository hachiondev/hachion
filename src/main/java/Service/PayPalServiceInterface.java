package Service;

public interface PayPalServiceInterface {

	public String createOrder(Double amount);

	public String captureOrder(String orderId, Long studentId, Long courseId);
}
