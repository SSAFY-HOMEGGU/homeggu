package com.homeggu.chat.domain.chatting.service;

import com.homeggu.chat.domain.chatting.dto.request.ChatParticipantsRequest;
import com.homeggu.chat.domain.chatting.dto.response.ChatRoomResponse;
import com.homeggu.chat.domain.chatting.entity.ChatParticipants;
import com.homeggu.chat.domain.chatting.entity.ChatRoom;

import java.util.List;

public interface ChatParticipantsService {
    void addChatParticipants(ChatRoom chatRoom, ChatParticipantsRequest chatParticipantsRequest);

    List<ChatRoomResponse> getChatParticipants(Long userId);
}
