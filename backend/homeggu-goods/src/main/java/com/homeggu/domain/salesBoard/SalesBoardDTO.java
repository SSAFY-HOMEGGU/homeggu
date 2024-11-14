package com.homeggu.domain.salesBoard;

import com.homeggu.domain.salesBoard.enums.*;
import jakarta.persistence.Column;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SalesBoardDTO {

    private Long salesBoardId;
    private Long userId;
    private String title;
    private String content;
    private Category category;
    private Status status;
    private TradeMethod tradeMethod;
    private Boolean isSafe;
    private String hopeLocation;
    private Integer price;
    private Integer deliveryPrice;
    private Integer viewCnt;
    private Integer likeCnt;
    private Integer chatCnt;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private IsSell isSell;
    private Mood mood;

    private Integer goods_x;
    private Integer goods_y;
    private Integer goods_z;

    private List<String> goodsImagePaths; // 일반 이미지 리스트
    private List<String> threeDimensionsGoodsImagePaths;



    public static SalesBoardDTO toDTO(SalesBoard salesBoard, List<String> goodsImagePaths, List<String> threeDimensionsGoodsImagePaths) {
        return SalesBoardDTO.builder()
                .salesBoardId(salesBoard.getSalesBoardId())
                .userId(salesBoard.getUserId())
                .title(salesBoard.getTitle())
                .content(salesBoard.getContent())
                .category(salesBoard.getCategory())
                .status(salesBoard.getStatus())
                .tradeMethod(salesBoard.getTradeMethod())
                .isSafe(salesBoard.getIsSafe())
                .hopeLocation(salesBoard.getHopeLocation())
                .price(salesBoard.getPrice())
                .deliveryPrice(salesBoard.getDeliveryPrice())
                .viewCnt(salesBoard.getViewCnt())
                .likeCnt(salesBoard.getLikeCnt())
                .chatCnt(salesBoard.getChatCnt())
                .createdAt(salesBoard.getCreatedAt())
                .updatedAt(salesBoard.getUpdatedAt())
                .isSell(salesBoard.getIsSell())
                .goodsImagePaths(goodsImagePaths) // 일반 이미지 리스트 설정
                .threeDimensionsGoodsImagePaths(threeDimensionsGoodsImagePaths) // 3D 이미지 리스트 설정
                .mood(salesBoard.getMood())
                .goods_x(salesBoard.getGoods_x())
                .goods_y(salesBoard.getGoods_y())
                .goods_z(salesBoard.getGoods_z())
                .build();
    }

}
