package com.homeggu.domain.goodsImage;

import com.homeggu.domain.salesBoard.SalesBoard;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
public interface GoodsImageRepository extends JpaRepository<GoodsImage , Long> {
    void deleteBySalesBoard(SalesBoard salesBoard);
    List<GoodsImage> findBySalesBoard(SalesBoard salesBoard);
}
