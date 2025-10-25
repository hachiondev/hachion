package Service;

import com.hachionUserDashboard.entity.Course;
import com.hachionUserDashboard.entity.UserWishlist;

import java.util.List;

public interface UserWishlistService {

	void add(String email, Integer courseId);

	void remove(String email, Integer courseId);

	boolean exists(String email, Integer courseId);

	List<UserWishlist> listRaw(String email);

	List<Course> listCourses(String email);
	
	boolean toggle(String email, Integer courseId);
}
