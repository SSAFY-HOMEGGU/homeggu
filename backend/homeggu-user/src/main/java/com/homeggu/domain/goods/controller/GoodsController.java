package com.homeggu.domain.goods.controller;

import com.homeggu.domain.goods.service.GoodsService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/user")
@RequiredArgsConstructor
public class GoodsController {

    private final GoodsService goodsService;

    // 최근에 본 게시물 가져오기
    @GetMapping("/goods/latest")
    public ResponseEntity<List<String>> getRecentItems(@RequestHeader("userId") Long userId) {
        return ResponseEntity.ok().body(goodsService.getRecentItems(userId));
    }

}
