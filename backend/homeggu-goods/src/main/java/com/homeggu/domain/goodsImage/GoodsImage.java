package com.homeggu.domain.goodsImage;

import com.homeggu.domain.salesBoard.SalesBoard;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@NoArgsConstructor
@AllArgsConstructor
@Data
@Builder
public class GoodsImage {
    // 2d 이미지를 저장하는 테이블
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long goodsImageId;

    @ManyToOne
    @JoinColumn(name = "sales_board_id", nullable = false)
    private SalesBoard salesBoard;

    private String goodsImagePath;
}
