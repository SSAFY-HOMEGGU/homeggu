package com.homeggu.domain.saledBoardLike.repository;

import com.homeggu.domain.saledBoardLike.entity.SalesBoardLike;
import com.homeggu.domain.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface LikeRepository extends JpaRepository<SalesBoardLike, Long> {
    Optional<SalesBoardLike> findByUserAndSalesBoardId(User user, Long salesBoardId);

    List<SalesBoardLike> findByUser(User user);

    boolean existsByUserAndSalesBoardId(User user, Long salesBoardId);
}
