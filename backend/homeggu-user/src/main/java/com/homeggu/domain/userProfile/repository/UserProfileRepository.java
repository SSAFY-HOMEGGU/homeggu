package com.homeggu.domain.userProfile.repository;

import com.homeggu.domain.userProfile.entity.UserProfile;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserProfileRepository extends JpaRepository<UserProfile, Long> {
    Optional<UserProfile> findByUserProfileId(Long userProfileId);

    boolean existsByNickname(String nickname);
}
