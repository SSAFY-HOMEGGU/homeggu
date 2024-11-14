package com.homeggu.domain.salesBoard;


import com.homeggu.domain.salesBoard.enums.Category;
import com.homeggu.domain.salesBoard.enums.IsSell;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.repository.query.Param;



public interface SalesBoardRepository extends JpaRepository<SalesBoard, Long> {

    @Query("SELECT sb FROM SalesBoard sb WHERE " +
            "(:category IS NULL OR sb.category = :category) AND " +
            "(:minPrice IS NULL OR sb.price >= :minPrice) AND " +
            "(:maxPrice IS NULL OR sb.price <= :maxPrice) AND " +
            "(:isSell IS NULL OR sb.isSell = :isSell) AND " +
            "(:title IS NULL OR sb.title LIKE %:title%)")
    Page<SalesBoard> findByFilters(
            @Param("category") Category category, // Enum 타입으로 수정
            @Param("minPrice") Integer minPrice,
            @Param("maxPrice") Integer maxPrice,
            @Param("isSell") IsSell isSell, // Enum 타입으로 수정
            @Param("title") String title,
            Pageable pageable);


}
