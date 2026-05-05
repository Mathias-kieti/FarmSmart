package com.farmsmart.backend.controller;

import java.util.List;

import com.farmsmart.backend.auth.UserContext;
import com.farmsmart.backend.common.ApiResponse;
import com.farmsmart.backend.domain.GroupStatus;
import com.farmsmart.backend.domain.SellingGroup;
import com.farmsmart.backend.dto.CreateGroupRequest;
import com.farmsmart.backend.service.GroupService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/groups")
public class GroupController {
    private final GroupService groupService;

    public GroupController(GroupService groupService) {
        this.groupService = groupService;
    }

    @GetMapping
    public ApiResponse<List<SellingGroup>> list(
            @RequestParam(required = false) String county,
            @RequestParam(required = false) GroupStatus status) {
        return new ApiResponse<>(groupService.list(county, status, null));
    }

    @GetMapping("/mine")
    public ApiResponse<List<SellingGroup>> mine() {
        return new ApiResponse<>(groupService.list(null, null, UserContext.requireUser().id()));
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ApiResponse<SellingGroup> create(@Valid @RequestBody CreateGroupRequest request) {
        return new ApiResponse<>(groupService.create(UserContext.requireUser(), request));
    }

    @PostMapping("/{id}/join")
    public ApiResponse<SellingGroup> join(@PathVariable String id) {
        return new ApiResponse<>(groupService.join(UserContext.requireUser(), id));
    }
}
