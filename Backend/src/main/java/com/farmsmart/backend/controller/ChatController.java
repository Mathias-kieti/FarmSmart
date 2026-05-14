package com.farmsmart.backend.controller;

import com.farmsmart.backend.common.ApiResponse;
import com.farmsmart.backend.service.FlowiseProxyService;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api")
public class ChatController {
    private final FlowiseProxyService flowiseProxyService;

    public ChatController(FlowiseProxyService flowiseProxyService) {
        this.flowiseProxyService = flowiseProxyService;
    }

    @PostMapping("/chat")
    public ApiResponse<Map<String, Object>> chat(@RequestBody Map<String, Object> requestBody) {
        return new ApiResponse<>(flowiseProxyService.proxy(requestBody));
    }
}
