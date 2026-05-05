package com.farmsmart.backend.domain;

import java.util.List;

public record PriceRow(CropId cropId, String unitLabel, double current, List<Double> history) {
}
