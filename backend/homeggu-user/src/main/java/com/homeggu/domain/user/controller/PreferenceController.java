package com.homeggu.domain.user.controller;

import com.homeggu.domain.user.service.PreferenceService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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
        return ResponseEntity.ok("OK");
    }
}
