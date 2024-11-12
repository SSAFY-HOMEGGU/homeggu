package com.homeggu.domain.like.repository;

import com.homeggu.domain.like.entity.Like;
import com.homeggu.domain.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface LikeRepository extends JpaRepository<Like, Integer> {
    Optional<Like> findByUserAndSalesBoardId(User user, int salesBoardId);

    List<Like> findByUser(User user);

    boolean existsByUserAndSalesBoardId(User user, int salesBoardId);
}
