package com.hachionUserDashboard.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.Collections;
import java.util.List;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

import com.hachionUserDashboard.dto.UnsubscribeRequest;
import com.hachionUserDashboard.dto.UnsubscribeResponse;
import com.hachionUserDashboard.entity.UnsubscribeEntity;
import com.hachionUserDashboard.repository.RegisterStudentRepository;
import com.hachionUserDashboard.repository.UnsubscribeRepository;

class UnsubscribeServiceImplTest {

	private UnsubscribeServiceImpl service;
	private RegisterStudentRepository students;
	private UnsubscribeRepository unsubscribes;

	@BeforeEach
	void setUp() {
		service = new UnsubscribeServiceImpl();
		students = mock(RegisterStudentRepository.class);
		unsubscribes = mock(UnsubscribeRepository.class);
		service.registerStudentRepository = students;
		service.unsubscribeRepository = unsubscribes;
	}

	private static UnsubscribeRequest request(String email) {
		UnsubscribeRequest r = new UnsubscribeRequest();
		r.setEmail(email);
		return r;
	}

	private static List<Object[]> row(String name, String status) {
		return Collections.singletonList(new Object[] { name, status });
	}

	@Test
	void validSubscribedUser_isDisabledLoggedAndReportedAsUnsubscribed() {
		when(students.findUserNameAndStatusByEmail("a@b.com")).thenReturn(row("Asha", "ACTIVE"));
		when(unsubscribes.save(any(UnsubscribeEntity.class))).thenAnswer(i -> i.getArgument(0));

		UnsubscribeResponse res = service.createUnsubscribeDetails(request("  a@b.com  "));

		assertEquals(UnsubscribeServiceImpl.STATUS_UNSUBSCRIBED, res.getStatus());
		assertEquals("You have been unsubscribed successfully.", res.getMessage());
		assertEquals("Asha", res.getUserName());
		verify(students).disableByEmailNative("a@b.com");
		verify(unsubscribes).save(any(UnsubscribeEntity.class));
	}

	@Test
	void alreadyUnsubscribed_isIdempotentSuccess_andWritesNothing() {
		when(students.findUserNameAndStatusByEmail("a@b.com")).thenReturn(row("Asha", "DISABLED"));

		UnsubscribeResponse res = service.createUnsubscribeDetails(request("a@b.com"));

		assertEquals(UnsubscribeServiceImpl.STATUS_ALREADY_UNSUBSCRIBED, res.getStatus());
		assertEquals("This email is already unsubscribed.", res.getMessage());
		verify(students, never()).disableByEmailNative(any());
		verify(unsubscribes, never()).save(any());
	}

	@Test
	void unknownEmail_is404_withUserFacingReason() {
		when(students.findUserNameAndStatusByEmail("nobody@b.com")).thenReturn(Collections.emptyList());

		ResponseStatusException ex = assertThrows(ResponseStatusException.class,
				() -> service.createUnsubscribeDetails(request("nobody@b.com")));

		assertEquals(HttpStatus.NOT_FOUND, ex.getStatusCode());
		assertEquals("Email not found. Please check your email address.", ex.getReason());
		verify(unsubscribes, never()).save(any());
	}

	@Test
	void invalidOrMissingEmail_is400_beforeAnyDatabaseAccess() {
		for (String bad : new String[] { null, "", "   ", "not-an-email", "a@b", "a b@c.com" }) {
			ResponseStatusException ex = assertThrows(ResponseStatusException.class,
					() -> service.createUnsubscribeDetails(request(bad)), "input: " + bad);
			assertEquals(HttpStatus.BAD_REQUEST, ex.getStatusCode());
			assertEquals("Please enter a valid email address.", ex.getReason());
		}
		ResponseStatusException nullBody = assertThrows(ResponseStatusException.class,
				() -> service.createUnsubscribeDetails(null));
		assertEquals(HttpStatus.BAD_REQUEST, nullBody.getStatusCode());
		verify(students, never()).findUserNameAndStatusByEmail(any());
	}

	@Test
	void adminListResponse_doesNotCarryStatusOrMessage() {
		UnsubscribeEntity e = new UnsubscribeEntity();
		e.setEmail("a@b.com");
		when(unsubscribes.findAllByOrderByDateDesc()).thenReturn(List.of(e));

		UnsubscribeResponse item = service.getAllUnsubscribeDetails().get(0);

		assertNull(item.getStatus());
		assertNull(item.getMessage());
	}
}
