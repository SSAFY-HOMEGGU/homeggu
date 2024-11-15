package com.homeggu.gateway.filter;

import com.homeggu.gateway.jwt.JwtProvider;
import io.jsonwebtoken.Claims;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.server.ServerWebExchange;
import org.springframework.web.server.WebFilter;
import org.springframework.web.server.WebFilterChain;
import reactor.core.publisher.Mono;

import java.util.Collections;

@RequiredArgsConstructor
public class JwtFilter implements WebFilter {

    private final JwtProvider jwtProvider;

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, WebFilterChain chain) {
        // 1. 요청 헤더에서 "Authorization"을 가져옴
        String authorizationHeader = exchange.getRequest().getHeaders().getFirst("Authorization");

        // 2. 헤더가 비어 있거나 "Bearer"로 시작하지 않으면 필터 체인
        if (authorizationHeader == null || !authorizationHeader.startsWith("Bearer ")) {
            return chain.filter(exchange);
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

            // 7. userId를 custom header로 추가
            ServerWebExchange modifiedExchange = exchange.mutate()
                    .request(r -> r.header("userId", String.valueOf(userId)))
                    .build();

            // 8. userId가 추가된 헤더와 함께 다음 필터로 요청 전달
            return chain.filter(modifiedExchange);
        }

        // 9. 토큰이 유효하지 않은 경우 필터 체인 유지
        return chain.filter(exchange);
    }
}
