package Service;

import com.hachionUserDashboard.dto.TrainerRequest;
import com.hachionUserDashboard.entity.Trainer;

public interface TrainerService {
	String getUserById(Long id);

	public TrainerRequest toDtoWithBlended(Trainer t);
}
