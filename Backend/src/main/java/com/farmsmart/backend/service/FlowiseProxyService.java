package com.farmsmart.backend.service;

import com.farmsmart.backend.common.ApiException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import java.time.Duration;
import java.util.Map;

@Service
public class FlowiseProxyService {
    private final String flowiseUrl;
    private final String apiKey;
    private final ObjectMapper objectMapper;
    private final HttpClient httpClient;

    public FlowiseProxyService(
            @Value("${farmsmart.flowise.url:}") String flowiseUrl,
            @Value("${farmsmart.flowise.api-key:}") String apiKey,
            ObjectMapper objectMapper
    ) {
        this.flowiseUrl = flowiseUrl;
        this.apiKey = apiKey;
        this.objectMapper = objectMapper;
        this.httpClient = HttpClient.newBuilder()
                .connectTimeout(Duration.ofSeconds(10))
                .build();
    }

    public Map<String, Object> proxy(Map<String, Object> requestBody) {
        if (flowiseUrl == null || flowiseUrl.isBlank()) {
            throw new ApiException(HttpStatus.INTERNAL_SERVER_ERROR, "Flowise proxy URL is not configured");
        }

        try {
            String requestJson = objectMapper.writeValueAsString(requestBody);

            HttpRequest.Builder builder = HttpRequest.newBuilder()
                    .uri(URI.create(flowiseUrl))
                    .header("Content-Type", "application/json")
                    .timeout(Duration.ofSeconds(30))
                    .POST(HttpRequest.BodyPublishers.ofString(requestJson, StandardCharsets.UTF_8));

            if (apiKey != null && !apiKey.isBlank()) {
                builder.header("Authorization", "Bearer " + apiKey);
            }

            HttpResponse<String> response = httpClient.send(builder.build(), HttpResponse.BodyHandlers.ofString(StandardCharsets.UTF_8));

            if (response.statusCode() < 200 || response.statusCode() >= 300) {
                throw new ApiException(HttpStatus.BAD_GATEWAY,
                        "Flowise request failed with status " + response.statusCode() + ": " + response.body());
            }

            return objectMapper.readValue(response.body(), new TypeReference<>() {
            });
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            throw new ApiException(HttpStatus.INTERNAL_SERVER_ERROR, "Flowise proxy request interrupted");
        } catch (IllegalArgumentException e) {
            throw new ApiException(HttpStatus.INTERNAL_SERVER_ERROR, "Flowise proxy URL is invalid: " + e.getMessage());
        } catch (IOException e) {
            throw new ApiException(HttpStatus.BAD_GATEWAY, "Unable to reach Flowise: " + e.getMessage());
        }
    }
}
