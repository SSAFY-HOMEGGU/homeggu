package com.homeggu.domain.user.service;

import com.homeggu.domain.user.entity.UserProfile;
import com.homeggu.domain.user.repository.UserProfileRepository;
import com.homeggu.global.util.jwt.JwtProvider;
import io.jsonwebtoken.Claims;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserProfileRepository userProfileRepository;
    private final JwtProvider jwtProvider;

    // 사용자 상세 정보 조회
    public Optional<UserProfile> getUserProfile(String accessToken) {
        // access token에서 user id 추출
        Claims claims = jwtProvider.parseToken(accessToken);
        int userId = claims.get("userId", Integer.class);

        return userProfileRepository.findByUserProfileId(userId);
    }
}
