package com.hachionUserDashboard.entity;

import java.time.LocalDateTime;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;

@Entity
public class OtpEntity {
	 @Id
	    private String email;
	    private String otp;
	    private LocalDateTime expirationTime;
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
		public LocalDateTime getExpirationTime() {
			return expirationTime;
		}
		public void setExpirationTime(LocalDateTime expirationTime) {
			this.expirationTime = expirationTime;
		}
}
