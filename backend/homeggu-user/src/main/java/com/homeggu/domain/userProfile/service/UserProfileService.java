package com.homeggu.domain.userProfile.service;

import com.homeggu.domain.userProfile.dto.response.UpdateProfileResponse;
import com.homeggu.domain.userProfile.entity.UserProfile;
import com.homeggu.domain.userProfile.repository.UserProfileRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.NoSuchElementException;

@Service
@RequiredArgsConstructor
public class UserProfileService {

    private final UserProfileRepository userProfileRepository;

    // 사용자 상세 정보 조회
    public UserProfile getUserProfile(Long userId) {
        // Optional을 처리하여 UserProfile 반환, 값이 없으면 예외 처리
        return userProfileRepository.findByUserProfileId(userId)
                .orElseThrow(() -> new NoSuchElementException("유저 프로필을 찾을 수 없습니다."));
    }

    // 사용자 정보 수정
    public void updateUserProfile(Long userId, UpdateProfileResponse updateProfileResponse) {
        // 기존 정보 조회
        UserProfile newUserProfile = userProfileRepository.findByUserProfileId(userId)
                .orElseThrow(() -> new NoSuchElementException("유저 프로필을 찾지 못했습니다."));

        // 변경 사항만 업데이트
        if (updateProfileResponse.getNickname() != null) {
            newUserProfile.updateNickname(updateProfileResponse.getNickname());
        }
        if (updateProfileResponse.getAddress() != null) {
            newUserProfile.updateAddress(updateProfileResponse.getAddress());
        }
        if (updateProfileResponse.getAddressDetail() != null) {
            newUserProfile.updateAddressDetail(updateProfileResponse.getAddressDetail());
        }
        if (updateProfileResponse.getAddressNickname() != null) {
            newUserProfile.updateAddressNickname(updateProfileResponse.getAddressNickname());
        }
        if (updateProfileResponse.getPhoneNumber() != null) {
            newUserProfile.updatePhoneNumber(updateProfileResponse.getPhoneNumber());
        }
        if (updateProfileResponse.getUserImagePath() != null) {
            newUserProfile.updateUserImagePath(updateProfileResponse.getUserImagePath());
        }

        userProfileRepository.save(newUserProfile);
    }

    // 닉네임 중복 검사
    public boolean checkNicknameDuplication(String nickname) {
        return userProfileRepository.existsByNickname(nickname);
    }
}
