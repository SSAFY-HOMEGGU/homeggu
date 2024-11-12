package com.homeggu.chat.domain.chatting.entity;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@IdClass(ChatParticipantsPK.class)
@Entity
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class ChatParticipants {
    @Id
    private Long userId;

    @Id
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "chat_room_id")
    private ChatRoom chatRoom;

    @Builder
    public ChatParticipants(Long userId, ChatRoom chatRoom) {
        this.userId = userId;
        this.chatRoom = chatRoom;
    }
}