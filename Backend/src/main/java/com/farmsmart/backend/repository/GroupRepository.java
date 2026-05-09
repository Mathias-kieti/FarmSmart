package com.farmsmart.backend.repository;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;

import com.farmsmart.backend.domain.GroupStatus;
import com.farmsmart.backend.domain.SellingGroup;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Repository;

@Repository
public class GroupRepository {
    private final Map<String, SellingGroup> groups = new ConcurrentHashMap<>();
    private final ObjectMapper objectMapper;
    private final Path storagePath;

    public GroupRepository(
            ObjectMapper objectMapper,
            @Value("${farmsmart.storage.groups-file:data/groups.json}") String groupsFile) {
        this.objectMapper = objectMapper;
        this.storagePath = Path.of(groupsFile);
        load();
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
        persist();
        return group;
    }

    public void deleteById(String id) {
        groups.remove(id);
        persist();
    }

    private void load() {
        if (Files.exists(storagePath)) {
            try {
                List<SellingGroup> savedGroups = objectMapper.readValue(
                        storagePath.toFile(),
                        new TypeReference<>() {
                        });
                savedGroups.forEach(group -> groups.put(group.id(), group));
                return;
            } catch (IOException exception) {
                throw new IllegalStateException("Could not load groups from " + storagePath, exception);
            }
        }

        SeedData.groups().forEach(group -> groups.put(group.id(), group));
        persist();
    }

    private void persist() {
        try {
            Path parent = storagePath.getParent();
            if (parent != null) {
                Files.createDirectories(parent);
            }
            objectMapper.writerWithDefaultPrettyPrinter().writeValue(storagePath.toFile(), groups.values());
        } catch (IOException exception) {
            throw new IllegalStateException("Could not save groups to " + storagePath, exception);
        }
    }
}
