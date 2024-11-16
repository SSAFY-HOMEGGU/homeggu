package com.homeggu.domain.userProfile.controller;

import com.homeggu.domain.userProfile.dto.request.NicknameRequest;
import com.homeggu.domain.userProfile.dto.response.UpdateProfileResponse;
import com.homeggu.domain.userProfile.entity.UserProfile;
import com.homeggu.domain.userProfile.service.UserProfileService;
import com.homeggu.global.s3.S3Service;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@RestController
@RequestMapping("/api/user")
@RequiredArgsConstructor
public class UserProfileController {

    private final UserProfileService userProfileService;
    private final S3Service s3Service;

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

    // 프로필 이미지 등록
    @PostMapping("/profile/image")
    public ResponseEntity<?> uploadUserImage(@RequestParam("file") MultipartFile file)throws IOException {
         if(file.isEmpty()) {
            return new ResponseEntity<>("파일이 비어있습니다.",HttpStatus.BAD_REQUEST);
         }
        try{
            String userImagePath = s3Service.uploadFile(file);
            return new ResponseEntity<>(userImagePath, HttpStatus.CREATED);
        }catch (Exception e) {
            return new ResponseEntity<>("서버에서 오류가 발생했습니다.", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

}
