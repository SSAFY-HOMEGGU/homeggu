package com.homeggu.chat.domain.chatting.service;

import com.homeggu.chat.domain.chatting.dto.request.ChatParticipantsRequest;
import com.homeggu.chat.domain.chatting.dto.response.ChatRoomResponse;
import com.homeggu.chat.domain.chatting.entity.ChatParticipants;
import com.homeggu.chat.domain.chatting.entity.ChatRoom;
import com.homeggu.chat.domain.chatting.repository.ChatParticipantsRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Transactional
@Service
@RequiredArgsConstructor
public class ChatParticipantsServiceImpl implements ChatParticipantsService {

    private final ChatParticipantsRepository chatParticipantsRepository;

    @Override
    public void addChatParticipants(ChatRoom chatRoom, ChatParticipantsRequest chatParticipantsRequest) {
        ChatParticipants sellerChatInfo = ChatParticipants.builder()
                .userId(chatParticipantsRequest.getSellerUserId())
                .chatRoom(chatRoom)
                .build();

        ChatParticipants buyerChatInfo = ChatParticipants.builder()
                .userId(chatParticipantsRequest.getBuyerUserId())
                .chatRoom(chatRoom)
                .build();

        chatParticipantsRepository.save(sellerChatInfo);
        chatParticipantsRepository.save(buyerChatInfo);
    }

    @Override
    public List<ChatRoomResponse> getChatParticipants(Long userId) {
        return chatParticipantsRepository.getChatParticipants(userId);
    }

}
