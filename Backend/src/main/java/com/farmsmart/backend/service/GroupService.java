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

    public SellingGroup leave(AuthUser user, String id) {
        SellingGroup group = groupRepository.findById(id)
                .orElseThrow(() -> ApiException.notFound("Group not found"));

        if (!group.memberIds().contains(user.id())) {
            return group;
        }

        if (group.memberIds().size() == 1) {
            throw ApiException.badRequest("You cannot leave as the only group member");
        }

        List<String> members = group.memberIds()
                .stream()
                .filter(memberId -> !memberId.equals(user.id()))
                .toList();
        String createdBy = group.createdBy().equals(user.id())
                ? members.get(0)
                : group.createdBy();

        SellingGroup updated = new SellingGroup(
                group.id(),
                group.name(),
                group.cropId(),
                group.county(),
                group.targetKg(),
                group.collectedKg(),
                group.priceBoostPct(),
                group.status(),
                createdBy,
                members,
                group.createdAt(),
                System.currentTimeMillis());
        return groupRepository.save(updated);
    }

    public void delete(AuthUser user, String id) {
        SellingGroup group = groupRepository.findById(id)
                .orElseThrow(() -> ApiException.notFound("Group not found"));

        if (!group.createdBy().equals(user.id())) {
            throw ApiException.forbidden("Only the group creator can delete it");
        }

        if (group.memberIds().size() > 1) {
            throw ApiException.badRequest("Remove other members before deleting this group");
        }

        groupRepository.deleteById(id);
    }

    public SellingGroup updateCollection(AuthUser user, String id, double collectedKg) {
        SellingGroup group = groupRepository.findById(id)
                .orElseThrow(() -> ApiException.notFound("Group not found"));

        if (!group.memberIds().contains(user.id())) {
            throw ApiException.forbidden("Only group members can manage collection progress");
        }

        if (group.status() == GroupStatus.closed) {
            throw ApiException.forbidden("Closed groups cannot be updated");
        }

        if (collectedKg > group.targetKg()) {
            throw ApiException.badRequest("Collected quantity cannot exceed target quantity");
        }

        GroupStatus status = collectedKg >= group.targetKg()
                ? GroupStatus.ready
                : GroupStatus.collecting;

        SellingGroup updated = new SellingGroup(
                group.id(),
                group.name(),
                group.cropId(),
                group.county(),
                group.targetKg(),
                collectedKg,
                group.priceBoostPct(),
                status,
                group.createdBy(),
                group.memberIds(),
                group.createdAt(),
                System.currentTimeMillis());
        return groupRepository.save(updated);
    }
}
