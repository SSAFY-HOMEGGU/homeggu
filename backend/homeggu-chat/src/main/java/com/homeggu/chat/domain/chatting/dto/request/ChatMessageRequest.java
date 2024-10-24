package com.homeggu.chat.domain.chatting.dto.request;

import lombok.Builder;
import lombok.Data;
import lombok.Getter;

import java.time.LocalDateTime;

@Data
@Builder
public class ChatMessageRequest {
    private Long chatRoomId; // 방 번호
    private String userId; // 채팅을 보낸 사람
    private String message; // 메시지
    private LocalDateTime time; // 채팅 발송 시간
    private boolean isRead; // 읽기 여부
}
