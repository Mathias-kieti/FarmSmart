package com.farmsmart.backend.domain;

public record LearningResource(
        String id,
        String title,
        String summary,
        String category,
        String county) {
}
