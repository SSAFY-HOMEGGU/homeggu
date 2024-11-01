package com.homeggu.chat.domain.chatting.repository;

import com.homeggu.chat.domain.chatting.dto.response.ChatMessageResponse;
import com.homeggu.chat.domain.chatting.entity.ChatMessage;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ChatMessageRepository extends MongoRepository<ChatMessage, Long> {
    List<ChatMessageResponse> findByChatRoomId(Long chatRoomId);

    List<ChatMessageResponse> findByChatRoomId(Long chatRoomId, Pageable pageable);
}
