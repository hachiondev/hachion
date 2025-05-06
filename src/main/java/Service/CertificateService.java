package Service;

import java.io.IOException;
import java.util.List;

import com.hachionUserDashboard.dto.CertificateRequest;
import com.hachionUserDashboard.entity.CertificateEntity;

import jakarta.mail.MessagingException;

public interface CertificateService {
	String getUserById(Long certificateId);
	
	 CertificateEntity generateCertificate(CertificateRequest request);
	 
	 public void sendCertificateByEmail(Long certificateId) throws IOException, MessagingException;
	 public List<CertificateEntity> getAllCertificates();
}
