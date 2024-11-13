package com.homeggu.domain.salesBoard;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RegisterGoodsRequest {
    private SalesBoardDTO salesBoardDTO; // 판매 상품 정보
    private List<String> goodsImagePaths = new ArrayList<>(); // 일반 이미지 파일 경로 리스트
    private List<String> threeDimensionsGoodsImagePaths= new ArrayList<>();  // 3D 이미지 파일 경로 리스트
}
