package com.homeggu.domain.user.repository;

import com.homeggu.domain.user.entity.UserProfile;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserProfileRepository extends JpaRepository<UserProfile, Integer> {
    Optional<UserProfile> findByUserProfileId(int userProfileId);

    boolean existsByNickname(String nickname);
}
