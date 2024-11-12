package com.homeggu.chat.domain.chatting.entity;


import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Getter
@Entity
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class ChatRoom {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long chatRoomId;

    private Long salesBoardId;

    private LocalDateTime createAt;

    @PrePersist
    public void prePersist() {
        this.createAt = LocalDateTime.now();
    }

    @Builder
    public ChatRoom(Long chatRoomId, Long salesBoardId, LocalDateTime createAt) {
        this.chatRoomId = chatRoomId;
        this.salesBoardId = salesBoardId;
        this.createAt = createAt;
    }

}
