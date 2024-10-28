package com.homeggu.domain.auth.controller;

import com.homeggu.domain.auth.dto.request.KakaoLoginRequest;
import com.homeggu.domain.auth.dto.response.AccessTokenResponse;
import com.homeggu.domain.auth.entity.User;
import com.homeggu.domain.auth.entity.UserProfile;
import com.homeggu.domain.auth.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/oauth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    // 카카오 소셜 로그인
    // 프론트에서 보낸 인가 코드를 이용해 카카오 서버에서 access token을 발급받습니다.
    // 이후에 자체 access token을 생성해 response로 전송합니다.
    @PostMapping("/kakao")
    public ResponseEntity<?> kakaoLogin(@RequestBody KakaoLoginRequest loginRequest) {
        AccessTokenResponse accessToken = new AccessTokenResponse(); // 서비스에서 반환할 예정
        String code = loginRequest.getCode();
        UserProfile userProfile = authService.kakaoLogin(code);
        return ResponseEntity.ok(userProfile);
    }
}
