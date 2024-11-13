package com.homeggu.domain.goods;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface GoodsRepository extends JpaRepository <Goods, Integer> {
    List<Goods> findBySalesBoardId(Integer salesBoardId);
}
