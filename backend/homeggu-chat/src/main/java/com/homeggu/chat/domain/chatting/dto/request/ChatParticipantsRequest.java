package com.homeggu.chat.domain.chatting.dto.request;

import lombok.Builder;
import lombok.Data;
import lombok.Getter;

@Data
@Builder
public class ChatParticipantsRequest {
    private Long sellerUserId;
    private Long buyerUserId;
}
