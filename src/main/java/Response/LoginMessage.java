package Response;

public class LoginMessage {
	String message;
	Boolean status;
	 private String username;
	    private String email;
	public LoginMessage() {
		
	}
	public String getMessage() {
		return message;
	}
	public void setMessage(String message) {
		this.message = message;
	}
	public Boolean getStatus() {
		return status;
	}
	public void setStatus(Boolean status) {
		this.status = status;
	}
	public String getUsername() {
		return username;
	}
	public void setUsername(String username) {
		this.username = username;
	}
	public String getEmail() {
		return email;
	}
	public void setEmail(String email) {
		this.email = email;
	}
	public LoginMessage(String message, Boolean status, String username, String email) {
		super();
		this.message = message;
		this.status = status;
		this.username = username;
		this.email = email;
	}
	@Override
	public String toString() {
		return "LoginMessage [message=" + message + ", status=" + status + ", username=" + username + ", email=" + email
				+ "]";
	}

	
}
