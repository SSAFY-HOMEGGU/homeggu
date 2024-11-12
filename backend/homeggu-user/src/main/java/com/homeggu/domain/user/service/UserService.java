package com.homeggu.domain.user.service;

import com.google.gson.Gson;
import com.homeggu.domain.user.dto.response.KakaoLoginResponse;
import com.homeggu.domain.user.dto.response.KakaoUserResponse;
import com.homeggu.domain.user.entity.User;
import com.homeggu.domain.user.repository.UserRepository;
import com.homeggu.domain.userProfile.entity.UserProfile;
import com.homeggu.domain.userProfile.repository.UserProfileRepository;
import com.homeggu.global.util.dto.JwtResponse;
import com.homeggu.global.util.jwt.JwtProvider;
import io.jsonwebtoken.Claims;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;

import java.util.Map;
import java.util.Random;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final UserProfileRepository userProfileRepository;
    private final JwtProvider jwtProvider;
    private final RedisTemplate<String, String> redisTemplate;

    @Value("${spring.security.oauth2.client.registration.kakao.client-id}")
    private String kakaoClientId;

    @Value("${spring.security.oauth2.client.registration.kakao.client-secret}")
    private String kakaoClientSecret;

    @Value("${spring.security.oauth2.client.registration.kakao.redirect-uri}")
    private String kakaoRedirectUri;

    // 랜덤 닉네임 배열
    @Value("${random-nickname.first-names}")
    private String[] firstNicknames;

    @Value("${random-nickname.last-names}")
    private String[] lastNicknames;

    // 카카오 로그인 메서드
    public KakaoLoginResponse kakaoLogin(String code) {
        // 1. 카카오 서버로 kakao access token 발급 요청
        String kakaoAccessToken = getKakaoToken(code);

        // 2. kakao access token으로 로그인을 시도한 유저 정보 확인
        KakaoUserResponse kaKaoUserResponse = getKaKaoUser(kakaoAccessToken);
        String email = kaKaoUserResponse.getEmail();
        String username = kaKaoUserResponse.getUsername();

        // 3. 이메일로 유저를 조회하여 없으면 회원가입, 있으면 로그인
        User existedUser = userRepository.findByEmail(email).orElse(null);
        if (existedUser != null) {
            // 유저가 존재하는 userId jwt에 담아 전송
            JwtResponse jwtResponse = jwtProvider.generateToken(existedUser.getUserId());
            return KakaoLoginResponse.builder()
                    .accessToken(jwtResponse.getAccessToken())
                    .isFirstLogin(existedUser.isFirstLogin())
                    .build();
        } else {
            User newUser = User.builder().email(email).username(username).isFirstLogin(true).build();
            userRepository.save(newUser);

            // 랜덤 닉네임 생성 및 저장
            String randomNickname = generatedUniqueNickname();
            UserProfile newUserProfile = UserProfile.builder()
                    .nickname(randomNickname)
                    .user(newUser)
                    .build();
            userProfileRepository.save(newUserProfile);

            // 회원가입 후 userId jwt에 담아 전송
            JwtResponse jwtResponse = jwtProvider.generateToken(newUser.getUserId());
            return KakaoLoginResponse.builder()
                    .accessToken(jwtResponse.getAccessToken())
                    .isFirstLogin(newUser.isFirstLogin())
                    .build();
        }
    }

    // 카카오 토큰 발급 메서드
    public String getKakaoToken(String code) {
        // 1. HttpHeader 생성
        HttpHeaders httpHeaders = new HttpHeaders();
        httpHeaders.add(HttpHeaders.CONTENT_TYPE, "application/x-www-form-urlencoded;charset=UTF-8");

        // 2. 요청 파라미터 생성
        MultiValueMap<String, String> form = new LinkedMultiValueMap<>();
        form.add("grant_type", "authorization_code");
        form.add("client_id", kakaoClientId);
        form.add("client_secret", kakaoClientSecret);
        form.add("redirect_uri", kakaoRedirectUri);
        form.add("code", code);

        // 3. header + body
        HttpEntity<MultiValueMap<String, String>> httpEntity = new HttpEntity<>(form, httpHeaders);

        // 4. http 요청
        RestTemplate restTemplate = new RestTemplate();
        ResponseEntity<String> response = restTemplate.exchange(
                "https://kauth.kakao.com/oauth/token",
                HttpMethod.POST,
                httpEntity,
                String.class
        );

        // 5. response에서 kakao access token 가져오기
        String responseBody = response.getBody();
        if (responseBody != null) {
            Gson gson = new Gson();
            Map<?, ?> map = gson.fromJson(responseBody, Map.class);
            return (String) map.get("access_token");
        }

        return null;
    }

    // 카카오 유저 확인 메서드
    public KakaoUserResponse getKaKaoUser(String kakaoAccessToken) {
        // 1. HttpHeader 생성
        HttpHeaders httpHeaders = new HttpHeaders();
        httpHeaders.add("Authorization", "Bearer " + kakaoAccessToken);
        httpHeaders.add("Content-type", "application/x-www-form-urlencoded;charset=utf-8");

        // 2. HttpEntity 생성
        HttpEntity<String> request = new HttpEntity<>(httpHeaders);

        // 3. RestTemplate를 이용하여 Http 요청 처리
        RestTemplate restTemplate = new RestTemplate();
        ResponseEntity<String> response = restTemplate.exchange(
                "https://kapi.kakao.com/v2/user/me",
                HttpMethod.GET,
                request,
                String.class
        );

        // 4. 카카오 서버가 반환한 사용자 정보 파싱
        String userInfo = response.getBody();
        Gson gson = new Gson();
        Map<String, Object> data = gson.fromJson(userInfo, Map.class);

        // 5. 이메일 및 닉네임 추출
        String email = extractEmail(data);
        String nickname = extractNickname(data);

        return new KakaoUserResponse(email, nickname);
    }

    // 이메일 추출 메서드
    private String extractEmail(Map<String, Object> data) {
        Map<String, Object> kakaoAccount = (Map<String, Object>) data.get("kakao_account");
        Boolean emailNeedsAgreement = (Boolean) kakaoAccount.get("email_needs_agreement");
        if (emailNeedsAgreement != null && emailNeedsAgreement) {
            return ""; // 이메일 동의를 하지 않은 경우 빈 문자열 반환
        }
        return (String) kakaoAccount.getOrDefault("email", ""); // 이메일이 존재하지 않으면 빈 문자열 반환
    }

    // 닉네임 추출 메서드
    private String extractNickname(Map<String, Object> data) {
        Map<String, Object> kakaoAccount = (Map<String, Object>) data.get("kakao_account");
        Boolean nicknameNeedsAgreement = (Boolean) kakaoAccount.get("profile_nickname_needs_agreement");
        if (nicknameNeedsAgreement != null && nicknameNeedsAgreement) {
            return ""; // 닉네임 동의를 하지 않은 경우 빈 문자열 반환
        }
        Map<String, Object> profile = (Map<String, Object>) kakaoAccount.get("profile");
        if (profile != null) {
            return (String) profile.getOrDefault("nickname", ""); // 프로필에서 닉네임 추출, 없으면 빈 문자열 반환
        }
        return ""; // 닉네임이 존재하지 않으면 빈 문자열 반환
    }

    // 랜덤 닉네임 생성 메서드
    private String generatedRandomNickname() {
        Random random = new Random();
        String firstName = firstNicknames[random.nextInt(firstNicknames.length)];
        String lastName = lastNicknames[random.nextInt(lastNicknames.length)];
        return firstName + " " + lastName;
    }

    // 랜덤 닉네임 중복체크
    private String generatedUniqueNickname() {
        String randomNickname = null;
        do {
            randomNickname = generatedRandomNickname();
        } while (userProfileRepository.existsByNickname(randomNickname));  // 중복되면 계속 생성
        return randomNickname; // 중복되지 않으면 랜덤 닉네임 return
    }

    // 카카오 로그아웃
    public boolean kakaoLogout(String accessToken) {
        try {
            // accessToken에서 userId 추출
            Claims claims = jwtProvider.parseToken(accessToken);
            int userId = claims.get("userId", Integer.class);
            String redisKey = "refresh_token_" + userId;

            // Redis에서 해당 유저의 refresh token 삭제
            redisTemplate.delete(redisKey);

            // 로그아웃 성공
            return true;
        } catch (Exception e) {
            // 로그아웃 실패
            return false;
        }
    }

    // 최초 로그인 시, 사용자 취향 반영 완료
    public boolean firstLogin(String accessToken) {
        try {
            Claims claims = jwtProvider.parseToken(accessToken);
            int userId = claims.get("userId", Integer.class);

            userRepository.updateIsFirstLogin(userId);
            return true;
        } catch (Exception e) {
            return false;
        }
    }
}
