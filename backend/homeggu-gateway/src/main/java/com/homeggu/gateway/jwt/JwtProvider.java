package com.homeggu.gateway.jwt;

import com.homeggu.gateway.jwt.dto.JwtResponse;
import io.jsonwebtoken.*;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import io.jsonwebtoken.security.SecurityException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.Date;
import java.util.concurrent.TimeUnit;

@Slf4j
@Component
public class JwtProvider {
    private static final long REFRESH_TOKEN_EXPIRE_TIME = 7 * 24 * 60 * 60 * 1000L; // 7일
    private static final long ACCESS_TOKEN_EXPIRE_TIME = 2 * 60 * 60 * 1000L; // 2시간

    private final SecretKey secretKey;
    private final RedisTemplate<String, String> redisTemplate;

    // 리눅스 환경에서 발급받은 jwt key와 RedisTemplate 사용
    // redis는 환경 변수만 추가해주고, 별도의 설정 없이 사용 가능
    public JwtProvider(@Value("${spring.jwt.secret}") String secret, RedisTemplate<String, String> redisTemplate) {
        this.secretKey = Keys.hmacShaKeyFor(Decoders.BASE64URL.decode(secret));
        this.redisTemplate = redisTemplate;
    }

    // userId가 포함된 jwt 생성 메서드
    public JwtResponse generateToken(Long userId) {
        long now = System.currentTimeMillis();

        // Access Token 생성
        String accessToken = Jwts.builder()
                .claim("userId", userId)
                .setIssuedAt(new Date(now))
                .setExpiration(new Date(now + ACCESS_TOKEN_EXPIRE_TIME))
                .signWith(secretKey)
                .compact();

        // Refresh Token 생성
        String refreshToken = Jwts.builder()
                .claim("userId", userId)
                .setIssuedAt(new Date(now))
                .setExpiration(new Date(now + REFRESH_TOKEN_EXPIRE_TIME))
                .signWith(secretKey)
                .compact();

        String redisKey = "refresh_token_" + userId;
        redisTemplate.opsForValue().set(redisKey, refreshToken, REFRESH_TOKEN_EXPIRE_TIME, TimeUnit.MILLISECONDS);

        return JwtResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .build();
    }

    // Access token에서 Claims (payload) 획득
    public Claims parseToken(String accessToken) {
        try {
            return Jwts.parserBuilder()
                    .setSigningKey(secretKey)
                    .build()
                    .parseClaimsJws(accessToken)
                    .getBody();
        } catch (ExpiredJwtException e) {
            return e.getClaims();
        }
    }

    // 유효성 검사
    public boolean validateToken(String token) {
        try {
            Jwts.parserBuilder()
                    .setSigningKey(secretKey)
                    .build()
                    .parseClaimsJws(token);
            return true;
        } catch (SecurityException | MalformedJwtException e) {
            log.info("Invalid JWT token", e);
        } catch (ExpiredJwtException e) {
            log.info("Expired JWT token", e);
        } catch (UnsupportedJwtException e) {
            log.info("Unsupported JWT token", e);
        } catch (IllegalArgumentException e) {
            log.info("Illegal JWT token", e);
        }
        return false;
    }
}
