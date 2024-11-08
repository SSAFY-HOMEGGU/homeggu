package com.homeggu.domain.user.service;

import com.homeggu.domain.auth.entity.User;
import com.homeggu.domain.auth.repository.UserRepository;
import com.homeggu.domain.user.entity.Preference;
import com.homeggu.domain.user.repository.PreferenceRepository;
import com.homeggu.global.util.jwt.JwtProvider;
import io.jsonwebtoken.Claims;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
public class PreferenceService {

    private final UserRepository userRepository;
    private final PreferenceRepository preferenceRepository;
    private final JwtProvider jwtProvider;

    public PreferenceService(UserRepository userRepository, PreferenceRepository preferenceRepository, JwtProvider jwtProvider) {
        this.userRepository = userRepository;
        this.preferenceRepository = preferenceRepository;
        this.jwtProvider = jwtProvider;
    }

    // 회원가입 시 사용자의 카테고리, 분위기 초기화
    public void saveInitPreference(String accessToken) {
        Claims claims = jwtProvider.parseToken(accessToken);
        int userId = claims.get("userId", Integer.class);

        User user = userRepository.findById(userId).orElse(null);

        // 초기 카테고리 선호도
        Map<String, Double> categoryPreferences = new HashMap<>();
        categoryPreferences.put("가전", 0.5);
        categoryPreferences.put("침대", 0.5);
        categoryPreferences.put("책상", 0.5);
        categoryPreferences.put("식탁", 0.5);
        categoryPreferences.put("의자", 0.5);
        categoryPreferences.put("소파", 0.5);
        categoryPreferences.put("조명", 0.5);
        categoryPreferences.put("전등", 0.5);
        categoryPreferences.put("수납", 0.5);
        categoryPreferences.put("서랍", 0.5);

        // 초기 분위기 선호도
        Map<String, Double> moodPreferences = new HashMap<>();
        moodPreferences.put("우드 & 빈티지", 0.5);
        moodPreferences.put("블랙 & 메탈릭", 0.5);
        moodPreferences.put("화이트 & 미니멀", 0.5);
        moodPreferences.put("모던 & 클래식", 0.5);

        Preference preference = Preference.builder()
                .user(user)
                .categoryPreferences(categoryPreferences)
                .moodPreferences(moodPreferences)
                .build();

        preferenceRepository.save(preference);
    }
}
