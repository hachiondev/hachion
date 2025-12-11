package Service;

import java.util.List;

import com.hachionUserDashboard.dto.ProjectRequest;
import com.hachionUserDashboard.dto.ProjectResponse;

public interface ProjectServiceInterface {

	public List<ProjectResponse> createMultiple(List<ProjectRequest> requestList);

	public ProjectResponse updateProject(Long id, ProjectRequest req);

	public void deleteProject(Long id);

	public List<ProjectResponse> getAllProjects();

}
