package com.homeggu.domain.preference.service;

import com.homeggu.domain.user.entity.User;
import com.homeggu.domain.user.repository.UserRepository;
import com.homeggu.domain.preference.dto.request.PreferenceRequest;
import com.homeggu.domain.preference.entity.Preference;
import com.homeggu.domain.preference.repository.PreferenceRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.time.Duration;
import java.util.*;

@Service
public class PreferenceService {

    private final UserRepository userRepository;
    private final PreferenceRepository preferenceRepository;
    private final RedisTemplate redisTemplate;
    private final WebClient webClient;

    public PreferenceService(UserRepository userRepository, PreferenceRepository preferenceRepository, @Qualifier("redisTemplate") RedisTemplate redisTemplate, WebClient.Builder webClientBuilder) {
        this.userRepository = userRepository;
        this.preferenceRepository = preferenceRepository;
        this.redisTemplate = redisTemplate;
        this.webClient = webClientBuilder.baseUrl("http://recommendation-backend:8001").build();
    }

    // 회원가입 시 사용자의 카테고리, 분위기 초기화
    public void saveInitPreference(Long userId) {
        User user = userRepository.findById(userId).orElse(null);

        // 초기 카테고리 선호도
        Map<String, Double> categoryPreferences = new HashMap<>();
        categoryPreferences.put("APPLIANCES", 0.4);
        categoryPreferences.put("BED", 0.4);
        categoryPreferences.put("DESK", 0.4);
        categoryPreferences.put("DINING_TABLE", 0.4);
        categoryPreferences.put("CHAIR", 0.4);
        categoryPreferences.put("SOFA", 0.4);
        categoryPreferences.put("LIGHTING", 0.4);
        categoryPreferences.put("LAMP", 0.4);
        categoryPreferences.put("STORAGE", 0.4);
        categoryPreferences.put("DRAWER", 0.4);

        // 초기 분위기 선호도
        Map<String, Double> moodPreferences = new HashMap<>();
        moodPreferences.put("WOOD_VINTAGE", 0.4);
        moodPreferences.put("BLACK_METALLIC", 0.4);
        moodPreferences.put("WHITE_MINIMAL", 0.4);
        moodPreferences.put("MODERN_CLASSIC", 0.4);

        Preference preference = Preference.builder()
                .user(user)
                .categoryPreferences(categoryPreferences)
                .moodPreferences(moodPreferences)
                .build();

        preferenceRepository.save(preference);
    }

    // 사용자 선호도 업데이트
    @Transactional
    public void updatePreference(Long userId, PreferenceRequest preferenceRequest) {
        String category = preferenceRequest.getCategory();
        String mood = preferenceRequest.getMood();
        String action = preferenceRequest.getAction();

        // action에 따른 가중치 비율 설정 (퍼센트 증가)
        double weightPercentage = switch (action) {
            case "firstCheck" -> 0.05;
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

            // 최초 로그인 시 mood만 선호도에 반영
            if (preferenceRequest.getAction().equals("firstCheck")) {
                double currentPreference = moodPreferences.get(mood);
                double updatedPreference = currentPreference * (1 + weightPercentage);
                moodPreferences.put(mood, Math.min(1.0, Math.max(0.0, (double) Math.round(updatedPreference * 1000) / 1000)));
            }

            // 카테고리와 분위기 업데이트
            else {
                double currentCategoryPreference = categoryPreferences.get(category);
                double currentMoodPreference = moodPreferences.get(mood);
                double updatedCategoryPreference = currentCategoryPreference * (1 + weightPercentage);
                double updatedMoodPreference = currentMoodPreference * (1 + weightPercentage);
                categoryPreferences.put(category, Math.min(1.0, Math.max(0.0, (double) Math.round(updatedCategoryPreference * 1000) / 1000)));
                moodPreferences.put(mood, Math.min(1.0, Math.max(0.0, (double) Math.round(updatedMoodPreference * 1000) / 1000)));

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
                    decreasePreference(userId);

                    // 호출 횟수 초기화 (문자열로 저장)
                    redisTemplate.opsForValue().set(callCountKey, "0", Duration.ofDays(1));
                }
            }

            // clikc action일 때 Redis에 최근에 본 게시물로 등록
            if (action.equals("click")) {
                manageRecentlyClickedItems(userId, preferenceRequest.getClickedSalesBoardId());
            }
        }
    }

    // Redis에 최근 업데이트된 항목 저장
    private void updateRecentlyItems(Long userId, String category, String mood) {
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
    public void decreasePreference(Long userId) {
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
    private Set<String> getUpdatedCategories(Long userId) {
        String categoryKey = "recentlyUpdated:categories:" + userId;
        return redisTemplate.opsForSet().members(categoryKey);
    }

    // Redis에서 최근 업데이트된 분위기 가져오기
    private Set<String> getUpdatedMoods(Long userId) {
        String moodKey = "recentlyUpdated:moods:" + userId;
        return redisTemplate.opsForSet().members(moodKey);
    }

    // Redis에 최근 본 게시물 저장하기
    private void manageRecentlyClickedItems(Long userId, Long clickedSalesBoardId) {
        String recentClickedKey = "recentClicked:" + userId;

        // Redis에서 최근 본 게시물 리스트 가져오기
        List<String> recentClickedList = redisTemplate.opsForList().range(recentClickedKey, 0, -1);
        if (recentClickedList == null) {
            recentClickedList = new ArrayList<>();
        }

        // 기존 리스트에서 클릭한 게시물 ID 제거 -> 중복 제거
        recentClickedList.remove(String.valueOf(clickedSalesBoardId));

        // 새로운 게시물을 리스트의 맨 앞에 추가
        recentClickedList.add(0, String.valueOf(clickedSalesBoardId));

        // 10개를 초과하면 마지막 게시물 제거
        if (recentClickedList.size() > 10) {
            recentClickedList = recentClickedList.subList(0, 10);
        }

        // Redis에서 기존 리스트는 삭제(값이 누적되지 않게)
        redisTemplate.delete(recentClickedKey);

        // Redis에 업데이트된 최근 본 게시물 저장
        redisTemplate.opsForList().rightPushAll(recentClickedKey, recentClickedList);

        // TTL 설정 (옵션: 최근 본 게시물 7일간 유지)
        redisTemplate.expire(recentClickedKey, Duration.ofDays(7));
    }

    // 구매확정 시 선호도 변경
    @Transactional
    public void buyPreference(Long userId, PreferenceRequest preferenceRequest) {
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
    public Map<String, Object> getRecommendations(Long userId) {
        // 사용자 선호도 가져오기
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
