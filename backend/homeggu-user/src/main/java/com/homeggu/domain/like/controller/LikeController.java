package com.homeggu.domain.like.controller;

import com.homeggu.domain.like.dto.request.LikeRequest;
import com.homeggu.domain.like.entity.Like;
import com.homeggu.domain.like.service.LikeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/like")
@RequiredArgsConstructor
public class LikeController {

    private final LikeService likeService;

    // 찜 등록
    @PostMapping("")
    public ResponseEntity<?> addLike(@RequestHeader("Authorization") String authorizationHeader, @RequestBody LikeRequest likeRequest) {
        String accessToken = authorizationHeader.substring(7);
        likeService.addLike(accessToken, likeRequest.getSalesBoardId());
        return ResponseEntity.ok().build();
    }

    // 찜 해제
    @DeleteMapping("")
    public ResponseEntity<?> deleteLike(@RequestHeader("Authorization") String authorizationHeader, @RequestBody LikeRequest likeRequest) {
        String accessToken = authorizationHeader.substring(7);
        likeService.deleteLike(accessToken, likeRequest.getSalesBoardId());
        return ResponseEntity.ok().build();
    }

    // 사용자가 등록한 찜 목록 조회
    @GetMapping("/list")
    public ResponseEntity<List<Like>> getUserLikes(@RequestHeader("Authorization") String authorizationHeader) {
        String accessToken = authorizationHeader.substring(7);
        return ResponseEntity.ok().body(likeService.getLikes(accessToken));
    }

    // 찜 여부 확인
    @GetMapping("/isLike")
    public ResponseEntity<Boolean> isLike(@RequestHeader("Authorization") String authorizationHeader, @RequestBody LikeRequest likeRequest) {
        String accessToken = authorizationHeader.substring(7);
        return ResponseEntity.ok().body(likeService.checkIsLiked(accessToken, likeRequest.getSalesBoardId()));
    }
}
