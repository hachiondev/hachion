package Response;

public class UserProfileResponse {
	private String name;
	private String email;
	private Long mobile;

	public UserProfileResponse() {
	}

	public UserProfileResponse(String name, String email, Long mobile) {
		this.name = name;
		this.email = email;
		this.mobile = mobile;

	}

	// Getters and Setters

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public Long getMobile() {
		return mobile;
	}

	public void setPhone(Long mobile) {
		this.mobile = mobile;
	}

}
