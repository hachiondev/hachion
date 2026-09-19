package Service;

import java.io.IOException;
import java.util.List;

import org.springframework.web.multipart.MultipartFile;

import com.hachionUserDashboard.dto.UploadAllImagesResponse;

public interface UploadImagesService {

	public void saveCategoryWithImages(String categoryName, String courseName, List<MultipartFile> files)
			throws IOException;

	public List<UploadAllImagesResponse> getAllCategoriesWithImages();

	public void deleteByFileName(String fileName) ;
}
