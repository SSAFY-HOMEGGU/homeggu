package com.homeggu.domain.saledBoardLike.service;

import com.homeggu.domain.saledBoardLike.dto.response.LikeListResponse;
import com.homeggu.domain.saledBoardLike.dto.response.LikeResponse;
import com.homeggu.domain.saledBoardLike.entity.SalesBoardLike;
import com.homeggu.domain.saledBoardLike.repository.LikeRepository;
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
    public LikeResponse addLike(String accessToken, int salesBoardId) {
        Claims claims = jwtProvider.parseToken(accessToken);
        int userId = Integer.parseInt(claims.getSubject());

        User user = userRepository.findById(userId).orElse(null);

        SalesBoardLike salesBoardLike = SalesBoardLike.builder()
                .user(user)
                .salesBoardId(salesBoardId)
                .build();

        likeRepository.save(salesBoardLike);

        return LikeResponse.builder()
                .salesBoardLike(salesBoardLike)
                .isLiked(true)
                .build();
    }

    // 찜 해제
    public LikeResponse deleteLike(String accessToken, int salesBoardId) {
        Claims claims = jwtProvider.parseToken(accessToken);
        int userId = Integer.parseInt(claims.getSubject());

        User user = userRepository.findById(userId).orElse(null);

        SalesBoardLike salesBoardLike = likeRepository.findByUserAndSalesBoardId(user, salesBoardId).orElse(null);
        if (salesBoardLike != null) {
            likeRepository.delete(salesBoardLike);
            return LikeResponse.builder()
                    .salesBoardLike(salesBoardLike)
                    .isLiked(false)
                    .build();
        }

        // 만약 찜이 존재하지 않으면 예외를 던지거나 적절한 응답 처리
        throw new IllegalArgumentException("해당 찜 항목이 존재하지 않습니다.");
    }

    // 사용자가 등록한 찜 목록 조회
    public LikeListResponse getLikes(String accessToken) {
        Claims claims = jwtProvider.parseToken(accessToken);
        int userId = Integer.parseInt(claims.getSubject());

        User user = userRepository.findById(userId).orElse(null);

        List<SalesBoardLike> salesBoardLikeList = likeRepository.findByUser(user);
        return LikeListResponse.builder()
                .salesBoardLikeList(salesBoardLikeList)
                .build();
    }

    // 찜 여부 확인
    public boolean checkIsLiked(String accessToken, int salesBoardId) {
        Claims claims = jwtProvider.parseToken(accessToken);
        int userId = Integer.parseInt(claims.getSubject());

        User user = userRepository.findById(userId).orElse(null);

        return likeRepository.existsByUserAndSalesBoardId(user, salesBoardId);
    }
}
