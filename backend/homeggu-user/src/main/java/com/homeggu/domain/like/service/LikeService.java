package com.homeggu.domain.like.service;

import com.homeggu.domain.like.entity.Like;
import com.homeggu.domain.like.repository.LikeRepository;
import com.homeggu.domain.user.entity.User;
import com.homeggu.domain.user.repository.UserRepository;
import com.homeggu.global.util.jwt.JwtProvider;
import io.jsonwebtoken.Claims;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class LikeService {

    private final LikeRepository likeRepository;
    private final JwtProvider jwtProvider;
    private final UserRepository userRepository;

    // 찜 등록
    public void addLike(String accessToken, int salesBoardId) {
        Claims claims = jwtProvider.parseToken(accessToken);
        int userId = Integer.parseInt(claims.getSubject());

        User user = userRepository.findById(userId).orElse(null);

        Like like = Like.builder()
                .user(user)
                .salesBoardId(salesBoardId)
                .build();

        likeRepository.save(like);
    }

    // 찜 해제
    public void deleteLike(String accessToken, int salesBoardId) {
        Claims claims = jwtProvider.parseToken(accessToken);
        int userId = Integer.parseInt(claims.getSubject());

        User user = userRepository.findById(userId).orElse(null);

        Like like = likeRepository.findByUserAndSalesBoardId(user, salesBoardId).orElse(null);
        if (like != null) {
            likeRepository.delete(like);
        }
    }

    // 사용자가 등록한 찜 목록 조회
    public List<Like> getLikes(String accessToken) {
        Claims claims = jwtProvider.parseToken(accessToken);
        int userId = Integer.parseInt(claims.getSubject());

        User user = userRepository.findById(userId).orElse(null);

        return likeRepository.findByUser(user);
    }

    // 찜 여부 확인
    public boolean checkIsLiked(String accessToken, int salesBoardId) {
        Claims claims = jwtProvider.parseToken(accessToken);
        int userId = Integer.parseInt(claims.getSubject());

        User user = userRepository.findById(userId).orElse(null);

        return likeRepository.existsByUserAndSalesBoardId(user, salesBoardId);
    }
}
