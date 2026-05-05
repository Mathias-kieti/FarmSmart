package com.farmsmart.backend.controller;

import java.util.List;

import com.farmsmart.backend.common.ApiResponse;
import com.farmsmart.backend.domain.PriceRow;
import com.farmsmart.backend.service.MarketService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/markets")
public class MarketController {
    private final MarketService marketService;

    public MarketController(MarketService marketService) {
        this.marketService = marketService;
    }

    @GetMapping("/prices")
    public ApiResponse<List<PriceRow>> prices(@RequestParam(defaultValue = "default") String county) {
        return new ApiResponse<>(marketService.prices(county));
    }
}
