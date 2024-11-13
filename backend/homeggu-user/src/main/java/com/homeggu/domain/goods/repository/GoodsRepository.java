package com.homeggu.domain.goods.repository;

import com.homeggu.domain.goods.entity.Goods;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface GoodsRepository extends JpaRepository<Goods, Integer> {
}
