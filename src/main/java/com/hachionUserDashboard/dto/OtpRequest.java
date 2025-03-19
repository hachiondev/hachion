//package com.hachionUserDashboard.dto;
//
//public class OtpRequest {
//	
//	private String email;
//    private String otp;
//    private String name;
//    private String password;
//    
//    
//    // Getters and setters
//	
//    public String getEmail() {
//		return email;
//	}
//	public void setEmail(String email) {
//		this.email = email;
//	}
//	public String getOtp() {
//		return otp;
//	}
//	public void setOtp(String otp) {
//		this.otp = otp;
//	}
//	public String getName() {
//		return name;
//	}
//	public void setName(String name) {
//		this.name = name;
//	}
//	public String getPassword() {
//		return password;
//	}
//	public void setPassword(String password) {
//		this.password = password;
//	}
//}
package com.hachionUserDashboard.dto;

public class OtpRequest {
    private String email;
    private String otp;
    private String password; 
    // This will contain the password the user wants to set
    
	public String getEmail() {
		return email;
	}
	public void setEmail(String email) {
		this.email = email;
	}
	public String getOtp() {
		return otp;
	}
	public void setOtp(String otp) {
		this.otp = otp;
	}
	public String getPassword() {
		return password;
	}
	public void setPassword(String password) {
		this.password = password;
	}

}
