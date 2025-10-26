package Service;

import java.io.IOException;
import java.util.List;

import org.springframework.ui.Model;
import org.springframework.web.multipart.MultipartFile;

import com.hachionUserDashboard.dto.PaymentRequest;
import com.hachionUserDashboard.dto.PaymentResponse;
import com.hachionUserDashboard.dto.StudentCourseInfo;

public interface PaymentService {

	public PaymentResponse addPayment(PaymentRequest paymentRequest, List<MultipartFile> files);

	public List<PaymentResponse> findAllPaymentdetails();

	public PaymentResponse updatePayment(Long paymentId, PaymentRequest paymentRequest, MultipartFile file,
			Long proofInstallmentId);

	public StudentCourseInfo getStudentCourseInfo(String studentId, String email, String mobile);

	public Double getAmountByCourseName(String courseName);

	public void deletePaymentById(Long id);

	public byte[] getFileAsBytes(String filename) throws IOException;

	public String getContentType(String filename);

	public String generateInvoice(PaymentRequest paymentRequest, Model model);

//	String generateInvoiceBeforePayment(PaymentRequest paymentRequest, Model model);
	
	public void sendReminderEmail(PaymentRequest paymentRequest);

	

	String generateInvoiceForPaypal(PaymentRequest paymentRequest, Model model);

	public void sendAutoRemindersForTomorrowDue();

//	public String generateInvoiceBeforePayment(PaymentRequest paymentRequest, Model model)
	
	

}
