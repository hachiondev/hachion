package Response;

public class UserProfileResponse {
	private String name;
	private String email;
	private String mobile;
	private String studentId;
	private String profileImage;

	public UserProfileResponse() {
	}

	public String getStudentId() {
		return studentId;
	}

	public void setStudentId(String studentId) {
		this.studentId = studentId;
	}

	public void setMobile(String mobile) {
		this.mobile = mobile;
	}

	public UserProfileResponse(String name, String email, String mobile, String studentId) {
		super();
		this.name = name;
		this.email = email;
		this.mobile = mobile;
		this.studentId = studentId;
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

	public String getMobile() {
		return mobile;
	}

	public void setPhone(String mobile) {
		this.mobile = mobile;
	}

	public String getProfileImage() {
		return profileImage;
	}

	public void setProfileImage(String profileImage) {
		this.profileImage = profileImage;
	}

}
