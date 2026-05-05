package com.farmsmart.backend.service;

import java.util.List;

import com.farmsmart.backend.auth.AuthUser;
import com.farmsmart.backend.common.ApiException;
import com.farmsmart.backend.domain.Listing;
import com.farmsmart.backend.domain.ListingStatus;
import com.farmsmart.backend.dto.CreateListingRequest;
import com.farmsmart.backend.repository.ListingRepository;
import org.springframework.stereotype.Service;

@Service
public class ListingService {
    private final ListingRepository listingRepository;
    private final ProfileService profileService;

    public ListingService(ListingRepository listingRepository, ProfileService profileService) {
        this.listingRepository = listingRepository;
        this.profileService = profileService;
    }

    public List<Listing> list(String county, ListingStatus status, String userId) {
        return listingRepository.findMany(county, status, userId);
    }

    public Listing create(AuthUser user, CreateListingRequest request) {
        long now = System.currentTimeMillis();
        String sellerName = profileService.getMe(user).name();
        Listing listing = new Listing(
                "l" + now,
                request.cropId(),
                request.unitLabel(),
                request.pricePerUnit(),
                request.quantity(),
                request.county(),
                sellerName,
                request.sellerPhone(),
                user.id(),
                ListingStatus.Active,
                now,
                now);
        return listingRepository.save(listing);
    }

    public Listing updateStatus(AuthUser user, String id, ListingStatus status) {
        Listing listing = listingRepository.findById(id)
                .orElseThrow(() -> ApiException.notFound("Listing not found"));

        if (!listing.userId().equals(user.id())) {
            throw ApiException.forbidden("Only the listing owner can update it");
        }

        Listing updated = new Listing(
                listing.id(),
                listing.cropId(),
                listing.unitLabel(),
                listing.pricePerUnit(),
                listing.quantity(),
                listing.county(),
                listing.sellerName(),
                listing.sellerPhone(),
                listing.userId(),
                status,
                listing.createdAt(),
                System.currentTimeMillis());
        return listingRepository.save(updated);
    }

    public void delete(AuthUser user, String id) {
        Listing listing = listingRepository.findById(id)
                .orElseThrow(() -> ApiException.notFound("Listing not found"));

        if (!listing.userId().equals(user.id())) {
            throw ApiException.forbidden("Only the listing owner can delete it");
        }

        listingRepository.deleteById(id);
    }
}
