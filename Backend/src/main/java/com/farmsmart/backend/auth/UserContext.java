package com.farmsmart.backend.auth;

import com.farmsmart.backend.common.ApiException;

public final class UserContext {
    private static final ThreadLocal<AuthUser> CURRENT_USER = new ThreadLocal<>();

    private UserContext() {
    }

    public static void set(AuthUser user) {
        CURRENT_USER.set(user);
    }

    public static AuthUser get() {
        return CURRENT_USER.get();
    }

    public static AuthUser requireUser() {
        AuthUser user = get();
        if (user == null) {
            throw ApiException.unauthorized("Authentication is required");
        }
        return user;
    }

    public static void clear() {
        CURRENT_USER.remove();
    }
}
