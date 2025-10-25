package Service;

import java.io.IOException;
import java.util.List;
import java.util.Optional;

import org.springframework.web.multipart.MultipartFile;

import com.hachionUserDashboard.entity.InstructorApplication;

public interface InstructorApplicationService {
	InstructorApplication create(String json, MultipartFile resume) throws IOException;

	Optional<InstructorApplication> get(Integer id);

	List<InstructorApplication> getAll();

	void delete(Integer id) throws IOException;

	byte[] getResumeBytes(String filename) throws IOException;

	String getResumeContentType(String filename) throws IOException;
}