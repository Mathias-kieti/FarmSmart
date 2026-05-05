package com.farmsmart.backend.service;

import java.util.List;

import com.farmsmart.backend.domain.Crop;
import com.farmsmart.backend.domain.FarmPlanStep;
import com.farmsmart.backend.domain.LearningResource;
import com.farmsmart.backend.domain.Recommendation;
import com.farmsmart.backend.repository.ReferenceDataRepository;
import org.springframework.stereotype.Service;

@Service
public class AdvisorService {
    private final ReferenceDataRepository referenceDataRepository;

    public AdvisorService(ReferenceDataRepository referenceDataRepository) {
        this.referenceDataRepository = referenceDataRepository;
    }

    public List<Crop> crops() {
        return referenceDataRepository.crops();
    }

    public List<Recommendation> recommendations(String county) {
        return referenceDataRepository.recommendations(county == null ? "default" : county);
    }

    public List<FarmPlanStep> farmPlan(String county) {
        Recommendation top = recommendations(county).get(0);
        String cropName = referenceDataRepository.crops()
                .stream()
                .filter(crop -> crop.id() == top.cropId())
                .findFirst()
                .map(Crop::name)
                .orElse(top.cropId().name());

        return List.of(
                new FarmPlanStep("Land preparation",
                        "Plough and harrow. Apply 5 t/acre well-decomposed manure.", "Now - Apr 8", "sprout"),
                new FarmPlanStep("Planting",
                        "Plant " + cropName + " during the recommended window.", top.plantingWindow(), "calendar"),
                new FarmPlanStep("Top dressing and irrigation",
                        "Apply CAN at 6 weeks. Irrigate weekly if rains delay.", "Week 6 - 10", "water"),
                new FarmPlanStep("Harvest",
                        "Expected yield window. Coordinate with buyers early.", "Week 12 - 16", "harvest"));
    }

    public List<LearningResource> learningResources() {
        return referenceDataRepository.learningResources();
    }
}
