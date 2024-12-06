package com.homeggu.chat.domain.chatting.repository;

import com.homeggu.chat.domain.chatting.dto.response.ChatRoomResponse;

import java.util.List;

public interface ChatParticipantsCustomRepository {
    public List<ChatRoomResponse> getChatParticipants(Long userId);
}
