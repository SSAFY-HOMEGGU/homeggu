package com.homeggu.domain.salesBoard;

import com.homeggu.domain.salesBoard.enums.*;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Entity
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SalesBoard {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer salesBoardId;

    @Column(nullable=false)
    private Integer userId;

    @Column(nullable=false, length = 100)
    private String title;

    @Column(nullable=false)
    private String content;

    @Enumerated(EnumType.STRING)
    private Category category;

    @Enumerated(EnumType.STRING)
    private Status status;

    @Enumerated(EnumType.STRING)
    private TradeMethod tradeMethod;

    @Enumerated(EnumType.STRING)
    private Mood mood;

    @Column(nullable=false)
    private Boolean isSafe;

    @Column
    private String hopeLocation;

    @Column(nullable=false)
    private Integer price;

    @Column(nullable=false)
    private Integer deliveryPrice;

    @Column(nullable=false)
    private Integer viewCnt=0;

    @Column(nullable=false)
    private Integer likeCnt=0;

    @Column(nullable=false)
    private Integer chatCnt=0;

    @Column(nullable=false, updatable = false)
    private LocalDateTime createdAt;

    @Column(nullable=false)
    private LocalDateTime  updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        isSell = IsSell.AVAILABLE;
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    @Enumerated(EnumType.STRING)
    private IsSell isSell;

    @Column
    private Integer goods_x;

    @Column
    private Integer goods_y;

    @Column
    private Integer goods_z;

    public static SalesBoard toEntity(SalesBoardDTO dto) {
        return SalesBoard.builder()
                .salesBoardId(dto.getSalesBoardId())
                .userId(dto.getUserId())
                .title(dto.getTitle())
                .content(dto.getContent())
                .category(dto.getCategory())
                .status(dto.getStatus())
                .tradeMethod(dto.getTradeMethod())
                .isSafe(dto.getIsSafe())
                .hopeLocation(dto.getHopeLocation())
                .price(dto.getPrice())
                .deliveryPrice(dto.getDeliveryPrice())
                .viewCnt(dto.getViewCnt() != null ? dto.getViewCnt() : 0)
                .likeCnt(dto.getLikeCnt() != null ? dto.getLikeCnt() : 0)
                .chatCnt(dto.getChatCnt() != null ? dto.getChatCnt() : 0)
                .createdAt(dto.getCreatedAt())
                .updatedAt(dto.getUpdatedAt())
                .isSell(dto.getIsSell())
                .mood(dto.getMood())
                .goods_x(dto.getGoods_x())
                .goods_y(dto.getGoods_y())
                .goods_z(dto.getGoods_z())
                .build();
    }

    // SalesBoardDTO로 변환하는 메서드 추가
    // 외부에서 이미지 경로 리스트를 주입하는 toDTO 메서드
    public SalesBoardDTO toDTO(List<String> goodsImagePaths, List<String> threeDimensionsGoodsImagePaths) {
        return SalesBoardDTO.builder()
                .salesBoardId(this.salesBoardId)
                .userId(this.userId)
                .title(this.title)
                .content(this.content)
                .category(this.category)
                .status(this.status)
                .tradeMethod(this.tradeMethod)
                .isSafe(this.isSafe)
                .hopeLocation(this.hopeLocation)
                .price(this.price)
                .deliveryPrice(this.deliveryPrice)
                .viewCnt(this.viewCnt)
                .likeCnt(this.likeCnt)
                .chatCnt(this.chatCnt)
                .createdAt(this.createdAt)
                .updatedAt(this.updatedAt)
                .isSell(this.isSell)
                .mood(this.mood)
                .goods_x(this.goods_x)
                .goods_y(this.goods_y)
                .goods_z(this.goods_z)
                .goodsImagePaths(goodsImagePaths)
                .threeDimensionsGoodsImagePaths(threeDimensionsGoodsImagePaths)
                .build();
    }



}
