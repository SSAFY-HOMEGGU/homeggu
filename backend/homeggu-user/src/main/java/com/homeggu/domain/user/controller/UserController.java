package com.homeggu.domain.user.controller;

import com.homeggu.domain.user.dto.request.KakaoLoginRequest;
import com.homeggu.domain.user.dto.response.KakaoLoginResponse;
import com.homeggu.domain.user.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/oauth")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    // 카카오 로그인
    // 프론트에서 보낸 인가 코드를 이용해 카카오 서버에서 access token을 발급받습니다.
    // 이후에 자체 access token을 생성해 response로 전송합니다.
    @PostMapping("/kakao/login")
    public ResponseEntity<?> kakaoLogin(@RequestBody KakaoLoginRequest loginRequest) {
        String code = loginRequest.getCode();
        KakaoLoginResponse kakaoLoginResponse = userService.kakaoLogin(code);
        return ResponseEntity.ok(kakaoLoginResponse);
    }

    // 카카오 로그아웃
    @PostMapping("/kakao/logout")
    public ResponseEntity<?> logout(@RequestHeader("Authorization") String authorizationHeader) {
        String accessToken = authorizationHeader.substring(7);
        if (userService.kakaoLogout(accessToken)) {
            return ResponseEntity.ok("로그아웃 성공");
        } else {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("로그아웃 실패");
        }
    }

    // 최초 로그인 시, 사용자 취향 반영 완료
    @GetMapping("/kakao/firstLogin")
    public ResponseEntity<?> firstLogin(@RequestHeader("Authorization") String authorizationHeader) {
        String accessToken = authorizationHeader.substring(7);
        if (userService.firstLogin(accessToken)) {
            return ResponseEntity.ok("회원가입 성공");
        } else {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("회원가입 실패");
        }
    }
}
