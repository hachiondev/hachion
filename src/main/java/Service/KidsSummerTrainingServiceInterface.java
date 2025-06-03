package Service;

import java.util.List;

import com.hachionUserDashboard.dto.KidsSummerTrainingRequest;

import Response.KidsSummerTrainingResponse;

public interface KidsSummerTrainingServiceInterface {

	public KidsSummerTrainingResponse addKidsSummerTrainingDetails(KidsSummerTrainingRequest kidsSummerTrainingRequest);

	public KidsSummerTrainingResponse updateKidsSummerTrainingDetails(
			KidsSummerTrainingRequest kidsSummerTrainingRequest, Long kidsSummerTrainingId);

	public List<KidsSummerTrainingResponse> getAllKidsSummerTraining();

	public void deleteKidsSummerTraining(Long kidsSummerTrainingId);

}
