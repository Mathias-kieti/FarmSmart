package com.farmsmart.backend.repository;

import java.util.List;
import java.util.Map;

import com.farmsmart.backend.domain.Crop;
import com.farmsmart.backend.domain.LearningResource;
import com.farmsmart.backend.domain.PriceRow;
import com.farmsmart.backend.domain.Recommendation;
import org.springframework.stereotype.Repository;

@Repository
public class ReferenceDataRepository {
    private final List<Crop> crops = SeedData.crops();
    private final Map<String, List<PriceRow>> marketPrices = SeedData.marketPrices();
    private final Map<String, List<Recommendation>> recommendations = SeedData.recommendations();
    private final List<LearningResource> learningResources = SeedData.learningResources();

    public List<Crop> crops() {
        return crops;
    }

    public List<PriceRow> marketPrices(String county) {
        return marketPrices.getOrDefault(county, marketPrices.get("default"));
    }

    public List<Recommendation> recommendations(String county) {
        return recommendations.getOrDefault(county, recommendations.get("default"));
    }

    public List<LearningResource> learningResources() {
        return learningResources;
    }
}
