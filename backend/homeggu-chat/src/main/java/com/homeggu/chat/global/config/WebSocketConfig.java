package com.homeggu.chat.global.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

@Configuration
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    @Value("${spring.rabbitmq.host}")
    private String rabbitmqHost;

    @Value("${spring.rabbitmq.port}")
    private int rabbitmqPort;

    @Value("${spring.rabbitmq.username}")
    private String rabbitmqUsername;

    @Value("${spring.rabbitmq.password}")
    private String rabbitmqPassword;

    @Override
    public void configureMessageBroker(MessageBrokerRegistry registry) {
        registry.setApplicationDestinationPrefixes("/pub") // 발행
                .enableStompBrokerRelay("/exchange") // 구독
                .setRelayHost(rabbitmqHost)
                .setRelayPort(rabbitmqPort)
                .setClientLogin(rabbitmqUsername)
                .setClientPasscode(rabbitmqPassword);
    }

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        registry.addEndpoint("/ws")
                .setAllowedOrigins("*")
                .setAllowedOriginPatterns("*")
//                .setHandshakeHandler(webSocketHandShakeHandler)
//                .addInterceptors(customHttpSessionHandshakeInterceptor())
                .withSockJS();
    }

}
