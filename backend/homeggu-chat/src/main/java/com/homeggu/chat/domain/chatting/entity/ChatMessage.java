package com.homeggu.chat.domain.chatting.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import lombok.Builder;
import lombok.Getter;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Getter
@Builder
@Document(collection = "chat_message")
public class ChatMessage {

    @Id
    @Column(nullable = false)
    private Long chatMessageId;

    @Column(nullable = false)
    private Long chatRoomId;

    @Column(nullable = false)
    private Long userId;

    @Column(nullable = false)
    private String message;

    @Column(nullable = false)
    private LocalDateTime createAt;

    @Column(nullable = false)
    private boolean isRead;

    @PrePersist
    public void prePersist() {
        this.createAt = LocalDateTime.now();
    }
}
