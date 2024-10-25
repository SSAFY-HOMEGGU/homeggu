package com.homeggu.chat.domain.chatting.service;

import com.homeggu.chat.domain.chatting.dto.request.ChatParticipantsRequest;
import com.homeggu.chat.domain.chatting.entity.ChatRoom;

public interface ChatParticipantsService {
    void addChatParticipants(ChatRoom chatRoom, ChatParticipantsRequest chatParticipantsRequest);
}
