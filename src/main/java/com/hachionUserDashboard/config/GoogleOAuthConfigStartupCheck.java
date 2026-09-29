package com.hachionUserDashboard.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;

// Reports, at startup, whether GOOGLE_OAUTH_CLIENT_SECRET actually resolved
// to a non-blank value for spring.security.oauth2.client.registration.google.client-secret,
// and whether that value came from the OS environment or fell through to the
// (blank) ${GOOGLE_OAUTH_CLIENT_SECRET:} default in application.properties -
// without ever printing the secret itself. Mirrors TwilioConfigStartupCheck's
// pattern for the same reason: Spring Security's oauth2Login() does not fail
// startup on a blank client secret, it only fails later, at token-exchange
// time on the first real login attempt, as an opaque invalid_client error
// surfaced through SecurityConfig's googleAuthFailureHandler. This makes a
// misconfigured/missing secret visible in the boot log immediately instead
// of only after a user hits it.
@Component
public class GoogleOAuthConfigStartupCheck {

	@Value("${spring.security.oauth2.client.registration.google.client-secret:}")
	private String clientSecret;

	@EventListener(ApplicationReadyEvent.class)
	public void logGoogleOAuthConfigStatus() {
		boolean secretConfigured = clientSecret != null && !clientSecret.isBlank();

		System.out.println("Google OAuth client secret configured: " + secretConfigured);
		System.out.println("Google OAuth client secret source: " + credentialSource(secretConfigured));

		if (!secretConfigured) {
			System.out.println(
					"GOOGLE_OAUTH_CLIENT_SECRET is not configured. Google Sign-In will fail at token exchange (invalid_client).");
		}
	}

	// Never returns or logs the env var's value - only whether the OS process
	// environment itself supplied a non-blank value for that name, which is
	// what determines whether Spring's ${GOOGLE_OAUTH_CLIENT_SECRET:} placeholder
	// actually resolved from the environment or fell through to its blank default.
	private String credentialSource(boolean configured) {
		if (!configured) {
			return "none";
		}
		String envValue = System.getenv("GOOGLE_OAUTH_CLIENT_SECRET");
		return (envValue != null && !envValue.isBlank()) ? "environment" : "property";
	}
}
