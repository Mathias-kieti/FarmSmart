package com.farmsmart.backend.domain;

import java.util.List;

public record SellingGroup(
        String id,
        String name,
        CropId cropId,
        String county,
        double targetKg,
        double collectedKg,
        int priceBoostPct,
        GroupStatus status,
        String createdBy,
        List<String> memberIds,
        long createdAt,
        long updatedAt) {
}
