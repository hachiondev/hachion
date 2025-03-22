package Response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserWorkshopResponse {

	private String message;
    private String fullName;
    private String emailId;
    private String courseName;
    private String timeZone;
}
