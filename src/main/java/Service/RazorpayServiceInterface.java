package Service;

public interface RazorpayServiceInterface {
	String createOrder(Double amount);

	public String captureOrder(String paymentId, String orderId, String signature, String studentId, String courseName,
			String batchId, Double discount);

	String captureInstllmentOrder(String paymentId, String orderId, String signature, String studentId,
			String courseName, String batchId, Integer numSelectedInstallments,
			Integer checkboxClicked);
	
	 public Integer getCheckboxClicked(String studentId, String courseName, String batchId);
}
