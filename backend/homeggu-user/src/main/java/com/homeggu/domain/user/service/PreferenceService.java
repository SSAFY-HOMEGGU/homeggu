package com.homeggu.domain.user.service;

import com.homeggu.domain.auth.entity.User;
import com.homeggu.domain.auth.repository.UserRepository;
import com.homeggu.domain.user.dto.request.PreferenceRequest;
import com.homeggu.domain.user.entity.Preference;
import com.homeggu.domain.user.repository.PreferenceRepository;
import com.homeggu.global.util.jwt.JwtProvider;
import io.jsonwebtoken.Claims;
import jakarta.transaction.Transactional;
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
        categoryPreferences.put("가전", 0.400);
        categoryPreferences.put("침대", 0.400);
        categoryPreferences.put("책상", 0.400);
        categoryPreferences.put("식탁", 0.400);
        categoryPreferences.put("의자", 0.400);
        categoryPreferences.put("소파", 0.400);
        categoryPreferences.put("조명", 0.400);
        categoryPreferences.put("전등", 0.400);
        categoryPreferences.put("수납", 0.400);
        categoryPreferences.put("서랍", 0.400);

        // 초기 분위기 선호도
        Map<String, Double> moodPreferences = new HashMap<>();
        moodPreferences.put("우드 & 빈티지", 0.400);
        moodPreferences.put("블랙 & 메탈릭", 0.400);
        moodPreferences.put("화이트 & 미니멀", 0.400);
        moodPreferences.put("모던 & 클래식", 0.400);

        Preference preference = Preference.builder()
                .user(user)
                .categoryPreferences(categoryPreferences)
                .moodPreferences(moodPreferences)
                .build();

        preferenceRepository.save(preference);
    }

    // 사용자 선호도 업데이트
    @Transactional
    public void updatePreference(String accessToken, PreferenceRequest preferenceRequest) {
        Claims claims = jwtProvider.parseToken(accessToken);
        int userId = claims.get("userId", Integer.class);

        String category = preferenceRequest.getCategory();
        String mood = preferenceRequest.getMood();
        String action = preferenceRequest.getAction();

        // action에 따른 가중치 비율 설정 (퍼센트 증가)
        double weightPercentage = switch (action) {
            case "click" -> 0.03;
            case "like" -> 0.05;
            case "search" -> 0.07;
            case "chat" -> 0.1;
            default -> throw new IllegalArgumentException("Invalid action type: " + action);
        };

        Preference preference = preferenceRepository.findById(userId).orElse(null);
        if (preference != null) {
            Map<String, Double> categoryPreferences = preference.getCategoryPreferences();
            Map<String, Double> moodPreferences = preference.getMoodPreferences();

            // 카테고리 업데이트
            if (categoryPreferences.containsKey(category)) {
                double currentPreference = categoryPreferences.get(category);
                double updatedPreference = currentPreference * (1 + weightPercentage);
                categoryPreferences.put(category, Math.min(1.000, Math.max(0.0, (double) Math.round(updatedPreference * 1000) / 1000))); // 상한선/하한선 적용
                moodPreferences.put(mood, Math.min(1.000, Math.max(0.0, (double) Math.round(updatedPreference * 1000) / 1000))); // 상한선/하한선 적용
            }
        }
    }

    // 구매확정 시 선호도 변경
    @Transactional
    public void buyPreference(String accessToken, PreferenceRequest preferenceRequest) {
        Claims claims = jwtProvider.parseToken(accessToken);
        int userId = claims.get("userId", Integer.class);

        String category = preferenceRequest.getCategory();
        String mood = preferenceRequest.getMood();

        Preference preference = preferenceRepository.findById(userId).orElse(null);
        if (preference != null) {
            Map<String, Double> categoryPreferences = preference.getCategoryPreferences();
            Map<String, Double> moodPreferences = preference.getMoodPreferences();

            // 카테고리 선호도 감소
            if (categoryPreferences.containsKey(category)) {
                double currentCategoryPreference = categoryPreferences.get(category);
                double updatedCategoryPreference = currentCategoryPreference * 0.3;
                categoryPreferences.put(category, Math.max(0.100, (double) Math.round(updatedCategoryPreference * 1000) / 1000));
            }

            // 분위기 선호도 증가
            if (moodPreferences.containsKey(mood)) {
                double currentMoodPreference = moodPreferences.get(mood);
                double updatedMoodPreference = currentMoodPreference * 1.3;
                moodPreferences.put(mood, Math.min(1.000, (double) Math.round(updatedMoodPreference * 1000) / 1000));
            }
        }
    }


}
