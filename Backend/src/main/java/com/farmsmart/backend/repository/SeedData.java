package com.farmsmart.backend.repository;

import java.util.List;
import java.util.Map;

import com.farmsmart.backend.domain.Crop;
import com.farmsmart.backend.domain.CropId;
import com.farmsmart.backend.domain.Demand;
import com.farmsmart.backend.domain.GroupStatus;
import com.farmsmart.backend.domain.LearningResource;
import com.farmsmart.backend.domain.Listing;
import com.farmsmart.backend.domain.ListingStatus;
import com.farmsmart.backend.domain.PriceRow;
import com.farmsmart.backend.domain.Profile;
import com.farmsmart.backend.domain.Recommendation;
import com.farmsmart.backend.domain.Risk;
import com.farmsmart.backend.domain.SellingGroup;

public final class SeedData {
    public static final long NOW = System.currentTimeMillis();

    private SeedData() {
    }

    public static List<Crop> crops() {
        return List.of(
                new Crop(CropId.maize, "Maize", "90kg bag"),
                new Crop(CropId.beans, "Beans", "90kg bag"),
                new Crop(CropId.potatoes, "Potatoes", "50kg bag"),
                new Crop(CropId.tomatoes, "Tomatoes", "crate"),
                new Crop(CropId.kales, "Kales", "bunch"),
                new Crop(CropId.onions, "Onions", "net"),
                new Crop(CropId.cabbage, "Cabbage", "head"),
                new Crop(CropId.coffee, "Coffee", "kg"));
    }

    public static List<Profile> profiles() {
        return List.of(
                new Profile("seed-1", "Wanjiru F.", "wanjiru@example.com", "+254711000111", "Nyeri", NOW, NOW));
    }

    public static List<Listing> listings() {
        return List.of(
                new Listing("l1", CropId.maize, "90kg bag", 2700, 12, "Nyeri", "Wanjiru F.", "+254711000111",
                        "seed-1", ListingStatus.Active, NOW - 5 * 60 * 1000, NOW - 5 * 60 * 1000),
                new Listing("l2", CropId.beans, "90kg bag", 5600, 6, "Murang'a", "Joseph K.", "+254711000222",
                        "seed-2", ListingStatus.Active, NOW - 35 * 60 * 1000, NOW - 35 * 60 * 1000),
                new Listing("l3", CropId.potatoes, "50kg bag", 1800, 30, "Nyandarua", "Mary N.", "+254711000333",
                        "seed-3", ListingStatus.Active, NOW - 2 * 60 * 60 * 1000, NOW - 2 * 60 * 60 * 1000),
                new Listing("l4", CropId.tomatoes, "crate", 3200, 18, "Nyeri", "Peter M.", "+254711000444",
                        "seed-4", ListingStatus.Active, NOW - 6 * 60 * 60 * 1000, NOW - 6 * 60 * 60 * 1000));
    }

    public static Map<String, List<PriceRow>> marketPrices() {
        return Map.of(
                "default", List.of(
                        new PriceRow(CropId.maize, "90kg", 2700, List.of(2580d, 2600d, 2610d, 2640d, 2660d, 2680d, 2700d)),
                        new PriceRow(CropId.beans, "90kg", 5600, List.of(5680d, 5670d, 5660d, 5650d, 5640d, 5620d, 5600d)),
                        new PriceRow(CropId.potatoes, "50kg", 1800, List.of(1740d, 1750d, 1760d, 1770d, 1780d, 1790d, 1800d)),
                        new PriceRow(CropId.tomatoes, "crate", 3200, List.of(3110d, 3120d, 3140d, 3160d, 3170d, 3180d, 3200d)),
                        new PriceRow(CropId.kales, "bunch", 1200, List.of(1210d, 1208d, 1206d, 1204d, 1203d, 1202d, 1200d))),
                "Nairobi", List.of(
                        new PriceRow(CropId.maize, "90kg", 2900, List.of(2780d, 2800d, 2810d, 2840d, 2860d, 2880d, 2900d)),
                        new PriceRow(CropId.beans, "90kg", 5900, List.of(5980d, 5970d, 5960d, 5950d, 5940d, 5920d, 5900d)),
                        new PriceRow(CropId.potatoes, "50kg", 2000, List.of(1940d, 1950d, 1960d, 1970d, 1980d, 1990d, 2000d)),
                        new PriceRow(CropId.tomatoes, "crate", 3500, List.of(3410d, 3420d, 3440d, 3460d, 3470d, 3480d, 3500d)),
                        new PriceRow(CropId.kales, "bunch", 1400, List.of(1410d, 1408d, 1406d, 1404d, 1403d, 1402d, 1400d))));
    }

    public static Map<String, List<Recommendation>> recommendations() {
        List<Recommendation> common = List.of(
                new Recommendation(CropId.maize, 78, 22000, Demand.Medium, Risk.Low, "Mar 15 - Apr 30",
                        "Staple crop with steady local demand. Reliable rainfall window."),
                new Recommendation(CropId.beans, 74, 28000, Demand.High, Risk.Low, "Mar 20 - May 10",
                        "Strong dry-season demand. Fixes nitrogen, good for rotation."));

        return Map.of(
                "default", common,
                "Nyeri", List.of(
                        new Recommendation(CropId.tomatoes, 92, 35000, Demand.High, Risk.Low, "Apr 10 - Apr 20",
                                "High demand expected in Nairobi and surrounding markets in the next 6 weeks. Cool nights favour fruit set."),
                        new Recommendation(CropId.potatoes, 84, 30000, Demand.High, Risk.Medium, "Apr 5 - May 5",
                                "Highland soils are ideal. Watch for late blight in long rains."),
                        common.get(0),
                        common.get(1)),
                "Nakuru", List.of(
                        new Recommendation(CropId.potatoes, 90, 33000, Demand.High, Risk.Low, "Apr 1 - May 1",
                                "Volcanic soils and cool climate make Nakuru a top potato basket. Strong demand from Nairobi traders."),
                        new Recommendation(CropId.kales, 81, 18000, Demand.High, Risk.Low, "Year round",
                                "Quick 6-week cycle. Daily cash flow from urban markets."),
                        common.get(0),
                        common.get(1)));
    }

    public static List<SellingGroup> groups() {
        return List.of(
                new SellingGroup("g1", "Maize Bulk Sale", CropId.maize, "Nyeri", 1200, 600, 15,
                        GroupStatus.collecting, "seed-1", List.of("seed-1", "seed-2", "seed-3"), NOW, NOW),
                new SellingGroup("g2", "Tomato Collective", CropId.tomatoes, "Kiambu", 800, 620, 18,
                        GroupStatus.collecting, "seed-2", List.of("seed-2"), NOW, NOW),
                new SellingGroup("g3", "Bean Alliance", CropId.beans, "Murang'a", 500, 500, 12,
                        GroupStatus.ready, "seed-3", List.of("seed-3"), NOW, NOW));
    }

    public static List<LearningResource> learningResources() {
        return List.of(
                new LearningResource("learn-1", "Choosing the right seed variety",
                        "Match seeds to soil type, altitude, and rainfall pattern.", "crops", null),
                new LearningResource("learn-2", "Smart irrigation in dry seasons",
                        "Stretch every drop with drip lines and mulching.", "water", null),
                new LearningResource("learn-3", "Pest and disease management",
                        "Spot blight, aphids, and fall armyworm early.", "pests", null),
                new LearningResource("learn-4", "Reading the market",
                        "Time your harvest for the best price.", "markets", null));
    }
}
