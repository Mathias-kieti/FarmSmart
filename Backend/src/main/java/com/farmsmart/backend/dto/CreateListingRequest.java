package com.farmsmart.backend.dto;

import com.farmsmart.backend.domain.CropId;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record CreateListingRequest(
        @NotNull CropId cropId,
        @NotBlank String unitLabel,
        @DecimalMin("1") double pricePerUnit,
        @DecimalMin("1") double quantity,
        @NotBlank String county,
        @NotBlank String sellerPhone) {
}
