package com.homeggu.chat.domain.chatting.service;

import com.homeggu.chat.domain.chatting.dto.request.ChatMessageRequest;
import com.homeggu.chat.domain.chatting.dto.response.ChatMessageResponse;
import com.homeggu.chat.domain.chatting.entity.ChatMessage;
import com.homeggu.chat.domain.chatting.repository.ChatMessageRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

import static com.homeggu.chat.global.config.RabbitMQConfig.CHAT_QUEUE_NAME;

@Slf4j
@Service
@RequiredArgsConstructor
public class ChatMessageService {

    private final ChatMessageRepository chatMessageRepository;

    public List<ChatMessageResponse> getMessages(Long chatRoomId) {
        return chatMessageRepository.findByChatRoomId(chatRoomId);
    }


    @RabbitListener(queues = CHAT_QUEUE_NAME)
    public void receive(ChatMessageRequest chatMessageRequest) {
        log.debug("received : " + chatMessageRequest.getMessage());

        ChatMessage chatMessage = ChatMessage.builder()
                .chatRoomId(chatMessageRequest.getChatRoomId())
                .userId(chatMessageRequest.getUserId())
                .message(chatMessageRequest.getMessage())
                .isRead(chatMessageRequest.isRead())
                .createAt(LocalDateTime.now())
                .build();

        chatMessageRepository.save(chatMessage);
    }
}
