package com.hachionUserDashboard.controller;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

import java.lang.reflect.Field;
import java.util.Map;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.oauth2.core.oidc.user.OidcUser;

import com.hachionUserDashboard.entity.RegisterStudent;
import com.hachionUserDashboard.repository.RegisterStudentRepository;

/**
 * Plain unit test (no Spring context, no database). /api/me used to build its
 * body with Map.of(), which throws on null values - so a Google-login user
 * with no stored profile_image (the normal case) got an error instead of 200.
 */
class GoogleSignupControllerTest {

	private GoogleSignupController controller;
	private RegisterStudentRepository repo;

	@BeforeEach
	void setUp() throws Exception {
		controller = new GoogleSignupController();
		repo = mock(RegisterStudentRepository.class);
		Field f = GoogleSignupController.class.getDeclaredField("userRepository");
		f.setAccessible(true);
		f.set(controller, repo);
	}

	@Test
	void me_returns200_whenOptionalFieldsAreNull() {
		OidcUser oidc = mock(OidcUser.class);
		when(oidc.getEmail()).thenReturn("student@example.com");
		when(oidc.getFullName()).thenReturn(null);
		when(oidc.getPicture()).thenReturn(null);

		RegisterStudent student = new RegisterStudent();
		student.setEmail("student@example.com");
		student.setUserName(null);
		student.setProfileImage(null);
		when(repo.findByEmailForProfile("student@example.com")).thenReturn(Optional.of(student));

		ResponseEntity<?> res = controller.me(oidc);

		assertEquals(HttpStatus.OK, res.getStatusCode());
		Map<?, ?> body = (Map<?, ?>) res.getBody();
		assertEquals("student@example.com", body.get("email"));
		assertNull(body.get("name"));
		assertNull(body.get("picture"));
	}

	@Test
	void me_fallsBackToGoogleProfile_whenDbFieldsAreNull() {
		OidcUser oidc = mock(OidcUser.class);
		when(oidc.getEmail()).thenReturn("student@example.com");
		when(oidc.getFullName()).thenReturn("Google Name");
		when(oidc.getPicture()).thenReturn("https://lh3.googleusercontent.com/a/pic");

		RegisterStudent student = new RegisterStudent();
		student.setEmail("student@example.com");
		when(repo.findByEmailForProfile("student@example.com")).thenReturn(Optional.of(student));

		Map<?, ?> body = (Map<?, ?>) controller.me(oidc).getBody();
		assertEquals("Google Name", body.get("name"));
		assertEquals("https://lh3.googleusercontent.com/a/pic", body.get("picture"));
	}

	@Test
	void me_returns401_whenNotAuthenticated() {
		assertEquals(HttpStatus.UNAUTHORIZED, controller.me(null).getStatusCode());
	}

	@Test
	void me_returns401_whenUserNotInDb() {
		OidcUser oidc = mock(OidcUser.class);
		when(oidc.getEmail()).thenReturn("nobody@example.com");
		when(repo.findByEmailForProfile("nobody@example.com")).thenReturn(Optional.empty());

		assertEquals(HttpStatus.UNAUTHORIZED, controller.me(oidc).getStatusCode());
	}
}
