package com.farmsmart.backend.service;

import com.farmsmart.backend.auth.AuthUser;
import com.farmsmart.backend.domain.Profile;
import com.farmsmart.backend.dto.UpdateProfileRequest;
import com.farmsmart.backend.repository.ProfileRepository;
import org.springframework.stereotype.Service;

@Service
public class ProfileService {
    private final ProfileRepository profileRepository;

    public ProfileService(ProfileRepository profileRepository) {
        this.profileRepository = profileRepository;
    }

    public Profile getMe(AuthUser user) {
        long now = System.currentTimeMillis();
        return profileRepository.findById(user.id())
                .orElse(new Profile(
                        user.id(),
                        user.name() == null || user.name().isBlank() ? "Farmer" : user.name(),
                        user.email() == null ? "" : user.email(),
                        "",
                        "Nyeri",
                        now,
                        now));
    }

    public Profile updateMe(AuthUser user, UpdateProfileRequest request) {
        Profile current = getMe(user);
        Profile updated = new Profile(
                user.id(),
                request.name() == null ? current.name() : request.name(),
                request.email() == null ? current.email() : request.email(),
                request.phone() == null ? current.phone() : request.phone(),
                request.county() == null ? current.county() : request.county(),
                current.createdAt(),
                System.currentTimeMillis());
        return profileRepository.save(updated);
    }
}
