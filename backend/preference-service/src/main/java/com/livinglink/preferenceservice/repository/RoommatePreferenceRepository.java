package com.livinglink.preferenceservice.repository;


import com.livinglink.preferenceservice.entity.RoommatePreference;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface RoommatePreferenceRepository extends JpaRepository<RoommatePreference, Long> {

    Optional<RoommatePreference> findByUserId(Long userId);

    boolean existsByUserId(Long userId);
}