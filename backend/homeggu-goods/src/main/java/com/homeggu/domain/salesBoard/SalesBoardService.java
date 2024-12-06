package com.homeggu.domain.salesBoard;

import com.homeggu.domain.goods.Goods;
import com.homeggu.domain.goods.GoodsRepository;
import com.homeggu.domain.goodsImage.GoodsImage;
import com.homeggu.domain.goodsImage.GoodsImageRepository;
import com.homeggu.domain.salesBoard.enums.Category;
import com.homeggu.domain.salesBoard.enums.IsSell;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageImpl;
import org.springframework.stereotype.Service;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SalesBoardService {
  private final SalesBoardRepository salesBoardRepository;
  private final GoodsRepository goodsRepository;
  private final GoodsImageRepository goodsImageRepository;

  // 상품 등록
  @Transactional
   public Long registerGoods (RegisterGoodsRequest dto){

      SalesBoard salesBoard = SalesBoard.toEntity(dto.getSalesBoardDTO());
      salesBoardRepository.save(salesBoard);

      // 3D 이미지 저장 일단 보류 어떤 형태로 올지 모름
      if (!dto.getThreeDimensionsGoodsImagePaths().isEmpty()) {
          for (String imagePath : dto.getThreeDimensionsGoodsImagePaths()) {
              Goods goods = new Goods();
              goods.setSalesBoardId(salesBoard.getSalesBoardId());
              goods.setThreeDimensionsGoodsImagePath(imagePath);
              goodsRepository.save(goods);
          }
      }

      // 상품 사진 저장
      if (!dto.getGoodsImagePaths().isEmpty()) {
          for (String imagePath : dto.getGoodsImagePaths()) {
              GoodsImage goodsImage = new GoodsImage();
              goodsImage.setSalesBoard(salesBoard);
              goodsImage.setGoodsImagePath(imagePath);
              goodsImageRepository.save(goodsImage);
          }
      }

      return salesBoard.getSalesBoardId();
   }


    @Transactional
    public void updateGoods(RegisterGoodsRequest dto) {
        SalesBoard salesBoard = salesBoardRepository.findById(dto.getSalesBoardDTO().getSalesBoardId())
                .orElseThrow(() -> new RuntimeException("물건을 찾을 수 없습니다."));

        // 판매 게시판 정보 업데이트
        salesBoard.setTitle(dto.getSalesBoardDTO().getTitle());
        salesBoard.setContent(dto.getSalesBoardDTO().getContent());
        salesBoard.setCategory(dto.getSalesBoardDTO().getCategory());
        salesBoard.setStatus(dto.getSalesBoardDTO().getStatus());
        salesBoard.setTradeMethod(dto.getSalesBoardDTO().getTradeMethod());
        salesBoard.setIsSafe(dto.getSalesBoardDTO().getIsSafe());
        salesBoard.setHopeLocation(dto.getSalesBoardDTO().getHopeLocation());
        salesBoard.setPrice(dto.getSalesBoardDTO().getPrice());
        salesBoard.setDeliveryPrice(dto.getSalesBoardDTO().getDeliveryPrice());
        salesBoard.setUpdatedAt(LocalDateTime.now());
        salesBoard.setMood(dto.getSalesBoardDTO().getMood());
        salesBoard.setMood(dto.getSalesBoardDTO().getMood());
        salesBoard.setIsSell(dto.getSalesBoardDTO().getIsSell());
        salesBoard.setGoods_x(dto.getSalesBoardDTO().getGoods_x());
        salesBoard.setGoods_y(dto.getSalesBoardDTO().getGoods_y());
        salesBoard.setGoods_z(dto.getSalesBoardDTO().getGoods_z());


        salesBoardRepository.save(salesBoard);

        // 3D 이미지 저장 (기존 로직 유지)
        if (!dto.getThreeDimensionsGoodsImagePaths().isEmpty()) {
            for (String imagePath : dto.getThreeDimensionsGoodsImagePaths()) {
                Goods goods = new Goods();
                goods.setSalesBoardId(salesBoard.getSalesBoardId());
                goods.setThreeDimensionsGoodsImagePath(imagePath);
                goodsRepository.save(goods);
            }
        }

        // 일반 상품 이미지 업데이트
        if (!dto.getGoodsImagePaths().isEmpty()) {
            // 기존 이미지 업데이트 로직
            goodsImageRepository.deleteBySalesBoard(salesBoard); // 기존 이미지 삭제 (필요한 경우)
            for (String imagePath : dto.getGoodsImagePaths()) {
                GoodsImage goodsImage = new GoodsImage();
                goodsImage.setSalesBoard(salesBoard);
                goodsImage.setGoodsImagePath(imagePath);
                goodsImageRepository.save(goodsImage);
            }
        }
    }
    // 삭제
   public void deleteGoods (Long goodsId,Long userId){
      SalesBoard salesBoard = salesBoardRepository.findById(goodsId)
              .orElseThrow(() -> new RuntimeException("물건을 찾을 수 없습니다."));

      if(!salesBoard.getUserId().equals(userId)){
         throw new RuntimeException("삭제할 권한이 없습니다.");
      }
      salesBoardRepository.deleteById(goodsId);
   }

   // 물건 리스트
   public Page<SalesBoardDTO> getFilteredGoods(Category category, Integer minPrice, Integer maxPrice, IsSell isSell, String title, Pageable pageable) {
       Page<SalesBoard> salesBoards = salesBoardRepository.findByFilters(category, minPrice, maxPrice, isSell, title, pageable);

       // 각 SalesBoard를 SalesBoardDTO로 변환하면서 이미지 리스트를 설정
       List<SalesBoardDTO> salesBoardDTOs = salesBoards.stream()
               .map(salesBoard -> {
                   // 일반 이미지 경로 리스트
                   List<String> goodsImagePaths = goodsImageRepository.findBySalesBoard(salesBoard)
                           .stream()
                           .map(GoodsImage::getGoodsImagePath)
                           .collect(Collectors.toList());

                   // 3D 이미지 경로 리스트 (GoodsRepository 사용)
                   List<String> threeDimensionsGoodsImagePaths = goodsRepository.findBySalesBoardId(salesBoard.getSalesBoardId())
                           .stream()
                           .map(Goods::getThreeDimensionsGoodsImagePath)
                           .collect(Collectors.toList());

                   // SalesBoard 인스턴스의 toDTO 메서드 호출
                   return salesBoard.toDTO(goodsImagePaths, threeDimensionsGoodsImagePaths);
               })
               .collect(Collectors.toList());

       return new PageImpl<>(salesBoardDTOs, pageable, salesBoards.getTotalElements());
   }

    // 물건 상세
    @Transactional
    public SalesBoardDTO getSalesBoardById(Long boardId) {
        SalesBoard salesBoard = salesBoardRepository.findById(boardId)
                .orElseThrow(() -> new RuntimeException("존재하지 않는 물건입니다."));

        salesBoard.setViewCnt(salesBoard.getViewCnt()+1);
        salesBoardRepository.save(salesBoard);
        // 일반 이미지
        List<String> goodsImagePaths = goodsImageRepository.findBySalesBoard(salesBoard)
                .stream()
                .map(GoodsImage::getGoodsImagePath)
                .collect(Collectors.toList());

        // 3D 이미지
        List<String> threeDimensionsGoodsImagePaths = goodsRepository.findBySalesBoardId(salesBoard.getSalesBoardId())
                .stream()
                .map(Goods::getThreeDimensionsGoodsImagePath)
                .collect(Collectors.toList());

        return SalesBoardDTO.toDTO(salesBoard, goodsImagePaths, threeDimensionsGoodsImagePaths);
    }

    public Page<SalesBoardDTO> getAllGoods(Pageable pageable) {
        return salesBoardRepository.findAll(pageable)
                .map(salesBoard -> {
                    // 빈 리스트로 이미지 경로 초기화
                    List<String> goodsImagePaths = Collections.emptyList();
                    List<String> threeDimensionsGoodsImagePaths = Collections.emptyList();

                    // 필요한 경우 Repository를 통해 이미지 경로 조회
                    goodsImagePaths = goodsImageRepository.findBySalesBoard(salesBoard)
                            .stream()
                            .map(GoodsImage::getGoodsImagePath)
                            .toList();

                    threeDimensionsGoodsImagePaths = goodsRepository.findBySalesBoardId(salesBoard.getSalesBoardId())
                            .stream()
                            .map(Goods::getThreeDimensionsGoodsImagePath)
                            .toList();

                    return salesBoard.toDTO(goodsImagePaths, threeDimensionsGoodsImagePaths);
                });
    }


}

