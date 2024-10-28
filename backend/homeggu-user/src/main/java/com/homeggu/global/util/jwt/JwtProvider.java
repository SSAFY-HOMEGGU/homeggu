package com.homeggu.global.util.jwt;

import com.homeggu.global.util.dto.JwtResponse;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.Date;
import java.util.concurrent.TimeUnit;

@Component
public class JwtProvider {
    private static final long REFRESH_TOKEN_EXPIRE_TIME = 7 * 24 * 60 * 60 * 1000L; // 7일
    private static final long ACCESS_TOKEN_EXPIRE_TIME = 6 * 60 * 60 * 1000L; // 6시간

    private final SecretKey secretKey;
    private final RedisTemplate<String, String> redisTemplate;

    public JwtProvider(@Value("${spring.jwt.secret}") String secret, RedisTemplate<String, String> redisTemplate) {
        this.secretKey = Keys.hmacShaKeyFor(Decoders.BASE64URL.decode(secret));
        this.redisTemplate = redisTemplate;
    }

    // userId가 포함된 jwt 생성 메서드
    public JwtResponse generateToken(int userId) {
        long now = System.currentTimeMillis();

        // Access Token 생성
        String accessToken = Jwts.builder()
                .claim("userId", userId)
                .issuedAt(new Date(now))
                .expiration(new Date(now + ACCESS_TOKEN_EXPIRE_TIME))
                .signWith(secretKey)
                .compact();

        // Refresh Token 생성
        String refreshToken = Jwts.builder()
                .claim("userId", userId)
                .issuedAt(new Date(now))
                .expiration(new Date(now + ACCESS_TOKEN_EXPIRE_TIME))
                .signWith(secretKey)
                .compact();

        String redisKey = "refresh_token_" + userId;
        redisTemplate.opsForValue().set(redisKey, refreshToken, REFRESH_TOKEN_EXPIRE_TIME, TimeUnit.MILLISECONDS);

        return JwtResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .build();
    }
}
