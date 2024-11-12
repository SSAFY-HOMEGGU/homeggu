package com.homeggu.domain.preference.service;

import com.homeggu.domain.user.entity.User;
import com.homeggu.domain.user.repository.UserRepository;
import com.homeggu.domain.preference.dto.request.PreferenceRequest;
import com.homeggu.domain.preference.entity.Preference;
import com.homeggu.domain.preference.repository.PreferenceRepository;
import com.homeggu.global.util.jwt.JwtProvider;
import io.jsonwebtoken.Claims;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.time.Duration;
import java.util.HashMap;
import java.util.Map;
import java.util.Set;

@Service
public class PreferenceService {

    private final UserRepository userRepository;
    private final PreferenceRepository preferenceRepository;
    private final JwtProvider jwtProvider;
    private final RedisTemplate redisTemplate;
    private final WebClient webClient;

    public PreferenceService(UserRepository userRepository, PreferenceRepository preferenceRepository, JwtProvider jwtProvider, @Qualifier("redisTemplate") RedisTemplate redisTemplate, WebClient.Builder webClientBuilder) {
        this.userRepository = userRepository;
        this.preferenceRepository = preferenceRepository;
        this.jwtProvider = jwtProvider;
        this.redisTemplate = redisTemplate;
        this.webClient = webClientBuilder.baseUrl("http://127.0.0.1:8000").build();
    }

    // 회원가입 시 사용자의 카테고리, 분위기 초기화
    public void saveInitPreference(String accessToken) {
        Claims claims = jwtProvider.parseToken(accessToken);
        int userId = claims.get("userId", Integer.class);

        User user = userRepository.findById(userId).orElse(null);

        // 초기 카테고리 선호도
        Map<String, Double> categoryPreferences = new HashMap<>();
        categoryPreferences.put("가전", 0.4);
        categoryPreferences.put("침대", 0.4);
        categoryPreferences.put("책상", 0.4);
        categoryPreferences.put("식탁", 0.4);
        categoryPreferences.put("의자", 0.4);
        categoryPreferences.put("소파", 0.4);
        categoryPreferences.put("조명", 0.4);
        categoryPreferences.put("전등", 0.4);
        categoryPreferences.put("수납", 0.4);
        categoryPreferences.put("서랍", 0.4);

        // 초기 분위기 선호도
        Map<String, Double> moodPreferences = new HashMap<>();
        moodPreferences.put("우드 & 빈티지", 0.4);
        moodPreferences.put("블랙 & 메탈릭", 0.4);
        moodPreferences.put("화이트 & 미니멀", 0.4);
        moodPreferences.put("모던 & 클래식", 0.4);

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
            case "search" -> 0.1;
            case "chat" -> 0.15;
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
                categoryPreferences.put(category, Math.min(1.0, Math.max(0.0, (double) Math.round(updatedPreference * 1000) / 1000)));
                moodPreferences.put(mood, Math.min(1.0, Math.max(0.0, (double) Math.round(updatedPreference * 1000) / 1000)));

                // 최근에 업데이트 된 카테고리, 분위기
                updateRecentlyItems(userId, category, mood);

                // 호출 횟수 증가
                String callCountKey = "preferenceUpdateCount:" + userId;

                // Redis에서 호출 횟수 가져오기
                String callCountStr = (String) redisTemplate.opsForValue().get(callCountKey);
                int callCount = callCountStr != null ? Integer.parseInt(callCountStr) : 0;

                // 호출 횟수 증가
                callCount += 1;

                // 호출 횟수 저장 (문자열로 저장)
                redisTemplate.opsForValue().set(callCountKey, String.valueOf(callCount), Duration.ofDays(1));

                // 10번 호출 시 decreasePreference 실행
                if (callCount >= 10) {
                    decreasePreference(accessToken);

                    // 호출 횟수 초기화 (문자열로 저장)
                    redisTemplate.opsForValue().set(callCountKey, "0", Duration.ofDays(1));
                }
            }
        }
    }

    // Redis에 최근 업데이트된 항목 저장
    private void updateRecentlyItems(int userId, String category, String mood) {
        String categoryKey = "recentlyUpdated:categories:" + userId;
        String moodKey = "recentlyUpdated:moods:" + userId;

        // Redis에 저장 및 TTL 설정
        redisTemplate.opsForSet().add(categoryKey, category);
        redisTemplate.opsForSet().add(moodKey, mood);

        // TTL 설정 (7일 동안 유지)
        redisTemplate.expire(categoryKey, Duration.ofDays(7));
        redisTemplate.expire(moodKey, Duration.ofDays(7));
    }

    // 최근에 선호도가 오르지 않은 항목은 선호도 감소
    @Transactional
    public void decreasePreference(String accessToken) {
        Claims claims = jwtProvider.parseToken(accessToken);
        int userId = claims.get("userId", Integer.class);

        Preference preference = preferenceRepository.findById(userId).orElse(null);
        if (preference != null) {
            Map<String, Double> categoryPreferences = preference.getCategoryPreferences();
            Map<String, Double> moodPreferences = preference.getMoodPreferences();

            // Redis에서 최근에 업데이트 된 항목 가져오기
            Set<String> updatedCategories = getUpdatedCategories(userId);
            Set<String> updatedMoods = getUpdatedMoods(userId);

            // 전체 카테고리와 분위기 가져오기
            Set<String> allCategories = categoryPreferences.keySet();
            Set<String> allMoods = moodPreferences.keySet();

            // 제외된 카테고리와 분위기 감소
            for (String category : allCategories) {
                if (!updatedCategories.contains(category)) {
                    double currentPreference = categoryPreferences.get(category);
                    double updatedPreference = Math.min(1.0, Math.max(0.0, (double) Math.round(currentPreference * 0.95 * 1000) / 1000));
                    categoryPreferences.put(category, updatedPreference);
                }
            }

            for (String mood : allMoods) {
                if (!updatedMoods.contains(mood)) {
                    double currentPreference = moodPreferences.get(mood);
                    double updatedPreference = Math.min(1.0, Math.max(0.0, (double) Math.round(currentPreference * 0.95 * 1000) / 1000));
                    moodPreferences.put(mood, updatedPreference);
                }
            }
        }
    }

    // Redis에서 최근 업데이트된 카테고리 가져오기
    private Set<String> getUpdatedCategories(int userId) {
        String categoryKey = "recentlyUpdated:categories:" + userId;
        return redisTemplate.opsForSet().members(categoryKey);
    }

    // Redis에서 최근 업데이트된 분위기 가져오기
    private Set<String> getUpdatedMoods(int userId) {
        String moodKey = "recentlyUpdated:moods:" + userId;
        return redisTemplate.opsForSet().members(moodKey);
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

    // 추천 상품 리스트
    public Map<String, Object> getRecommendations(String accessToken) {
        // 사용자 선호도 가져오기
        Claims claims = jwtProvider.parseToken(accessToken);
        int userId = claims.get("userId", Integer.class);

        Preference preference = preferenceRepository.findById(userId).orElse(null);
        Map<String, Double> categoryPreferences = preference.getCategoryPreferences();
        Map<String, Double> moodPreferences = preference.getMoodPreferences();

        // request 데이터 구성
        Map<String, Object> preferences = new HashMap<>();
        preferences.put("category_preferences", categoryPreferences);
        preferences.put("mood_preferences", moodPreferences);

        // FastAPI로 POST 요청 전송
        return this.webClient.post()
                .uri("/fast-api/recommend")
                .bodyValue(preferences)
                .retrieve()
                .bodyToMono(Map.class)
                .block();
    }
}
