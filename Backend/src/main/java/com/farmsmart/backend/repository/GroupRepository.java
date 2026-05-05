package com.farmsmart.backend.repository;

import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;

import com.farmsmart.backend.domain.GroupStatus;
import com.farmsmart.backend.domain.SellingGroup;
import org.springframework.stereotype.Repository;

@Repository
public class GroupRepository {
    private final Map<String, SellingGroup> groups = new ConcurrentHashMap<>();

    public GroupRepository() {
        SeedData.groups().forEach(group -> groups.put(group.id(), group));
    }

    public List<SellingGroup> findMany(String county, GroupStatus status, String memberId) {
        return groups.values()
                .stream()
                .filter(group -> county == null || group.county().equals(county))
                .filter(group -> status == null || group.status() == status)
                .filter(group -> memberId == null || group.memberIds().contains(memberId))
                .sorted(Comparator.comparingLong(SellingGroup::createdAt).reversed())
                .toList();
    }

    public Optional<SellingGroup> findById(String id) {
        return Optional.ofNullable(groups.get(id));
    }

    public SellingGroup save(SellingGroup group) {
        groups.put(group.id(), group);
        return group;
    }
}
