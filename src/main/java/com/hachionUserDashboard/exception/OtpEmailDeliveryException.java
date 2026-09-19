package com.hachionUserDashboard.exception;

/**
 * Thrown when the OTP (or related) transactional email could not be
 * delivered - e.g. the mail relay rejected the configured SMTP credentials
 * (org.springframework.mail.MailAuthenticationException), a timeout, etc.
 *
 * Deliberately unchecked and carries a clear, end-user-safe message so that
 * whichever controller catches it can return an accurate HTTP status
 * (503) instead of the raw mail-library exception text ("Authentication
 * failed" for a bad SMTP password) leaking to the user via the app-wide
 * GlobalExceptionHandler catch-all, which previously made an internal mail
 * relay misconfiguration look exactly like an OTP/login authentication
 * failure.
 */
public class OtpEmailDeliveryException extends RuntimeException {

	private static final long serialVersionUID = 1L;

	public OtpEmailDeliveryException(String message, Throwable cause) {
		super(message, cause);
	}
}
