package com.farmsmart.backend.dto;

import com.farmsmart.backend.domain.ListingStatus;
import jakarta.validation.constraints.NotNull;

public record UpdateListingStatusRequest(@NotNull ListingStatus status) {
}
