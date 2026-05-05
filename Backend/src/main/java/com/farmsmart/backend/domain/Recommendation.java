package com.farmsmart.backend.domain;

public record Recommendation(
        CropId cropId,
        int matchScore,
        double estProfitKes,
        Demand demand,
        Risk risk,
        String plantingWindow,
        String reasoning) {
}
