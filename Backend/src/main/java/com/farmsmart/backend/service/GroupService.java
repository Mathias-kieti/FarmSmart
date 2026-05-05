package com.farmsmart.backend.service;

import java.util.ArrayList;
import java.util.List;

import com.farmsmart.backend.auth.AuthUser;
import com.farmsmart.backend.common.ApiException;
import com.farmsmart.backend.domain.GroupStatus;
import com.farmsmart.backend.domain.SellingGroup;
import com.farmsmart.backend.dto.CreateGroupRequest;
import com.farmsmart.backend.repository.GroupRepository;
import org.springframework.stereotype.Service;

@Service
public class GroupService {
    private final GroupRepository groupRepository;

    public GroupService(GroupRepository groupRepository) {
        this.groupRepository = groupRepository;
    }

    public List<SellingGroup> list(String county, GroupStatus status, String memberId) {
        return groupRepository.findMany(county, status, memberId);
    }

    public SellingGroup create(AuthUser user, CreateGroupRequest request) {
        long now = System.currentTimeMillis();
        SellingGroup group = new SellingGroup(
                "g" + now,
                request.name(),
                request.cropId(),
                request.county(),
                request.targetKg(),
                request.collectedKg(),
                request.priceBoostPct(),
                GroupStatus.collecting,
                user.id(),
                List.of(user.id()),
                now,
                now);
        return groupRepository.save(group);
    }

    public SellingGroup join(AuthUser user, String id) {
        SellingGroup group = groupRepository.findById(id)
                .orElseThrow(() -> ApiException.notFound("Group not found"));

        if (group.memberIds().contains(user.id())) {
            return group;
        }

        List<String> members = new ArrayList<>(group.memberIds());
        members.add(user.id());

        SellingGroup updated = new SellingGroup(
                group.id(),
                group.name(),
                group.cropId(),
                group.county(),
                group.targetKg(),
                group.collectedKg(),
                group.priceBoostPct(),
                group.status(),
                group.createdBy(),
                List.copyOf(members),
                group.createdAt(),
                System.currentTimeMillis());
        return groupRepository.save(updated);
    }
}
