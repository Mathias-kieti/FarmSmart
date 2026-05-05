package com.farmsmart.backend.controller;

import com.farmsmart.backend.auth.UserContext;
import com.farmsmart.backend.common.ApiResponse;
import com.farmsmart.backend.domain.Profile;
import com.farmsmart.backend.dto.UpdateProfileRequest;
import com.farmsmart.backend.service.ProfileService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/profile")
public class ProfileController {
    private final ProfileService profileService;

    public ProfileController(ProfileService profileService) {
        this.profileService = profileService;
    }

    @GetMapping("/me")
    public ApiResponse<Profile> me() {
        return new ApiResponse<>(profileService.getMe(UserContext.requireUser()));
    }

    @PatchMapping("/me")
    public ApiResponse<Profile> updateMe(@Valid @RequestBody UpdateProfileRequest request) {
        return new ApiResponse<>(profileService.updateMe(UserContext.requireUser(), request));
    }
}
