package com.livinglink.visitservice.repository;

import com.livinglink.visitservice.entity.Visit;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface VisitRepository extends JpaRepository<Visit, Long> {

    List<Visit> findByRequesterId(Long requesterId);
    
    List<Visit> findByOwnerId(Long ownerId);
    
    boolean existsByRequesterIdAndListingIdAndStatusIn(Long requesterId, Long listingId, List<String> statuses);
}
