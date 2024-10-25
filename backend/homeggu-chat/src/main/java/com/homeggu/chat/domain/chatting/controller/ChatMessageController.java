package com.homeggu.chat.domain.chatting.controller;

import com.homeggu.chat.domain.chatting.dto.request.ChatMessageRequest;
import com.homeggu.chat.domain.chatting.dto.response.ChatMessageResponse;
import com.homeggu.chat.domain.chatting.entity.ChatMessage;
import com.homeggu.chat.domain.chatting.service.ChatMessageService;
import com.homeggu.chat.domain.chatting.service.ChatRoomService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.util.List;

import static com.homeggu.chat.global.config.RabbitMQConfig.CHAT_EXCHANGE_NAME;
import static org.springframework.http.HttpStatus.OK;


@Slf4j
@RequiredArgsConstructor
@RestController
public class ChatMessageController {

    private final RabbitTemplate rabbitTemplate;
    private final ChatMessageService chatMessageService;

    @GetMapping("chat/room/{chatRoomId}")
    public ResponseEntity<?> getMessage(@PathVariable Long chatRoomId) {
        List<ChatMessageResponse> messages = chatMessageService.getMessages(chatRoomId);
        return ResponseEntity.status(OK).body(messages);
    }

    @MessageMapping("chat.enter.{chatRoomId}")
    public void enterUser(@Payload ChatMessageRequest message, @DestinationVariable Long chatRoomId) {
        message.setTime(LocalDateTime.now());
        message.setMessage(message.getUserId() + " 채팅방 입장");
        log.debug(message.toString());
        rabbitTemplate.convertAndSend(CHAT_EXCHANGE_NAME, "room." + chatRoomId, message);
    }

    @MessageMapping("chat.message.{chatRoomId}")
    public void sendMessage(@Payload ChatMessageRequest message, @DestinationVariable Long chatRoomId) {
        message.setTime(LocalDateTime.now());
        message.setMessage(message.getMessage());
        log.debug(message.toString());
        rabbitTemplate.convertAndSend(CHAT_EXCHANGE_NAME, "room." + chatRoomId, message);
    }
}
