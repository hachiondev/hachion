package com.hachionUserDashboard.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.doAnswer;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.mockito.Mockito.when;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.aop.framework.ProxyFactory;
import org.springframework.transaction.PlatformTransactionManager;
import org.springframework.transaction.TransactionDefinition;
import org.springframework.transaction.TransactionStatus;
import org.springframework.transaction.annotation.AnnotationTransactionAttributeSource;
import org.springframework.transaction.interceptor.TransactionInterceptor;
import org.springframework.transaction.support.SimpleTransactionStatus;

import com.hachionUserDashboard.dto.UnsubscribeRequest;
import com.hachionUserDashboard.entity.UnsubscribeEntity;
import com.hachionUserDashboard.repository.RegisterStudentRepository;
import com.hachionUserDashboard.repository.UnsubscribeRepository;

import Service.UnsubscribeService;

/**
 * Wraps the service in a transactional proxy built the same way
 * @EnableTransactionManagement does (TransactionInterceptor +
 * AnnotationTransactionAttributeSource, which reads the REAL @Transactional
 * annotation on UnsubscribeServiceImpl - remove it and these tests fail).
 * A recording PlatformTransactionManager shows whether the "disable user" write
 * and the "unsubscribe log row" write happen inside ONE transaction, and that a
 * failure of the second write triggers a rollback instead of a commit.
 *
 * Limit: this proves the transaction boundary and rollback signalling. It does
 * not prove a real MySQL rollback - no database is involved.
 */
class UnsubscribeTransactionTest {

	private final List<String> events = new ArrayList<>();
	private RegisterStudentRepository students;
	private UnsubscribeRepository unsubscribes;
	private UnsubscribeService service;

	@BeforeEach
	void setUp() {
		events.clear();
		students = mock(RegisterStudentRepository.class);
		unsubscribes = mock(UnsubscribeRepository.class);

		UnsubscribeServiceImpl target = new UnsubscribeServiceImpl();
		target.registerStudentRepository = students;
		target.unsubscribeRepository = unsubscribes;

		PlatformTransactionManager tm = new PlatformTransactionManager() {
			@Override
			public TransactionStatus getTransaction(TransactionDefinition d) {
				events.add("BEGIN");
				return new SimpleTransactionStatus(true);
			}

			@Override
			public void commit(TransactionStatus s) {
				events.add("COMMIT");
			}

			@Override
			public void rollback(TransactionStatus s) {
				events.add("ROLLBACK");
			}
		};

		ProxyFactory pf = new ProxyFactory(target);
		pf.setInterfaces(UnsubscribeService.class);
		pf.addAdvice(new TransactionInterceptor(tm, new AnnotationTransactionAttributeSource()));
		service = (UnsubscribeService) pf.getProxy();
	}

	private static UnsubscribeRequest req(String email) {
		UnsubscribeRequest r = new UnsubscribeRequest();
		r.setEmail(email);
		return r;
	}

	private void subscribedUser() {
		when(students.findUserNameAndStatusByEmail("a@b.com"))
				.thenReturn(Collections.singletonList(new Object[] { "Asha", "ACTIVE" }));
		doAnswer(i -> { events.add("disableByEmailNative"); return null; }).when(students).disableByEmailNative("a@b.com");
	}

	@Test
	void success_disableAndLogRowShareOneTransaction_thenCommit() {
		subscribedUser();
		when(unsubscribes.save(any(UnsubscribeEntity.class))).thenAnswer(i -> {
			events.add("saveLogRow");
			return i.getArgument(0);
		});

		service.createUnsubscribeDetails(req("a@b.com"));

		assertEquals(List.of("BEGIN", "disableByEmailNative", "saveLogRow", "COMMIT"), events);
	}

	@Test
	void secondWriteFails_rollsBackTheWholeUnit_andNeverCommits() {
		subscribedUser();
		when(unsubscribes.save(any(UnsubscribeEntity.class))).thenThrow(new IllegalStateException("simulated DB failure"));

		assertThrows(IllegalStateException.class, () -> service.createUnsubscribeDetails(req("a@b.com")));

		// The disable ran INSIDE the transaction and the transaction was rolled back, never committed.
		assertEquals(List.of("BEGIN", "disableByEmailNative", "ROLLBACK"), events);
	}

	@Test
	void alreadyUnsubscribed_writesNothing() {
		when(students.findUserNameAndStatusByEmail("a@b.com"))
				.thenReturn(Collections.singletonList(new Object[] { "Asha", "DISABLED" }));

		service.createUnsubscribeDetails(req("a@b.com"));

		assertEquals(List.of("BEGIN", "COMMIT"), events); // read-only outcome, nothing written
		verifyNoInteractions(unsubscribes);
	}
}
