package com.farmsmart.backend.controller;

import java.util.List;

import com.farmsmart.backend.common.ApiResponse;
import com.farmsmart.backend.domain.LearningResource;
import com.farmsmart.backend.service.AdvisorService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/learn")
public class LearnController {
    private final AdvisorService advisorService;

    public LearnController(AdvisorService advisorService) {
        this.advisorService = advisorService;
    }

    @GetMapping
    public ApiResponse<List<LearningResource>> resources() {
        return new ApiResponse<>(advisorService.learningResources());
    }
}
