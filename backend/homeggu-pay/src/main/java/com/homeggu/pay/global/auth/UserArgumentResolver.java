package com.homeggu.pay.global.auth;

import com.homeggu.pay.global.util.jwt.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.core.MethodParameter;
import org.springframework.http.HttpHeaders;
import org.springframework.stereotype.Component;
import org.springframework.web.bind.support.WebDataBinderFactory;
import org.springframework.web.context.request.NativeWebRequest;
import org.springframework.web.method.support.HandlerMethodArgumentResolver;
import org.springframework.web.method.support.ModelAndViewContainer;


@Component
@RequiredArgsConstructor
public class UserArgumentResolver implements HandlerMethodArgumentResolver {
    // 컨트롤러에서 JWT 토큰 처리 로직을 분리하고, 간단히 @AuthPrincipal 어노테이션으로 인증된 사용자의 ID를 받아올 수 있도록 해주는 리졸버
    
    private final JwtUtil jwtUtil;

    @Override
    public boolean supportsParameter(MethodParameter parameter) {
        boolean hasAuthPrincipalAnnotation = parameter.hasParameterAnnotation(AuthPrincipal.class);
        boolean hasLongType = Long.class.isAssignableFrom(parameter.getParameterType());

        // @AuthPrincipal 어노테이션이 있고, 파라미터 타입이 Long일 때만, 이 리졸버가 동작하게 함
        return hasAuthPrincipalAnnotation && hasLongType; 
    }

    @Override
    public Object resolveArgument(MethodParameter parameter, ModelAndViewContainer mavContainer, NativeWebRequest webRequest, WebDataBinderFactory binderFactory) throws Exception {
        // Authorization 헤더에서 JWT를 추출
        final String authorizationHeader = webRequest.getHeader(HttpHeaders.AUTHORIZATION);

        // JWT에서 사용자 ID를 추출해 반환
        return jwtUtil.getUserId(authorizationHeader);
    }
}
