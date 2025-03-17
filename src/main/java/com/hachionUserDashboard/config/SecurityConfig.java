//package com.hachionUserDashboard.config;
//
//
//import java.io.IOException;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.context.annotation.Bean;
//import org.springframework.context.annotation.Configuration;
//import org.springframework.security.authentication.AuthenticationManager;
//import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
//import org.springframework.security.config.annotation.web.builders.HttpSecurity;
//import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
//import org.springframework.security.config.http.SessionCreationPolicy;
//import org.springframework.security.crypto.password.NoOpPasswordEncoder;
//import org.springframework.security.crypto.password.PasswordEncoder;
//import org.springframework.security.web.SecurityFilterChain;
//import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
//import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
//import org.springframework.security.web.csrf.CookieCsrfTokenRepository;
//import org.springframework.web.servlet.config.annotation.CorsRegistry;
//import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
//import com.hachionUserDashboard.filter.JwtFilter;
//import com.hachionUserDashboard.service.CustomUserDetailsService;
//import jakarta.servlet.http.HttpServletRequest;
//import jakarta.servlet.http.HttpServletResponse;
//import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
//
//@Configuration
//@EnableWebSecurity
//public class SecurityConfig extends WebSecurityConfigurerAdapter {
//
//    @Autowired
//    private CustomUserDetailsService userDetailsService;
//
//    @Autowired
//    private JwtFilter jwtFilter;
//
//    // Use NoOpPasswordEncoder for now. For production, replace this with a proper password encoder (e.g., BCryptPasswordEncoder)
//    @Bean
//    public PasswordEncoder passwordEncoder() {
//        return NoOpPasswordEncoder.getInstance();
//    }
//
//    // AuthenticationManager Bean for manual authentication handling
//    @Bean
//    public AuthenticationManager authenticationManager(AuthenticationConfiguration authenticationConfiguration) throws Exception {
//        return authenticationConfiguration.getAuthenticationManager();
//    }
//    @Override
//    protected void configure(HttpSecurity http) throws Exception {
//        http
//            .authorizeRequests()
//                .requestMatchers("/users").permitAll() // Allow access to /users endpoint
//                .anyRequest().authenticated() // Secure other endpoints
//            .and()
//            .oauth2Login(); // Enable OAuth2 Login
//    }
//    // Security Filter Chain configuration
//    @Bean
//    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
//        http
//            .csrf().disable()  // Disable CSRF protection for APIs
//            .cors()  // Enable CORS
//            .and()
//            .authorizeHttpRequests(auth -> auth
//                .requestMatchers("/authenticate", "/v3/**", "/swagger-ui/**", "/auth/**", "/otp/**", "/register").permitAll()  // Allow access without authentication to certain endpoints
//                .requestMatchers("/admin/**").hasRole("ADMIN")
//                .requestMatchers("/user/**").hasRole("USER")
//                .anyRequest().authenticated()  // Require authentication for all other requests
//            )
//            .sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS)  // Ensure stateless session management (No HTTP session will be created)
//            .and()
//            .oauth2Login(oauth2 -> oauth2
//                .loginPage("/login")
//                .successHandler(customAuthenticationSuccessHandler())  // Handle OAuth login success
//            )
//            .logout(logout -> logout
//                .logoutSuccessUrl("/login")
//            );
//
//        // Add JWT filter before UsernamePasswordAuthenticationFilter for JWT handling
//        http.addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);
//
//        return http.build();
//    }
//
//    // Custom Authentication Success Handler for OAuth login
//    @Bean
//    public AuthenticationSuccessHandler customAuthenticationSuccessHandler() {
//        return new AuthenticationSuccessHandler() {
//            @Override
//            public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response,
//                                                org.springframework.security.core.Authentication authentication) throws IOException {
//                response.sendRedirect("http://localhost:3000/home");  // Redirect to frontend on successful login
//            }
//        };
//    }
//
//    // CORS Configuration
//    @Bean
//    public WebMvcConfigurer corsConfigurer() {
//        return new WebMvcConfigurer() {
//            @Override
//            public void addCorsMappings(CorsRegistry registry) {
//                registry.addMapping("/**")
//                    .allowedOrigins("http://localhost:3000")  // Allow the frontend from port 3000
//                    .allowedMethods("*")  // Allow all HTTP methods
//                    .allowCredentials(true);  // Allow credentials (cookies, authorization headers, etc.)
//            }
//        };
//    }
//
//    // Configure authentication manager to use CustomUserDetailsService
//    @Autowired
//    protected void configure(AuthenticationManagerBuilder auth) throws Exception {
//        auth.userDetailsService(userDetailsService);
//    }

//}

package com.hachionUserDashboard.config;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfiguration;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration

public class SecurityConfig {
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
    protected void configure(HttpSecurity https) throws Exception {
        https.csrf().disable()
            .authorizeRequests()
            .requestMatchers("/public/**").permitAll()  // Allow specific paths for all
            .anyRequest().authenticated();
    }


}

