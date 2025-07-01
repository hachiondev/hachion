
package com.hachionUserDashboard.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.oauth2.client.oidc.userinfo.OidcUserRequest;
import org.springframework.security.oauth2.client.oidc.userinfo.OidcUserService;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserService;
import org.springframework.security.oauth2.core.oidc.user.OidcUser;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.security.web.util.matcher.AntPathRequestMatcher;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

	@Bean
	public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
		http.csrf(csrf -> csrf.disable())
				.authorizeHttpRequests(authorize -> authorize.requestMatchers(new AntPathRequestMatcher("/**"))
						.permitAll().anyRequest().authenticated())
				.oauth2Login(oauth2 -> oauth2.loginPage("/api/v1/user/login2")
						.successHandler(authenticationSuccessHandler()))
				.formLogin(form -> form.disable()).httpBasic(httpBasic -> httpBasic.disable());

		return http.build();
	}

	@Bean
	public AuthenticationSuccessHandler authenticationSuccessHandler() {
		return (request, response, authentication) -> {
			System.out.println("Login successful for user: " + authentication.getName());
			response.sendRedirect("/api/v1/user/profile");
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
