package com.homeggu.domain.userProfile.controller;

import com.homeggu.domain.userProfile.dto.request.NicknameRequest;
import com.homeggu.domain.userProfile.dto.response.UpdateProfileResponse;
import com.homeggu.domain.userProfile.entity.UserProfile;
import com.homeggu.domain.userProfile.service.UserProfileService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/user")
@RequiredArgsConstructor
public class UserProfileController {

    private final UserProfileService userProfileService;

    // 사용자 정보 상세 조회
    @GetMapping("/profile/detail")
    public ResponseEntity<UserProfile> getUserProfile(@RequestHeader("userId") Long userId) {
        UserProfile userProfile = userProfileService.getUserProfile(userId);
        return ResponseEntity.ok(userProfile);
    }

    // 사용자 정보 수정
    @PutMapping("/profile/update")
    public ResponseEntity<?> updateUserProfile(@RequestHeader("userId") Long userId, @RequestBody UpdateProfileResponse updateProfileResponse) {
        userProfileService.updateUserProfile(userId, updateProfileResponse);
        return ResponseEntity.ok("수정 완료");
    }

    // 닉네임 중복 검사
    @PostMapping("/profile/nickname")
    public ResponseEntity<?> duplicateNickname(@RequestBody NicknameRequest nicknameRequest) {
        String nickname = nicknameRequest.getNickname();
        boolean isDuplicate = userProfileService.checkNicknameDuplication(nickname);
        if (isDuplicate) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("중복된 닉네임입니다.");
        } else {
            return ResponseEntity.ok("사용 가능한 닉네임입니다.");
        }
    }
}
