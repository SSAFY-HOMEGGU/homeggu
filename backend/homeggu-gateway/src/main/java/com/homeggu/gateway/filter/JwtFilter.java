package com.homeggu.gateway.filter;

import com.homeggu.gateway.jwt.JwtProvider;
import io.jsonwebtoken.Claims;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletRequestWrapper;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.*;

@RequiredArgsConstructor
public class JwtFilter extends OncePerRequestFilter {

    private final JwtProvider jwtProvider;

    @Override
    protected void doFilterInternal(HttpServletRequest httpServletRequest, HttpServletResponse httpServletResponse, FilterChain filterChain) throws ServletException, IOException {
        // 1. 요청 헤더에서 "Authorization"을 가져옴
        String authorizationHeader = httpServletRequest.getHeader("Authorization");

        // 2. 헤더가 비어 있거나 "Bearer"로 시작하지 않으면 필터 체인
        if (authorizationHeader == null || !authorizationHeader.startsWith("Bearer ")) {
            filterChain.doFilter(httpServletRequest, httpServletResponse);
            return;
        }

        // 3. "Bearer" 이후의 토큰만 추출
        String token = authorizationHeader.substring(7);

        // 4. JWT 토큰의 유효성 검사
        if (jwtProvider.validateToken(token)) {
            // 5. 유효한 경우 토큰에서 사용자 정보 추출
            Claims claims = jwtProvider.parseToken(token);
            Long userId = claims.get("userId", Long.class);

            // 6. 사용자 인증 객체 생성 후 SecurityContext에 설정
            Authentication authentication = new UsernamePasswordAuthenticationToken(userId, null, Collections.emptyList());
            SecurityContextHolder.getContext().setAuthentication(authentication);

            // 7. header에 userid 추가해서 다음 요청으로 전송
            HttpServletRequest modifiedRequest = new HttpServletRequestWrapper(httpServletRequest) {
                private final Map<String, String> customHeaders = new HashMap<>();

                {
                    customHeaders.put("userId", String.valueOf(userId));
                }

                @Override
                public String getHeader(String name) {
                    return customHeaders.getOrDefault(name, super.getHeader(name));
                }

                @Override
                public Enumeration<String> getHeaderNames(){
                    Set<String> names = new HashSet<>(customHeaders.keySet());
                    Enumeration<String> parentHeaderNames = super.getHeaderNames();
                    while (parentHeaderNames.hasMoreElements()) {
                        names.add(parentHeaderNames.nextElement());
                    }
                    return Collections.enumeration(names);
                }
            };

            // 8. userId가 추가된 헤더와 함께 다음 필터로 요청 전달
            filterChain.doFilter(modifiedRequest, httpServletResponse);
            return;
        }

        // 9. 토큰이 유효하지 않은 경우 필터 체인 유지
        filterChain.doFilter(httpServletRequest, httpServletResponse);
    }
}
