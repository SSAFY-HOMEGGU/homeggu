package com.homeggu.chat.domain.chatting.service;

import com.homeggu.chat.domain.chatting.entity.ChatMessage;
import com.homeggu.chat.domain.chatting.entity.ChatRoom;
import com.homeggu.chat.domain.chatting.repository.ChatMessageRepository;
import com.homeggu.chat.domain.chatting.repository.ChatRoomRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Transactional
@Service
@RequiredArgsConstructor
public class ChatRoomServiceImpl implements ChatRoomService {

    private final ChatRoomRepository chatRoomRepository;

    @Override
    public ChatRoom addChatRoom(Long salesBoardId) {
        ChatRoom newChatRoom = ChatRoom.builder()
                .salesBoardId(salesBoardId)
                .build();

        ChatRoom savedRoom = chatRoomRepository.save(newChatRoom);

        return savedRoom;
    }

}
