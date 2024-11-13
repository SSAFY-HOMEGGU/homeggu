package com.homeggu.domain.goodsImage;

import com.homeggu.domain.salesBoard.SalesBoard;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;
public interface GoodsImageRepository extends JpaRepository<GoodsImage , Integer> {
    void deleteBySalesBoard(SalesBoard salesBoard);
    Optional<GoodsImage> findFirstBySalesBoard(SalesBoard salesBoard);
    List<GoodsImage> findBySalesBoard(SalesBoard salesBoard);
}
