package com.homeggu.domain.auth.repository;

import com.homeggu.domain.auth.entity.User;
import com.homeggu.domain.auth.entity.UserProfile;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserProfileRepository extends JpaRepository<UserProfile, Integer> {
    Optional<UserProfile> findByUser(User user);

    boolean existsByNickname(String nickname);
}
