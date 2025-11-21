package Service;

import java.io.IOException;

import org.springframework.web.multipart.MultipartFile;

import com.hachionUserDashboard.dto.TrainerRequest;
import com.hachionUserDashboard.entity.Trainer;

public interface TrainerService {
	String getUserById(Long id);

	public TrainerRequest toDtoWithBlended(Trainer t);

	Trainer addTrainer(Trainer trainer, MultipartFile trainerImage) throws IOException;

	Trainer updateTrainer(int trainerId, Trainer updatedTrainer, MultipartFile trainerImage) throws IOException;

	void deleteTrainer(int trainerId);

}
