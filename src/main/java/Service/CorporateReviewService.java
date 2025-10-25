package Service;

import java.util.List;
import java.util.Optional;

import org.springframework.core.io.Resource;
import org.springframework.web.multipart.MultipartFile;

import com.hachionUserDashboard.entity.CorporateReview;

public interface CorporateReviewService {

	Optional<CorporateReview> getById(int id);

	List<CorporateReview> getAll();

	List<CorporateReview> getByCourseName(String courseName);

	CorporateReview add(String reviewJson, MultipartFile companyLogo);

	CorporateReview update(int id, String reviewJson, MultipartFile companyLogo);

	void delete(int id);

	Resource loadLogoAsResource(String filename);
}
