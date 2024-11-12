package com.homeggu.chat.domain.chatting.dto.response;

import jakarta.persistence.Column;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
public class ChatMessageResponse {
    private Long userId;
    private String message;
    private LocalDateTime createAt;
}
