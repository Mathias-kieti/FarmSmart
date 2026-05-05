package com.farmsmart.backend.dto;

import com.farmsmart.backend.domain.CropId;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record CreateGroupRequest(
        @NotBlank String name,
        @NotNull CropId cropId,
        @NotBlank String county,
        @DecimalMin("1") double targetKg,
        @DecimalMin("0") double collectedKg,
        @Min(0) int priceBoostPct) {
}
