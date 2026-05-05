package com.farmsmart.backend.repository;

import java.util.Map;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;

import com.farmsmart.backend.domain.Profile;
import org.springframework.stereotype.Repository;

@Repository
public class ProfileRepository {
    private final Map<String, Profile> profiles = new ConcurrentHashMap<>();

    public ProfileRepository() {
        SeedData.profiles().forEach(profile -> profiles.put(profile.id(), profile));
    }

    public Optional<Profile> findById(String id) {
        return Optional.ofNullable(profiles.get(id));
    }

    public Profile save(Profile profile) {
        profiles.put(profile.id(), profile);
        return profile;
    }
}
