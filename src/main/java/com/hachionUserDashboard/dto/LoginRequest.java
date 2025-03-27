//package com.hachionUserDashboard.dto;
////
////public class LoginRequest {
////	
////	private String userName;
////    private String password;
////    private String email;
////
////    public String getUserName() {
////        return userName;
////    }
////
////    public void setUserName(String userName) {
////        this.userName = userName;
////    }
////
////    public String getPassword() {
////        return password;
////    }
////
////    public void setPassword(String password) {
////        this.password = password;
////    }
////
////	public Object getEmail() {
////		// TODO Auto-generated method stub
////		return null;
////	}
////	
////	public void setEmail(String email) {
////        this.email = email;
////    }
////}
//
//
//public class LoginRequest {
//    private String email;
//    private String password;
//
//    // Getters and Setters
//    public String getEmail() {
//        return email;
//    }
//
//    public void setEmail(String email) {
//        this.email = email;
//    }
//
//    public String getPassword() {
//        return password;
//    }
//
//    public void setPassword(String password) {
//        this.password = password;
//    }
//}
package com.hachionUserDashboard.dto;
public class LoginRequest{
	private String email;
	private String password;
	
	public LoginRequest() {
		
	}

	public LoginRequest(String email, String password) {
		super();
		this.email = email;
		this.password = password;
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
		return "LoginRequest [email=" + email + ", password=" + password + "]";
	}

	


}