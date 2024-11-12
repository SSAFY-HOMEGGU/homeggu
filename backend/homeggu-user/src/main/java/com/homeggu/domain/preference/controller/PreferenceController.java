package com.homeggu.domain.preference.controller;

import com.homeggu.domain.preference.dto.request.PreferenceRequest;
import com.homeggu.domain.preference.service.PreferenceService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/preference")
@RequiredArgsConstructor
public class PreferenceController {

    private final PreferenceService preferenceService;

    // 회원가입 시 사용자의 카테고리, 분위기 초기화
    @GetMapping("/init")
    public ResponseEntity<String> initPreference(@RequestHeader("Authorization") String authorizationHeader) {
        String accessToken = authorizationHeader.substring(7);
        preferenceService.saveInitPreference(accessToken);
        return ResponseEntity.ok().build();
    }

    // 사용자 선호도 업데이트
    @PostMapping("/update")
    public ResponseEntity<String> updatePreference(@RequestHeader("Authorization") String authorizationHeader, @RequestBody PreferenceRequest preferenceRequest) {
        String accessToken = authorizationHeader.substring(7);
        preferenceService.updatePreference(accessToken, preferenceRequest);
        return ResponseEntity.ok().build();
    }

    // 구매확정 시 선호도 변경
    @PostMapping("/buy")
    public ResponseEntity<String> buyPreference(@RequestHeader("Authorization") String authorizationHeader, @RequestBody PreferenceRequest preferenceRequest) {
        String accessToken = authorizationHeader.substring(7);
        preferenceService.buyPreference(accessToken, preferenceRequest);
        return ResponseEntity.ok().build();
    }

    // 추천 상품 리스트
    @PostMapping("/list")
    public ResponseEntity<?> recommendList(@RequestHeader("Authorization") String authorizationHeader) {
        String accessToken = authorizationHeader.substring(7);
        Map<String, Object> recommendations = preferenceService.getRecommendations(accessToken);
        return ResponseEntity.ok(recommendations);
    }
}
