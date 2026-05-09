package com.farmsmart.backend.dto;

import jakarta.validation.constraints.DecimalMin;

public record UpdateGroupCollectionRequest(@DecimalMin("0") double collectedKg) {
}
