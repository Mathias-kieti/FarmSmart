package com.farmsmart.backend.repository;

import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;

import com.farmsmart.backend.domain.Listing;
import com.farmsmart.backend.domain.ListingStatus;
import org.springframework.stereotype.Repository;

@Repository
public class ListingRepository {
    private final Map<String, Listing> listings = new ConcurrentHashMap<>();

    public ListingRepository() {
        SeedData.listings().forEach(listing -> listings.put(listing.id(), listing));
    }

    public List<Listing> findMany(String county, ListingStatus status, String userId) {
        return listings.values()
                .stream()
                .filter(listing -> county == null || listing.county().equals(county))
                .filter(listing -> status == null || listing.status() == status)
                .filter(listing -> userId == null || listing.userId().equals(userId))
                .sorted(Comparator.comparingLong(Listing::createdAt).reversed())
                .toList();
    }

    public Optional<Listing> findById(String id) {
        return Optional.ofNullable(listings.get(id));
    }

    public Listing save(Listing listing) {
        listings.put(listing.id(), listing);
        return listing;
    }

    public void deleteById(String id) {
        listings.remove(id);
    }
}
