package com.homeggu.chat.domain.chatting.dto.request;

import lombok.*;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
public class ChatMessageRequest {
    private Long chatRoomId; // 방 번호
    private String userId; // 채팅을 보낸 사람
    private String message; // 메시지
    private LocalDateTime time; // 채팅 발송 시간
    private boolean isRead; // 읽기 여부

    @Builder
    public ChatMessageRequest(Long chatRoomId, String userId, String message, LocalDateTime time, boolean isRead) {
        this.chatRoomId = chatRoomId;
        this.userId = userId;
        this.message = message;
        this.time = time;
        this.isRead = isRead;
    }
}
