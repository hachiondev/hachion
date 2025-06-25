package com.hachionUserDashboard.dto;

import com.hachionUserDashboard.entity.Enroll;

public class EnrollRequest extends Enroll {
	private boolean sendEmail = false;;
	private boolean sendWhatsApp = false;;

	public boolean isSendEmail() {
		return sendEmail;
	}

	public void setSendEmail(boolean sendEmail) {
		this.sendEmail = sendEmail;
	}

	public boolean isSendWhatsApp() {
		return sendWhatsApp;
	}

	public void setSendWhatsApp(boolean sendWhatsApp) {
		this.sendWhatsApp = sendWhatsApp;
	}
}