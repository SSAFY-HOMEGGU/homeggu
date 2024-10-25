package com.homeggu.chat.domain.chatting.service;

import com.homeggu.chat.domain.chatting.entity.ChatRoom;
import com.homeggu.chat.domain.chatting.repository.ChatRoomRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Transactional
@Service
@RequiredArgsConstructor
public class ChatRoomServiceImpl implements ChatRoomService {

    private final ChatRoomRepository chatRoomRepository;

    @Override
    public Long addChatRoom(Long salesBoardId) {
        ChatRoom newChatRoom = ChatRoom.builder()
                .salesBoardId(salesBoardId)
                .build();

        ChatRoom savedRoom = chatRoomRepository.save(newChatRoom);

        return savedRoom.getChatRoomId();
    }

}
