package com.homeggu.domain.saledBoardLike.controller;

import com.homeggu.domain.saledBoardLike.dto.request.LikeRequest;
import com.homeggu.domain.saledBoardLike.dto.response.LikeListResponse;
import com.homeggu.domain.saledBoardLike.dto.response.LikeResponse;
import com.homeggu.domain.saledBoardLike.service.LikeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/api/user")
@RequiredArgsConstructor
public class LikeController {

    private final LikeService likeService;

    // 찜 등록
    @PostMapping("/like")
    public ResponseEntity<LikeResponse> addLike(@RequestHeader("userId") Long userId, @RequestBody LikeRequest likeRequest) {
        LikeResponse likeResponse = likeService.addLike(userId, likeRequest.getSalesBoardId());
        return ResponseEntity.ok().body(likeResponse);
    }

    // 찜 해제
    @DeleteMapping("/like")
    public ResponseEntity<LikeResponse> deleteLike(@RequestHeader("userId") Long userId, @RequestBody LikeRequest likeRequest) {
        LikeResponse likeResponse = likeService.deleteLike(userId, likeRequest.getSalesBoardId());
        return ResponseEntity.ok().body(likeResponse);
    }

    // 사용자가 등록한 찜 목록 조회
    @GetMapping("/like/list")
    public ResponseEntity<LikeListResponse> getUserLikes(@RequestHeader("userId") Long userId) {
        return ResponseEntity.ok().body(likeService.getLikes(userId));
    }

    // 찜 여부 확인
    @PostMapping("/like/isLike")
    public ResponseEntity<Boolean> isLike(@RequestHeader("userId") Long userId, @RequestBody LikeRequest likeRequest) {
        return ResponseEntity.ok().body(likeService.checkIsLiked(userId, likeRequest.getSalesBoardId()));
    }
}
