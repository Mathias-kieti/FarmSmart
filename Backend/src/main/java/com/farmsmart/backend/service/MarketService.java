package com.farmsmart.backend.service;

import java.util.List;

import com.farmsmart.backend.domain.PriceRow;
import com.farmsmart.backend.repository.ReferenceDataRepository;
import org.springframework.stereotype.Service;

@Service
public class MarketService {
    private final ReferenceDataRepository referenceDataRepository;

    public MarketService(ReferenceDataRepository referenceDataRepository) {
        this.referenceDataRepository = referenceDataRepository;
    }

    public List<PriceRow> prices(String county) {
        return referenceDataRepository.marketPrices(county == null ? "default" : county);
    }
}
