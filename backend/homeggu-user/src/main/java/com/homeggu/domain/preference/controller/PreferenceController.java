package com.homeggu.domain.preference.controller;

import com.homeggu.domain.preference.dto.request.PreferenceRequest;
import com.homeggu.domain.preference.service.PreferenceService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/user")
@RequiredArgsConstructor
public class PreferenceController {

    private final PreferenceService preferenceService;

    // 회원가입 시 사용자의 카테고리, 분위기 초기화
    @GetMapping("/preference/init")
    public ResponseEntity<String> initPreference(@RequestHeader("userId") Long userId) {
        preferenceService.saveInitPreference(userId);
        return ResponseEntity.ok().build();
    }

    // 사용자 선호도 업데이트
    @PostMapping("/preference/update")
    public ResponseEntity<String> updatePreference(@RequestHeader("userId") Long userId, @RequestBody PreferenceRequest preferenceRequest) {
        preferenceService.updatePreference(userId, preferenceRequest);
        return ResponseEntity.ok().build();
    }

    // 구매확정 시 선호도 변경
    @PostMapping("/preference/buy")
    public ResponseEntity<String> buyPreference(@RequestHeader("userId") Long userId, @RequestBody PreferenceRequest preferenceRequest) {
        preferenceService.buyPreference(userId, preferenceRequest);
        return ResponseEntity.ok().build();
    }

    // 추천 상품 리스트
    @PostMapping("/preference/list")
    public ResponseEntity<?> recommendList(@RequestHeader("userId") Long userId) {
        Map<String, Object> recommendations = preferenceService.getRecommendations(userId);
        return ResponseEntity.ok(recommendations);
    }
}
