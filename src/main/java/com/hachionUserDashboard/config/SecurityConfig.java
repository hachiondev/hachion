
package com.hachionUserDashboard.config;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;

import org.springframework.beans.factory.annotation.Autowired;
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

import com.hachionUserDashboard.repository.RegisterStudentRepository;
import com.hachionUserDashboard.service.Userimpl;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

	@Bean
	public SecurityFilterChain securityFilterChain(HttpSecurity http,
			AuthenticationSuccessHandler authenticationSuccessHandler // injected GoogleAuthSuccessHandler
	) throws Exception {

		http.csrf(csrf -> csrf.disable())
				.authorizeHttpRequests(authz -> authz.requestMatchers(new AntPathRequestMatcher("/**")).permitAll()
						.anyRequest().authenticated())
				.oauth2Login(
						oauth2 -> oauth2.loginPage("/api/v1/user/login2").successHandler(authenticationSuccessHandler))
				.formLogin(form -> form.disable()).httpBasic(b -> b.disable());

		return http.build();
	}

	@Bean
	public AuthenticationSuccessHandler authenticationSuccessHandler() {
	  return (request, response, authentication) -> {
	    // Log raw header
	    System.out.println("== OAuth2 Success ==");
	    System.out.println("Raw Cookie header: " + request.getHeader("Cookie"));

	    
	    // Log individual cookies
	    var cookies = request.getCookies();
	    if (cookies == null || cookies.length == 0) {
	      System.out.println("No cookies received on callback.");
	    } else {
	      System.out.println("Cookies received:");
	      for (var c : cookies) {
	        System.out.println("  " + c.getName() + "=" + c.getValue() + " ; path=" + c.getPath());
	      }
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

	    // Redirect to your controller with flow param
	    String redirectUrl = "/api/v1/user/profile?flow=" + flow;
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
