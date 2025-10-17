package com.hachionUserDashboard.controller;
//
//import jakarta.servlet.http.Cookie;
//import jakarta.servlet.http.HttpServletRequest;
//import jakarta.servlet.http.HttpServletResponse;
//
//import org.springframework.http.ResponseEntity;
//import org.springframework.web.bind.annotation.*;
//
//@RestController
//@RequestMapping
//@CrossOrigin( // allow your web apps to call this with credentials
//		origins = { "https://hachion.co", "https://www.hachion.co", "https://test.hachion.co",
//				"https://api.test.hachion.co" // optional: if you ever call from API docs, etc.
//		}, allowCredentials = "true", allowedHeaders = "*", methods = { RequestMethod.POST, RequestMethod.OPTIONS })
//public class LogoutController {
//
//	@PostMapping("/api/logout")
//	public ResponseEntity<Void> logout(HttpServletRequest request, HttpServletResponse response) {
//
//		// 1) Invalidate server session (kills Spring's JSESSIONID on server)
//		var session = request.getSession(false);
//		if (session != null)
//			session.invalidate();
//
//		// 2) Expire ALL cookies that arrived on this request, mirroring their attrs
//		Cookie[] cookies = request.getCookies();
//		if (cookies != null) {
//			for (Cookie c : cookies) {
//				addDeletionCookie(response, c.getName(), c.getPath(), c.getDomain());
//			}
//		}
//
//		// 3) Belt-and-suspenders: also explicitly clear common auth-related cookies
//		// JSESSIONID (host-only) — no Domain attribute
//		setCookieHeader(response, "JSESSIONID=; Max-Age=0; Path=/; HttpOnly; Secure; SameSite=None");
//
//		// JSESSIONID scoped to parent domain (in case your infra ever set it that way)
//		setCookieHeader(response,
//				"JSESSIONID=; Max-Age=0; Path=/; Domain=.hachion.co; HttpOnly; Secure; SameSite=None");
//
//		// Custom cookies you set in SuccessHandler
//		setCookieHeader(response, "avatar=; Max-Age=0; Path=/; Domain=hachion.co; Secure; SameSite=Lax");
//		setCookieHeader(response, "avatar=; Max-Age=0; Path=/; Domain=.hachion.co; Secure; SameSite=Lax");
//
//		setCookieHeader(response, "flow=; Max-Age=0; Path=/; Domain=hachion.co; Secure; SameSite=Lax");
//		setCookieHeader(response, "flow=; Max-Age=0; Path=/; Domain=.hachion.co; Secure; SameSite=Lax");
//
//		// 204 No Content is fine
//		return ResponseEntity.noContent().build();
//	}
//
//	/** Create a deletion Set-Cookie that mirrors the original cookie's scope. */
//	private void addDeletionCookie(HttpServletResponse response, String name, String path, String domain) {
//		StringBuilder sb = new StringBuilder();
//		sb.append(name).append("=;");
//		sb.append(" Max-Age=0;");
//		sb.append(" Path=").append((path == null || path.isBlank()) ? "/" : path).append(";");
//		if (domain != null && !domain.isBlank()) {
//			sb.append(" Domain=").append(domain).append(";");
//		}
//		// Make it robust for cross-site setups
//		// If the original cookie was HttpOnly/SameSite=None we can't detect that here,
//		// but setting Secure + SameSite=None is safe for deletion in modern browsers.
//		sb.append(" Secure;");
//		sb.append(" SameSite=None");
//		// If you know some cookies were HttpOnly, you can add HttpOnly here as well:
//		// sb.append("; HttpOnly");
//		setCookieHeader(response, sb.toString());
//	}
//
//	/** Adds a Set-Cookie header (Servlet Cookie API doesn't expose SameSite). */
//	private void setCookieHeader(HttpServletResponse response, String value) {
//		response.addHeader("Set-Cookie", value);
//	}
//}
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping
@CrossOrigin(
    origins = { 
        "https://hachion.co", 
        "https://www.hachion.co", 
        "https://test.hachion.co",
        "https://api.test.hachion.co" 
    },
    allowCredentials = "true", 
    allowedHeaders = "*", 
    methods = { RequestMethod.POST, RequestMethod.OPTIONS }
)
public class LogoutController {

    @PostMapping("/api/logout")
    public ResponseEntity<Void> logout(HttpServletRequest request, HttpServletResponse response) {
        System.out.println("=== [LogoutController] Logout request received ===");

        // 1) Invalidate server session (kills Spring's JSESSIONID on server)
        var session = request.getSession(false);
        if (session != null) {
            session.invalidate();
            System.out.println("[LogoutController] Session invalidated: " + session.getId());
        } else {
            System.out.println("[LogoutController] No existing session found.");
        }

        // 2) Log incoming cookies
        Cookie[] cookies = request.getCookies();
        if (cookies != null && cookies.length > 0) {
            System.out.println("[LogoutController] Incoming cookies:");
            for (Cookie c : cookies) {
                System.out.printf("  %s = %s ; path=%s ; domain=%s%n",
                        c.getName(), c.getValue(), c.getPath(), c.getDomain());
                addDeletionCookie(response, c.getName(), c.getPath(), c.getDomain());
            }
        } else {
            System.out.println("[LogoutController] No cookies received in request.");
        }

        // 3) Belt-and-suspenders: explicitly clear known cookies
        System.out.println("[LogoutController] Adding explicit deletion cookies for JSESSIONID, avatar, flow.");

        setCookieHeader(response, "JSESSIONID=; Max-Age=0; Path=/; HttpOnly; Secure; SameSite=None");
        setCookieHeader(response, "JSESSIONID=; Max-Age=0; Path=/; Domain=.hachion.co; HttpOnly; Secure; SameSite=None");

        setCookieHeader(response, "avatar=; Max-Age=0; Path=/; Domain=hachion.co; Secure; SameSite=Lax");
        setCookieHeader(response, "avatar=; Max-Age=0; Path=/; Domain=.hachion.co; Secure; SameSite=Lax");

        setCookieHeader(response, "flow=; Max-Age=0; Path=/; Domain=hachion.co; Secure; SameSite=Lax");
        setCookieHeader(response, "flow=; Max-Age=0; Path=/; Domain=.hachion.co; Secure; SameSite=Lax");

        System.out.println("=== [LogoutController] Logout complete. Returning 204 No Content. ===");

        return ResponseEntity.noContent().build();
    }

    /** Create a deletion Set-Cookie that mirrors the original cookie's scope. */
    private void addDeletionCookie(HttpServletResponse response, String name, String path, String domain) {
        StringBuilder sb = new StringBuilder();
        sb.append(name).append("=;");
        sb.append(" Max-Age=0;");
        sb.append(" Path=").append((path == null || path.isBlank()) ? "/" : path).append(";");
        if (domain != null && !domain.isBlank()) {
            sb.append(" Domain=").append(domain).append(";");
        }
        sb.append(" Secure;");
        sb.append(" SameSite=None");
        response.addHeader("Set-Cookie", sb.toString());

        System.out.println("[LogoutController] Added deletion Set-Cookie for: " + name + 
                           " (path=" + path + ", domain=" + domain + ")");
    }

    /** Adds a Set-Cookie header (Servlet Cookie API doesn't expose SameSite). */
    private void setCookieHeader(HttpServletResponse response, String value) {
        response.addHeader("Set-Cookie", value);
        System.out.println("[LogoutController] Explicit Set-Cookie header added: " + value);
    }
}
