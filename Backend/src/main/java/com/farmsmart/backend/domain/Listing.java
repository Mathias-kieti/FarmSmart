package com.farmsmart.backend.domain;

public record Listing(
        String id,
        CropId cropId,
        String unitLabel,
        double pricePerUnit,
        double quantity,
        String county,
        String sellerName,
        String sellerPhone,
        String userId,
        ListingStatus status,
        long createdAt,
        long updatedAt) {
}
