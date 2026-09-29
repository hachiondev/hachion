package com.hachionUserDashboard.config;

import static org.junit.jupiter.api.Assertions.assertEquals;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.assertj.AssertableApplicationContext;
import org.springframework.boot.test.context.runner.ApplicationContextRunner;
import org.springframework.boot.test.context.ConfigDataApplicationContextInitializer;

/**
 * Resolves the REAL application*.properties for each profile through Spring's
 * config-data loader (no beans are created, so nothing connects to any
 * database) and pins the effective OAuth/frontend/backend URLs per environment.
 */
class OAuthProfileConfigTest {

	private static final String REDIRECT = "spring.security.oauth2.client.registration.google.redirect-uri";

	private void with(String profile, java.util.function.Consumer<AssertableApplicationContext> check) {
		new ApplicationContextRunner().withInitializer(new ConfigDataApplicationContextInitializer())
				.withPropertyValues("spring.profiles.active=" + profile).run(ctx -> check.accept(ctx));
	}

	private static String p(AssertableApplicationContext ctx, String key) {
		return ctx.getEnvironment().getProperty(key);
	}

	@Test
	void dev_pointsAtLocalhostOnly() {
		with("dev", ctx -> {
			assertEquals("http://localhost:8080/login/oauth2/code/google", p(ctx, REDIRECT));
			assertEquals("http://localhost:3000", p(ctx, "app.frontend.base-url"));
			assertEquals("http://localhost:8080", p(ctx, "app.backend.base-url"));
		});
	}

	@Test
	void test_pointsAtTestHostsOnly_neverProduction() {
		with("test", ctx -> {
			assertEquals("https://api.test.hachion.co/login/oauth2/code/google", p(ctx, REDIRECT));
			assertEquals("https://test.hachion.co", p(ctx, "app.frontend.base-url"));
			assertEquals("https://api.test.hachion.co", p(ctx, "app.backend.base-url"));
		});
	}

	@Test
	void prod_pointsAtProductionHosts() {
		with("prod", ctx -> {
			assertEquals("https://api.hachion.co/login/oauth2/code/google", p(ctx, REDIRECT));
			assertEquals("https://hachion.co", p(ctx, "app.frontend.base-url"));
			assertEquals("https://api.hachion.co", p(ctx, "app.backend.base-url"));
		});
	}

	@Test
	void documentsTheDefaultProfileWhenNothingIsSelected() {
		// application.properties sets spring.profiles.active=test. A production host that
		// does not override the profile (SPRING_PROFILES_ACTIVE / --spring.profiles.active)
		// would therefore start with TEST settings. This test pins that fact so a change to
		// the default is a conscious one.
		new ApplicationContextRunner().withInitializer(new ConfigDataApplicationContextInitializer()).run(ctx -> {
			assertEquals("test", p(ctx, "spring.profiles.active"));
			assertEquals("https://api.test.hachion.co/login/oauth2/code/google", p(ctx, REDIRECT));
		});
	}
}
