package com.homeggu.domain.saledBoardLike.controller;

import com.homeggu.domain.saledBoardLike.dto.request.LikeRequest;
import com.homeggu.domain.saledBoardLike.dto.response.LikeListResponse;
import com.homeggu.domain.saledBoardLike.dto.response.LikeResponse;
import com.homeggu.domain.saledBoardLike.service.LikeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/like")
@RequiredArgsConstructor
public class LikeController {

    private final LikeService likeService;

    // 찜 등록
    @PostMapping("")
    public ResponseEntity<LikeResponse> addLike(@RequestHeader("Authorization") String authorizationHeader, @RequestBody LikeRequest likeRequest) {
        String accessToken = authorizationHeader.substring(7);
        LikeResponse likeResponse = likeService.addLike(accessToken, likeRequest.getSalesBoardId());
        return ResponseEntity.ok().body(likeResponse);
    }

    // 찜 해제
    @DeleteMapping("")
    public ResponseEntity<LikeResponse> deleteLike(@RequestHeader("Authorization") String authorizationHeader, @RequestBody LikeRequest likeRequest) {
        String accessToken = authorizationHeader.substring(7);
        LikeResponse likeResponse = likeService.deleteLike(accessToken, likeRequest.getSalesBoardId());
        return ResponseEntity.ok().body(likeResponse);
    }

    // 사용자가 등록한 찜 목록 조회
    @GetMapping("/list")
    public ResponseEntity<LikeListResponse> getUserLikes(@RequestHeader("Authorization") String authorizationHeader) {
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
