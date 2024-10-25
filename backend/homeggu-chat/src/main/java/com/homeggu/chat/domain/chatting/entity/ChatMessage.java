package com.homeggu.chat.domain.chatting.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Getter
@Builder
@Document(collection = "chat_message")
public class ChatMessage {

    @Id
    @Column(nullable = false)
    private ObjectId id;

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
