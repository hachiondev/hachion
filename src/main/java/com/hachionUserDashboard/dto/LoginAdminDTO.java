package com.hachionUserDashboard.dto;

public class LoginAdminDTO {
	private String email;
	
	 private String password;
	 
	 public LoginAdminDTO() {
		 
	 }

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
	}

	@Override
	public String toString() {
		return "LoginAdminDTO [email=" + email + ", password=" + password + "]";
	}

	public LoginAdminDTO(String email, String password) {
		super();
		this.email = email;
		this.password = password;
	}
}
