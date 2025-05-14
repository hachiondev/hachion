package Response;

public class UserProfileResponse {
	private String name;
	private String email;
	private Long mobile;
	private String studentId;

	public UserProfileResponse() {
	}

	public String getStudentId() {
		return studentId;
	}

	public void setStudentId(String studentId) {
		this.studentId = studentId;
	}

	public void setMobile(Long mobile) {
		this.mobile = mobile;
	}

	public UserProfileResponse(String name, String email, Long mobile, String studentId) {
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

	public Long getMobile() {
		return mobile;
	}

	public void setPhone(Long mobile) {
		this.mobile = mobile;
	}

}
