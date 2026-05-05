package com.farmsmart.backend.controller;

import java.util.List;

import com.farmsmart.backend.common.ApiResponse;
import com.farmsmart.backend.domain.Crop;
import com.farmsmart.backend.domain.FarmPlanStep;
import com.farmsmart.backend.domain.Recommendation;
import com.farmsmart.backend.service.AdvisorService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class AdvisorController {
    private final AdvisorService advisorService;

    public AdvisorController(AdvisorService advisorService) {
        this.advisorService = advisorService;
    }

    @GetMapping("/crops")
    public ApiResponse<List<Crop>> crops() {
        return new ApiResponse<>(advisorService.crops());
    }

    @GetMapping("/advisor/recommendations")
    public ApiResponse<List<Recommendation>> recommendations(@RequestParam(defaultValue = "default") String county) {
        return new ApiResponse<>(advisorService.recommendations(county));
    }

    @GetMapping("/farm-plan")
    public ApiResponse<List<FarmPlanStep>> farmPlan(@RequestParam(defaultValue = "default") String county) {
        return new ApiResponse<>(advisorService.farmPlan(county));
    }
}
