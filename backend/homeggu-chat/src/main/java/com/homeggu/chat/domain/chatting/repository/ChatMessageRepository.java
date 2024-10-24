package com.homeggu.chat.domain.chatting.repository;

import com.homeggu.chat.domain.chatting.entity.ChatMessage;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ChatMessageRepository extends MongoRepository<ChatMessage, Long> {
    
}
