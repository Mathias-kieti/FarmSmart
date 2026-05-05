package com.farmsmart.backend.domain;

public record Profile(
        String id,
        String name,
        String email,
        String phone,
        String county,
        long createdAt,
        long updatedAt) {
}
