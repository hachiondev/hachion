
package com.hachionUserDashboard.config;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.annotation.Order;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.oauth2.client.oidc.userinfo.OidcUserRequest;
import org.springframework.security.oauth2.client.oidc.userinfo.OidcUserService;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserService;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.oidc.user.OidcUser;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.AuthenticationFailureHandler;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.security.web.util.matcher.AntPathRequestMatcher;

import com.hachionUserDashboard.repository.RegisterStudentRepository;
import com.hachionUserDashboard.service.Userimpl;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

	// Same property UserController already uses for its post-auth redirects
	// (https://hachion.co in prod, https://test.hachion.co in test) - reused
	// here so a failed Google login lands back on the real frontend login
	// page instead of Spring's default failure redirect target, which was
	// this app's oauth2Login() loginPage("/api/v1/user/login2"): a bare
	// backend endpoint (see UserController#login(), which just returns the
	// plain string "Successfully Login") on api.hachion.co, not hachion.co,
	// and hit via response.sendRedirect() so it inherited whatever scheme
	// the servlet container thought the request came in on rather than
	// always being https.
	@Value("${app.frontend.base-url}")
	private String feBase;

	@Value("${app.frontend.paths.login:/login}")
	private String feLoginPath;

	// This app's own public HTTPS origin - see the matching property's
	// comment in application-prod.properties for why the OAuth2 success
	// handler below needs it instead of a relative sendRedirect().
	@Value("${app.backend.base-url:}")
	private String beBase;

	// Spring Security's default HeadersConfigurer sends X-Frame-Options: DENY
	// on every response, which blocks the Admin Panel's certificate preview
	// iframe outright (the frontend and this API are different origins, so
	// even X-Frame-Options: SAMEORIGIN wouldn't help - that header has no way
	// to name a specific allowed origin). This narrower, higher-priority
	// chain covers only the PDF preview endpoint: it disables the blanket
	// X-Frame-Options and replaces it with CSP frame-ancestors naming the
	// exact frontend origins already trusted via CORS (CorsConfig) - nothing
	// else changes, every other endpoint keeps X-Frame-Options: DENY as-is.
	@Bean
	@Order(1)
	public SecurityFilterChain certificatePreviewFrameChain(HttpSecurity http) throws Exception {
		String frameAncestors = "frame-ancestors 'self' " + String.join(" ", CorsConfig.ALLOWED_ORIGINS);

		http.securityMatcher("/certificate/downloadForView/**")
				.cors(cors -> {
				})
				.csrf(csrf -> csrf.disable())
				.authorizeHttpRequests(authz -> authz.anyRequest().permitAll())
				.headers(headers -> headers.frameOptions(frame -> frame.disable())
						.contentSecurityPolicy(csp -> csp.policyDirectives(frameAncestors)));

		return http.build();
	}

	@Bean
	@Order(2)
	public SecurityFilterChain securityFilterChain(HttpSecurity http,
			AuthenticationSuccessHandler authenticationSuccessHandler, // injected GoogleAuthSuccessHandler
			AuthenticationFailureHandler googleAuthFailureHandler) throws Exception {

		http.cors() // ? IMPORTANT FIX
        .and().csrf(csrf -> csrf.disable())
        				.authorizeHttpRequests(authz -> authz.requestMatchers(new AntPathRequestMatcher("/**")).permitAll()
						.anyRequest().authenticated())
				.oauth2Login(oauth2 -> oauth2.loginPage("/api/v1/user/login2")
						.successHandler(authenticationSuccessHandler).failureHandler(googleAuthFailureHandler))
				.formLogin(form -> form.disable()).httpBasic(b -> b.disable());

		return http.build();
	}

	// Runs whenever the Google OAuth2 flow ends in an AuthenticationException
	// (state/nonce mismatch, user denies consent, token exchange failure,
	// etc.) instead of a successful authentication. Without this, Spring
	// Security's default falls back to the configured oauth2Login()
	// loginPage ("/api/v1/user/login2") with "?error" appended - a bare
	// backend endpoint on api.hachion.co that just prints the text
	// "Successfully Login" (see UserController#login()), which is both the
	// wrong page (not the real frontend login form) and, since it was
	// reached via a relative response.sendRedirect(), on whatever scheme the
	// servlet container resolved for the request rather than always https.
	// This instead sends the browser back to the actual frontend login page
	// (an absolute https:// URL, independent of request scheme detection)
	// with an ?error= code that Login.jsx's existing error-message effect
	// already knows how to render.
	@Bean
	public AuthenticationFailureHandler googleAuthFailureHandler() {
		return (request, response, exception) -> {
			// Diagnostic fields only. Never log the query string (carries the
			// authorization code/state), tokens or the client secret: getRequestURI()
			// is path-only, and the OAuth error code is a fixed identifier such as
			// invalid_client / invalid_token_response / authorization_request_not_found.
			String errorCode = exception instanceof OAuth2AuthenticationException oae && oae.getError() != null
					? oae.getError().getErrorCode()
					: "n/a";
			Throwable root = exception;
			while (root.getCause() != null && root.getCause() != root) {
				root = root.getCause();
			}
			System.out.println("== OAuth2 Failure == " + exception.getMessage() + " | uri=" + request.getRequestURI()
					+ " | type=" + exception.getClass().getSimpleName() + " | errorCode=" + errorCode
					+ " | rootCause=" + root.getClass().getName());
			String target = feBase + feLoginPath + "?error=GOOGLE_AUTH_FAILED";
			response.sendRedirect(target);
		};
	}

	@Bean
	public AuthenticationSuccessHandler authenticationSuccessHandler() {
	  return (request, response, authentication) -> {
	    // Cookie names only: values include the JSESSIONID of the session
	    // that was just authenticated, so logging them (as this used to, raw
	    // header included) put live session tokens in the server log.
	    System.out.println("== OAuth2 Success ==");
	    var cookies = request.getCookies();
	    if (cookies == null || cookies.length == 0) {
	      System.out.println("No cookies received on callback.");
	    } else {
	      var names = new StringBuilder();
	      for (var c : cookies) {
	        names.append(names.length() == 0 ? "" : ", ").append(c.getName());
	      }
	      System.out.println("Cookies received (names only): " + names);
	    }

	    
	    String picture = null;
        Object principal = authentication.getPrincipal();
        if (principal instanceof OidcUser oidc) {
            picture = oidc.getPicture(); // same as (String) oidc.getAttribute("picture")
        } else if (principal instanceof OAuth2User ou) {
            picture = ou.getAttribute("picture"); // may be null if profile scope missing
        }

        if (picture != null && !picture.isBlank()) {
            var avatar = new jakarta.servlet.http.Cookie(
                    "avatar",
                    URLEncoder.encode(picture, StandardCharsets.UTF_8)
            );
//            avatar.setPath("/");          // make available to your frontend
//            avatar.setMaxAge(86400);      // 1 day
//            // avatar.setHttpOnly(true);   // enable if you don't need JS to read it
            // avatar.setSecure(true);     // enable when serving over HTTPS
            avatar.setPath("/");
            avatar.setDomain("hachion.co");   // <-- make it valid for both api.* and test.*
            avatar.setMaxAge(86400);
            avatar.setSecure(true); 
            response.addCookie(avatar);
            System.out.println("Set avatar cookie from provider 'picture'.");
        } else {
            System.out.println("No 'picture' claim/attribute from provider.");
        }
	    // Extract flow from cookie
	    String flow = "login";
	    if (cookies != null) {
	      for (var c : cookies) {
	        if ("flow".equals(c.getName())) {
	          flow = "signup".equalsIgnoreCase(c.getValue()) ? "signup" : "login";
	          System.out.println("Found flow cookie: " + c.getValue() + " -> resolved flow=" + flow);
	          break;
	        }
	      }
	    }
	    if (!"signup".equals(flow)) {
	      System.out.println("Flow cookie missing or not 'signup'; defaulting to 'login'.");
	    }

	    // Clear the flow cookie
	    var clear = new jakarta.servlet.http.Cookie("flow", "");
	    clear.setPath("/");             // must match the path you set on the frontend
	    clear.setMaxAge(0);             // delete
	    response.addCookie(clear);
	    System.out.println("Cleared flow cookie.");

	    // Redirect to your controller with flow param.
	    // This MUST be an absolute URL, not a relative one: nginx terminates
	    // TLS and proxies to this app over plain HTTP, and this app doesn't
	    // trust X-Forwarded-Proto (deliberately - see application-prod's
	    // app.backend.base-url comment for why: this app's own port is also
	    // directly reachable from the internet, bypassing nginx, so blindly
	    // trusting a client-suppliable X-Forwarded-Proto header would let a
	    // request straight to that port spoof "https"). That means
	    // request.getScheme() reports "http" for every request here, TLS or
	    // not, so a *relative* sendRedirect (as this used to be) got resolved
	    // against that wrong scheme - reproduced live via `curl -sD -
	    // https://api.hachion.co/login/oauth2/code/google?code=x&state=bad`,
	    // whose (equally relative) failure-path redirect came back as
	    // `Location: http://api.hachion.co/api/v1/user/login2?error`. nginx
	    // does 301 plain-http back to https for this host, so this was
	    // silently costing every Google login two extra redirect hops rather
	    // than outright breaking it for a normal browser - but it's still
	    // wrong, and not guaranteed safe for every client. Falls back to the
	    // previous relative path only if app.backend.base-url isn't set for
	    // some profile.
	    String redirectUrl = (beBase != null && !beBase.isBlank() ? beBase : "") + "/api/v1/user/profile?flow=" + flow;
	    System.out.println("Redirecting to: " + redirectUrl);
	    response.sendRedirect(redirectUrl);
	  };
	}


	@Bean
	public OAuth2UserService<OAuth2UserRequest, OAuth2User> oauth2UserService() {
		return new DefaultOAuth2UserService();
	}

	@Bean
	public OAuth2UserService<OidcUserRequest, OidcUser> oidcUserService() {
		return new OidcUserService();
	}
}
