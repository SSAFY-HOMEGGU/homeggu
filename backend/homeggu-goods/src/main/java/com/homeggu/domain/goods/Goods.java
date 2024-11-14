package com.homeggu.domain.goods;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Entity
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Goods {
    // 3D이미지가 저장되는 테이블
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long goodsId;

    @Column
    private String threeDimensionsGoodsImagePath;

    @JoinColumn(name = "sales_board_id"  , nullable = false)
    private Long salesBoardId;

}
