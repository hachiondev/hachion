package com.hachionUserDashboard.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;

import com.twilio.Twilio;
import com.twilio.exception.ApiException;
import com.twilio.rest.api.v2010.Account;

// Reports, at startup, whether TWILIO_ACCOUNT_SID / TWILIO_AUTH_TOKEN
// actually resolved to a non-empty value, where that value came from (the
// OS environment vs a properties-file default), and whether Twilio itself
// actually accepts the resolved pair - all without ever printing the
// values themselves.
//
// The acceptance check (Account.fetcher(sid).fetch()) is a single
// read-only GET of the account resource. It authenticates exactly the same
// way Message.creator(...).create() does (same Twilio.init(), same HTTP
// Basic Auth), but never creates a Message resource, so it's safe to run
// on every boot - including with the production credential - without the
// side effect of sending anything to anyone.
//
// Runs after the app is already accepting traffic (ApplicationReadyEvent)
// so none of this is a startup precondition - WhatsAppService's own
// per-call try/catch already treats a bad credential as a caught, logged
// failure at send time, not a fatal one.
@Component
public class TwilioConfigStartupCheck {

	@Value("${twilio.accountSid:}")
	private String accountSid;

	@Value("${twilio.authToken:}")
	private String authToken;

	@EventListener(ApplicationReadyEvent.class)
	public void logTwilioConfigStatus() {
		boolean sidConfigured = accountSid != null && !accountSid.isBlank();
		boolean tokenConfigured = authToken != null && !authToken.isBlank();

		System.out.println("Twilio Account SID configured: " + sidConfigured);
		System.out.println("Twilio Auth Token configured: " + tokenConfigured);
		System.out.println("Twilio Account SID source: " + credentialSource("TWILIO_ACCOUNT_SID", sidConfigured));
		System.out.println("Twilio Auth Token source: " + credentialSource("TWILIO_AUTH_TOKEN", tokenConfigured));

		if (!sidConfigured || !tokenConfigured) {
			System.out.println("Twilio credentials are not configured. WhatsApp sending will fail authentication.");
			return;
		}

		runAuthenticationCheck();
	}

	// Never returns or logs the env var's value - only whether the OS process
	// environment itself supplied a non-blank value for that name, which is
	// what determines whether Spring's ${NAME:} placeholder actually resolved
	// from the environment or fell through to a (blank) default.
	private String credentialSource(String envVarName, boolean configured) {
		if (!configured) {
			return "none";
		}
		String envValue = System.getenv(envVarName);
		return (envValue != null && !envValue.isBlank()) ? "environment" : "property";
	}

	// Categorizes the result as one of:
	//   B - Twilio authentication rejected (an ApiException came back - code
	//       20003 specifically means "Authenticate", i.e. bad credentials)
	//   C - Twilio authentication accepted (the fetch succeeded)
	//   D - network/TLS failure (couldn't even reach Twilio to get a
	//       credential verdict - DNS, connect timeout, handshake, etc.)
	// (A - credentials missing - is handled by the caller before this runs.)
	private void runAuthenticationCheck() {
		try {
			String sid = accountSid.trim();
			String token = authToken.trim();
			Twilio.init(sid, token);
			Account.fetcher(sid).fetch();
			System.out.println("Twilio authentication check: C - accepted (credential pair is valid)");
		} catch (ApiException e) {
			Integer code = e.getCode();
			if (code != null && code == 20003) {
				System.out.println("Twilio authentication check: B - rejected (error code 20003 - authentication failed)");
			} else {
				System.out.println("Twilio authentication check: B - rejected (error code " + code + ")");
			}
		} catch (Exception e) {
			System.out.println("Twilio authentication check: D - network/TLS failure (" + e.getClass().getSimpleName() + ")");
		}
	}
}
