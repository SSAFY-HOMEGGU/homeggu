package com.homeggu.domain.goods.service;

import com.homeggu.global.util.jwt.JwtProvider;
import io.jsonwebtoken.Claims;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class GoodsService {

    private final JwtProvider jwtProvider;
    private final RedisTemplate redisTemplate;

    public GoodsService(JwtProvider jwtProvider, @Qualifier("redisTemplate") RedisTemplate redisTemplate) {
        this.jwtProvider = jwtProvider;
        this.redisTemplate = redisTemplate;
    }

    // 최근에 본 게시물 가져오기
    public List<String> getRecentItems(String accessToken) {
        Claims claims = jwtProvider.parseToken(accessToken);
        int userId = claims.get("userId", Integer.class);

        // Redis 키 설정
        String recentClickedKey = "recentClicked:" + userId;

        // Redis에서 최근에 본 게시물 ID 가져오기
        return redisTemplate.opsForList().range(recentClickedKey, 0, -1);
    }
}
