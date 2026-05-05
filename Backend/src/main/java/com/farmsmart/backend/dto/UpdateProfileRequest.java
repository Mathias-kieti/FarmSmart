package com.farmsmart.backend.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Size;

public record UpdateProfileRequest(
        @Size(min = 2) String name,
        @Email String email,
        @Size(min = 7) String phone,
        @Size(min = 2) String county) {
}
