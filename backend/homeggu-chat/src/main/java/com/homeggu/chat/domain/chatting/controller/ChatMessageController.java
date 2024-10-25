package com.homeggu.chat.domain.chatting.controller;

import com.homeggu.chat.domain.chatting.dto.request.ChatMessageRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.stereotype.Controller;

import java.time.LocalDateTime;

import static com.homeggu.chat.global.config.RabbitMQConfig.CHAT_EXCHANGE_NAME;
import static com.homeggu.chat.global.config.RabbitMQConfig.CHAT_QUEUE_NAME;


@Slf4j
@RequiredArgsConstructor
@Controller
public class ChatMessageController {

    private final RabbitTemplate rabbitTemplate;

    @MessageMapping("chat.enter.{chatRoomId}")
    public void enterUser(@Payload ChatMessageRequest message, @DestinationVariable Long chatRoomId) {
        message.setTime(LocalDateTime.now());
        message.setMessage(message.getUserId() + " 채팅방 입장");
        log.info(message.toString());
        rabbitTemplate.convertAndSend(CHAT_EXCHANGE_NAME, "room." + chatRoomId, message);
    }

    @MessageMapping("chat.message.{chatRoomId}")
    public void sendMessage(@Payload ChatMessageRequest message, @DestinationVariable String chatRoomId) {
        message.setTime(LocalDateTime.now());
        message.setMessage(message.getMessage());
        log.info(message.toString());
        rabbitTemplate.convertAndSend(CHAT_EXCHANGE_NAME, "room." + chatRoomId, message);
    }

    @RabbitListener(queues = CHAT_QUEUE_NAME)
    public void receive(ChatMessageRequest message){
        log.debug("received : " + message.getMessage());
    }
}
