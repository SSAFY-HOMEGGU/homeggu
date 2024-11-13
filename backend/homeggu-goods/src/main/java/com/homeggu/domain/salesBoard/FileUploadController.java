package com.homeggu.domain.salesBoard;

import com.homeggu.domain.goodsImage.GoodsImageRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;


@RestController
@RequestMapping("/upload")
public class FileUploadController {

    @PostMapping("/file")
    public ResponseEntity<String> uploadFile(@RequestParam("file") MultipartFile file) {
        // 파일이 비어 있는지 체크
        if (file.isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("파일이 비어 있습니다.");
        }

        // 파일 이름 가져오기
        String fileName = file.getOriginalFilename();

        // 파일 처리 로직 (예: 저장, 분석 등) 추가 가능

        return ResponseEntity.ok("파일이 성공적으로 업로드되었습니다: " + fileName);
    }


}