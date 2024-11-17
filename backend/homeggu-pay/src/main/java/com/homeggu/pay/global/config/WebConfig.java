package com.homeggu.pay.global.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")  // 모든 경로에 대해 CORS 설정
                .allowedOrigins("*")  // 모든 출처 허용
                .allowedMethods("*")  // 모든 HTTP 메서드 허용
                .allowedHeaders("*")  // 모든 헤더 허용
                .allowCredentials(true)  // 쿠키 및 인증정보 포함된 요청 허용
                .maxAge(3600);  // 프리플라이트 요청 캐시 시간 1시간
//        registry.addMapping("/**")
//                .allowedOrigins("https://k11b206.p.ssafy.io") // 허용할 출처
//                .allowedMethods("GET", "POST", "PUT", "DELETE", "PATCH") // 허용할 HTTP method
//                .allowCredentials(true) // 쿠키 인증 요청 허용
//                .maxAge(60); // Options 요청을 보내지 않는 시간
    }
}
