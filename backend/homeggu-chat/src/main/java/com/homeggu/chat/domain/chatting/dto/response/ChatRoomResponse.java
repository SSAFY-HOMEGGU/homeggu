package com.homeggu.chat.domain.chatting.dto.response;

import com.querydsl.core.annotations.QueryProjection;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
public class ChatRoomResponse {
    private Long userId;
    private Long chatRoomId;

    @QueryProjection
    public ChatRoomResponse(Long userId, Long chatRoomId) {
        this.userId = userId;
        this.chatRoomId = chatRoomId;
    }
}
