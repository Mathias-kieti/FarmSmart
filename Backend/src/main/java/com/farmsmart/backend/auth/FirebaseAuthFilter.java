package com.farmsmart.backend.auth;

import java.io.IOException;

import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseToken;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.ObjectProvider;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

@Component
@Order(Ordered.HIGHEST_PRECEDENCE)
public class FirebaseAuthFilter extends OncePerRequestFilter {
    private final ObjectProvider<FirebaseAuth> firebaseAuthProvider;
    private final String authMode;

    public FirebaseAuthFilter(
            ObjectProvider<FirebaseAuth> firebaseAuthProvider,
            @Value("${farmsmart.auth.mode:firebase}") String authMode) {
        this.firebaseAuthProvider = firebaseAuthProvider;
        this.authMode = authMode;
    }

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain) throws ServletException, IOException {
        try {
            if ("OPTIONS".equalsIgnoreCase(request.getMethod())) {
                filterChain.doFilter(request, response);
                return;
            }

            if ("off".equalsIgnoreCase(authMode)) {
                UserContext.set(new AuthUser(
                        headerOrDefault(request, "x-user-id", "dev-user"),
                        headerOrDefault(request, "x-user-email", "dev@farmsmart.local"),
                        headerOrDefault(request, "x-user-name", "FarmSmart Dev")));
                filterChain.doFilter(request, response);
                return;
            }

            String authHeader = request.getHeader("Authorization");
            boolean hasBearerToken = authHeader != null && authHeader.startsWith("Bearer ");

            if (!hasBearerToken) {
                if (requiresAuth(request)) {
                    writeUnauthorized(response);
                    return;
                }
                filterChain.doFilter(request, response);
                return;
            }

            String token = authHeader.substring("Bearer ".length());
            FirebaseToken decoded;
            try {
                decoded = firebaseAuthProvider.getObject().verifyIdToken(token);
            } catch (Exception exception) {
                writeUnauthorized(response);
                return;
            }
            UserContext.set(new AuthUser(decoded.getUid(), decoded.getEmail(), decoded.getName()));
            filterChain.doFilter(request, response);
        } finally {
            UserContext.clear();
        }
    }

    private boolean requiresAuth(HttpServletRequest request) {
        String path = request.getRequestURI();
        String method = request.getMethod();

        if (path.startsWith("/api/profile")) return true;
        if (path.equals("/api/groups/mine")) return true;
        if (path.matches("/api/groups/.+/join")) return true;
        if (path.startsWith("/api/listings") && !"GET".equalsIgnoreCase(method)) return true;
        if (path.startsWith("/api/groups") && "POST".equalsIgnoreCase(method)) return true;

        return false;
    }

    private String headerOrDefault(HttpServletRequest request, String name, String fallback) {
        String value = request.getHeader(name);
        return value == null || value.isBlank() ? fallback : value;
    }

    private void writeUnauthorized(HttpServletResponse response) throws IOException {
        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
        response.setContentType("application/json");
        response.getWriter().write("{\"message\":\"Unauthorized\"}");
    }
}
