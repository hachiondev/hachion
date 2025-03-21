package Response;

public class LoginResponse {
	String message;
	Boolean status;
	 private String userName;
	    private String email;
	
	public LoginResponse(String string) {
		
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
	public String getUserName() {
		return userName;
	}
	public void setUserName(String userName) {
		this.userName = userName;
	}
	public String getEmail() {
		return email;
	}
	public void setEmail(String email) {
		this.email = email;
	}
	public LoginResponse(String message, Boolean status, String userName, String email) {
		super();
		this.message = message;
		this.status = status;
		this.userName = userName;
		this.email = email;
	}
	
	public LoginResponse(String userName, String email) {
		super();
		this.userName = userName;
		this.email = email;
	}
	@Override
	public String toString() {
		return "LoginResponse [message=" + message + ", status=" + status + ", userName=" + userName + ", email="
				+ email + "]";
	}


}
