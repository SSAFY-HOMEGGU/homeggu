package com.homeggu.domain.auth.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.homeggu.domain.auth.entity.User;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Integer> {
    Optional<User> findByUserId(int userId);
    Optional<User> findByUsername(String username);
    Optional<User> findByEmail(String email);
    boolean existsByUsername(String username);
}
