package com.farmsmart.backend.controller;

import java.util.List;

import com.farmsmart.backend.auth.UserContext;
import com.farmsmart.backend.common.ApiResponse;
import com.farmsmart.backend.domain.Listing;
import com.farmsmart.backend.domain.ListingStatus;
import com.farmsmart.backend.dto.CreateListingRequest;
import com.farmsmart.backend.dto.UpdateListingStatusRequest;
import com.farmsmart.backend.service.ListingService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/listings")
public class ListingController {
    private final ListingService listingService;

    public ListingController(ListingService listingService) {
        this.listingService = listingService;
    }

    @GetMapping
    public ApiResponse<List<Listing>> list(
            @RequestParam(required = false) String county,
            @RequestParam(required = false) ListingStatus status,
            @RequestParam(defaultValue = "false") boolean mine) {
        String userId = mine ? UserContext.requireUser().id() : null;
        return new ApiResponse<>(listingService.list(county, status, userId));
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ApiResponse<Listing> create(@Valid @RequestBody CreateListingRequest request) {
        return new ApiResponse<>(listingService.create(UserContext.requireUser(), request));
    }

    @PatchMapping("/{id}/status")
    public ApiResponse<Listing> updateStatus(
            @PathVariable String id,
            @Valid @RequestBody UpdateListingStatusRequest request) {
        return new ApiResponse<>(listingService.updateStatus(UserContext.requireUser(), id, request.status()));
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable String id) {
        listingService.delete(UserContext.requireUser(), id);
    }
}
