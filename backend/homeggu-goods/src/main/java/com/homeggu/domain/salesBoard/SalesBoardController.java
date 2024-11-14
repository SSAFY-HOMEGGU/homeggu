package com.homeggu.domain.salesBoard;

import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.model.ObjectMetadata;
import com.homeggu.domain.salesBoard.enums.Category;
import com.homeggu.domain.salesBoard.enums.IsSell;
import com.homeggu.domain.salesBoard.enums.Mood;
import com.homeggu.global.S3Service;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.net.URL;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/goods/board")
@RequiredArgsConstructor
public class SalesBoardController {
    private final SalesBoardService salesBoardService;
    private final S3Service s3Service;
    private final AmazonS3 amazonS3Client;


    // 2D 이미지 등록
    @PostMapping("/image")
    public List<String> uploadImages(@RequestParam("files") MultipartFile[] files) throws IOException {
        try{
            List<String> goodsImagePaths = new ArrayList<>();
            String imageUrl="";
            for(MultipartFile file : files){
                imageUrl = s3Service.uploadFile(file);
                goodsImagePaths.add(imageUrl);
            }
            return goodsImagePaths;
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    // 3D 이미지 등록
    @PostMapping("/3dimage")
    public List<String> upload3DImages(@RequestParam("files") MultipartFile[] files) throws IOException {
        try {
            List<String> uploadedFileUrls = new ArrayList<>();
            String fileUrl;

            for (MultipartFile file : files) {
                // 파일 확장자 검증
                String filename = file.getOriginalFilename();
                    fileUrl = s3Service.uploadFile(file); // S3에 업로드
                    uploadedFileUrls.add(fileUrl);
            }
            return uploadedFileUrls;
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }


    private String extractFileNameFromUrl(String fileUrl) {
        return fileUrl.substring(fileUrl.lastIndexOf('/') + 1).split("\\?")[0]; // URL에서 파일 이름과 확장자 추출
    }

    // 물건 등록
    @PostMapping
    public ResponseEntity<?> registGoods(
            @RequestBody RegisterGoodsRequest dto) {
        try {
            String userEmail = getAuth();
            Integer userId = 1; // 실제 사용자 ID로 변경 필요
            dto.getSalesBoardDTO().setUserId(userId);

            salesBoardService.registerGoods(dto);
            return ResponseEntity.status(HttpStatus.CREATED).body(Map.of("message", "성공적으로 등록되었습니다."));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("message", "입력한 데이터 형식이 올바르지 않습니다."));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("message", "서버에서 오류가 발생했습니다. 잠시 후 다시 시도해 주세요."));
        }
    }

    // 물건 수정
    @PutMapping("/{boardId}")
    public ResponseEntity<?> updateGoods(
            @PathVariable Integer boardId, // boardId는 여전히 필요
            @RequestBody RegisterGoodsRequest dto) { // RegisterGoodsRequest 사용
        try {
            String userEmail = getAuth();
            Integer userId = 1; // 실제 사용자 ID로 변경 필요
            dto.getSalesBoardDTO().setUserId(userId);
            dto.getSalesBoardDTO().setSalesBoardId(boardId); // boardId를 DTO에 설정

            // 상품 업데이트
            salesBoardService.updateGoods(dto);
            return ResponseEntity.status(HttpStatus.OK).body(Map.of("message", "성공적으로 수정되었습니다."));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(
                    Map.of("message", "입력한 데이터 형식이 올바르지 않습니다.")
            );
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                    Map.of("message", "서버에서 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.")
            );
        }
    }

    // 물건 삭제
    @DeleteMapping("/{boardId}")
    public ResponseEntity<?> deleteGoods(@PathVariable Integer boardId) {
        try{
            String userEmail = getAuth();
            Integer userId = 1;
            salesBoardService.deleteGoods(boardId,userId);
            return ResponseEntity.status(HttpStatus.OK).body(Map.of("message","성공적으로 삭제되었습니다."));
        }catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("message","잘못된 타입 요청입니다."));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body( Map.of("message", "서버에서 오류가 발생했습니다. 잠시 후 다시 시도해 주세요."));
        }
    }

    // 물건 보기
    @GetMapping
    public ResponseEntity<Page<SalesBoardDTO>> getGoods(
            @RequestParam(required = false) Category category, // Enum 타입으로 수정
            @RequestParam(required = false) Integer min_price,
            @RequestParam(required = false) Integer max_price,
            @RequestParam(required = false) IsSell isSell, // Enum 타입으로 수정
            @RequestParam(required = false) Mood mood,
            @RequestParam(required = false) String title, // 제목 검색 추가
            @RequestParam(defaultValue = "0") int page, // 페이지 번호
            @RequestParam(defaultValue = "10") int size // 페이지당 항목 수
    ) {
        Pageable pageable = PageRequest.of(page, size);
        Page<SalesBoardDTO> goods = salesBoardService.getFilteredGoods(category, min_price, max_price, isSell, title, pageable);
        return ResponseEntity.ok(goods);
    }

    //물건 상세
    @GetMapping("/{boardId}")
    public ResponseEntity<?> getGoods(@PathVariable Integer boardId) {
        try {
            SalesBoardDTO salesBoardDTO = salesBoardService.getSalesBoardById(boardId);
            return ResponseEntity.ok(salesBoardDTO);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("message", "서버에서 발생한 오류입니다."));
        }
    }

    private String getAuth() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null) {
            return authentication.getName(); // 이메일 반환
        }
        throw new RuntimeException("인가되지 않은 접근");
    }
}
