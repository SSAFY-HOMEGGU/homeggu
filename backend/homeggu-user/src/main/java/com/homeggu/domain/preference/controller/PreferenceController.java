package com.homeggu.domain.preference.controller;

import com.homeggu.domain.preference.dto.request.PreferenceRequest;
import com.homeggu.domain.preference.service.PreferenceService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;

import java.util.Map;

@RestController
@RequestMapping("/api/user")
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

    @GetMapping("/preference/list")
    public Mono<ResponseEntity<Map<String, Object>>> recommendList(@RequestHeader("userId") Long userId) {
        return preferenceService.getRecommendations(userId)
                .map(ResponseEntity::ok)
                .onErrorResume(e -> Mono.just(ResponseEntity.badRequest().body(
                        Map.of("error", e.getMessage())
                )));
    }
}
