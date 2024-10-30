package com.homeggu.domain.user.controller;

import com.homeggu.domain.user.dto.request.NicknameRequest;
import com.homeggu.domain.user.dto.response.UpdateProfileResponse;
import com.homeggu.domain.user.entity.UserProfile;
import com.homeggu.domain.user.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/user-profile")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    // 사용자 정보 상세 조회
    @GetMapping("/detail")
    public ResponseEntity<UserProfile> getUserProfile(@RequestHeader("Authorization") String authorizationHeader) {
        String accessToken = authorizationHeader.substring(7);
        UserProfile userProfile = userService.getUserProfile(accessToken);

        return ResponseEntity.ok(userProfile);
    }

    // 사용자 정보 수정
    @PutMapping("/update")
    public ResponseEntity<?> updateUserProfile(@RequestHeader("Authorization") String authorizationHeader, @RequestBody UpdateProfileResponse updateProfileResponse) {
        String accessToken = authorizationHeader.substring(7);
        userService.updateUserProfile(accessToken, updateProfileResponse);
        return ResponseEntity.ok("수정 완료");
    }

    // 닉네임 중복 검사
    @PostMapping("/nickname")
    public ResponseEntity<?> duplicateNickname(@RequestBody NicknameRequest nicknameRequest) {
        String nickname = nicknameRequest.getNickname();
        boolean isDuplicate = userService.checkNicknameDuplication(nickname);
        if (isDuplicate) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("중복된 닉네임입니다.");
        } else {
            return ResponseEntity.ok("사용 가능한 닉네임입니다.");
        }
    }
}
