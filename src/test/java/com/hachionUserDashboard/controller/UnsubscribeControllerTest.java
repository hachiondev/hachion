package com.hachionUserDashboard.controller;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.util.List;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.server.ResponseStatusException;

import com.hachionUserDashboard.dto.UnsubscribeRequest;
import com.hachionUserDashboard.dto.UnsubscribeResponse;
import com.hachionUserDashboard.exception.GlobalExceptionHandler;

import Service.UnsubscribeService;

/**
 * Standalone MockMvc (no Spring context, no database). The real
 * GlobalExceptionHandler is registered as advice on purpose: it is the
 * catch-all that used to turn every error here into a 400 with the raw
 * exception text, so this proves the controller-local handlers take precedence.
 */
class UnsubscribeControllerTest {

	private MockMvc mvc;
	private UnsubscribeService service;

	@BeforeEach
	void setUp() {
		service = mock(UnsubscribeService.class);
		UnsubscribeController controller = new UnsubscribeController();
		controller.unsubscribeService = service;
		mvc = MockMvcBuilders.standaloneSetup(controller).setControllerAdvice(new GlobalExceptionHandler()).build();
	}

	private static final String BODY = "{\"email\":\"a@b.com\",\"userName\":\"Asha\"}";

	@Test
	void success_returns200_withStatusAndMessage() throws Exception {
		UnsubscribeResponse r = new UnsubscribeResponse();
		r.setEmail("a@b.com");
		r.setStatus("UNSUBSCRIBED");
		r.setMessage("You have been unsubscribed successfully.");
		when(service.createUnsubscribeDetails(any(UnsubscribeRequest.class))).thenReturn(r);

		mvc.perform(post("/unsubscribe").contentType(MediaType.APPLICATION_JSON).accept(MediaType.APPLICATION_JSON).content(BODY))
				.andExpect(status().isOk()).andExpect(jsonPath("$.status").value("UNSUBSCRIBED"))
				.andExpect(jsonPath("$.message").value("You have been unsubscribed successfully."));
	}

	@Test
	void alreadyUnsubscribed_returns200() throws Exception {
		UnsubscribeResponse r = new UnsubscribeResponse();
		r.setStatus("ALREADY_UNSUBSCRIBED");
		r.setMessage("This email is already unsubscribed.");
		when(service.createUnsubscribeDetails(any(UnsubscribeRequest.class))).thenReturn(r);

		mvc.perform(post("/unsubscribe").contentType(MediaType.APPLICATION_JSON).accept(MediaType.APPLICATION_JSON).content(BODY))
				.andExpect(status().isOk()).andExpect(jsonPath("$.status").value("ALREADY_UNSUBSCRIBED"));
	}

	@Test
	void emailNotFound_returns404_withCleanMessage_notTheWrappedExceptionString() throws Exception {
		when(service.createUnsubscribeDetails(any(UnsubscribeRequest.class))).thenThrow(
				new ResponseStatusException(HttpStatus.NOT_FOUND, "Email not found. Please check your email address."));

		mvc.perform(post("/unsubscribe").contentType(MediaType.APPLICATION_JSON).accept(MediaType.APPLICATION_JSON).content(BODY))
				.andExpect(status().isNotFound()).andExpect(jsonPath("$.status").value("ERROR"))
				.andExpect(jsonPath("$.message").value("Email not found. Please check your email address."));
	}

	@Test
	void invalidEmail_returns400() throws Exception {
		when(service.createUnsubscribeDetails(any(UnsubscribeRequest.class)))
				.thenThrow(new ResponseStatusException(HttpStatus.BAD_REQUEST, "Please enter a valid email address."));

		mvc.perform(post("/unsubscribe").contentType(MediaType.APPLICATION_JSON).accept(MediaType.APPLICATION_JSON).content(BODY))
				.andExpect(status().isBadRequest())
				.andExpect(jsonPath("$.message").value("Please enter a valid email address."));
	}

	@Test
	void unexpectedFailure_returns500_andNeverLeaksTheInternalMessage() throws Exception {
		when(service.createUnsubscribeDetails(any(UnsubscribeRequest.class)))
				.thenThrow(new RuntimeException("could not execute statement; SQL [n/a]; secret-internal-detail"));

		mvc.perform(post("/unsubscribe").contentType(MediaType.APPLICATION_JSON).accept(MediaType.APPLICATION_JSON).content(BODY))
				.andExpect(status().isInternalServerError())
				.andExpect(jsonPath("$.message")
						.value("We couldn't process your unsubscribe request. Please try again."))
				.andExpect(content().string(org.hamcrest.Matchers.not(org.hamcrest.Matchers.containsString("SQL"))))
				.andExpect(content()
						.string(org.hamcrest.Matchers.not(org.hamcrest.Matchers.containsString("secret-internal"))));
	}

	@Test
	void malformedJson_returns400_withSafeMessage() throws Exception {
		mvc.perform(post("/unsubscribe").contentType(MediaType.APPLICATION_JSON).accept(MediaType.APPLICATION_JSON).content("{not json"))
				.andExpect(status().isBadRequest()).andExpect(jsonPath("$.status").value("ERROR"));
	}

	@Test
	void adminList_omitsNullStatusAndMessage() throws Exception {
		UnsubscribeResponse item = new UnsubscribeResponse();
		item.setEmail("a@b.com");
		when(service.getAllUnsubscribeDetails()).thenReturn(List.of(item));

		mvc.perform(get("/unsubscribe").accept(MediaType.APPLICATION_JSON)).andExpect(status().isOk()).andExpect(jsonPath("$[0].email").value("a@b.com"))
				.andExpect(jsonPath("$[0].status").doesNotExist()).andExpect(jsonPath("$[0].message").doesNotExist());
	}
}
