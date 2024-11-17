package com.homeggu.gateway.filter;

import com.homeggu.gateway.jwt.JwtProvider;
import io.jsonwebtoken.Claims;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Collections;

@RequiredArgsConstructor
public class JwtFilter extends OncePerRequestFilter {

    private final JwtProvider jwtProvider;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        // 1. 요청 헤더에서 "Authorization"을 가져옴
        String authorizationHeader = request.getHeader("Authorization");

        // 2. 헤더가 비어 있거나 "Bearer"로 시작하지 않으면 필터 체인
        if (authorizationHeader == null || !authorizationHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        // 3. "Bearer" 이후의 토큰만 추출
        String token = authorizationHeader.substring(7);

        // 4. JWT 토큰의 유효성 검사
        if (jwtProvider.validateToken(token)) {
            // 5. 유효한 경우 토큰에서 사용자 정보 추출
            Claims claims = jwtProvider.parseToken(token);
            int userId = claims.get("userId", Integer.class);

            // 6. 사용자 인증 객체 생성 후 SecurityContext에 설정
            Authentication authentication = new UsernamePasswordAuthenticationToken(userId, null, Collections.emptyList());
            SecurityContextHolder.getContext().setAuthentication(authentication);

            // 7. userId를 응답 헤더에 추가
            response.addHeader("userId", String.valueOf(userId));
        }

        // 8. 다음 필터로 요청 전달
        filterChain.doFilter(request, response);
    }
}
