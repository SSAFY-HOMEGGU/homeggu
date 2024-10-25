package com.homeggu.chat.domain.chatting.controller;


import com.homeggu.chat.domain.chatting.dto.request.ChatParticipantsRequest;
import com.homeggu.chat.domain.chatting.dto.response.ChatRoomIdResponse;
import com.homeggu.chat.domain.chatting.entity.ChatMessage;
import com.homeggu.chat.domain.chatting.entity.ChatRoom;
import com.homeggu.chat.domain.chatting.service.ChatParticipantsService;
import com.homeggu.chat.domain.chatting.service.ChatRoomService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import static org.springframework.http.HttpStatus.OK;

@RestController
@RequiredArgsConstructor
@RequestMapping("/chat")
public class ChatController {

    private final ChatRoomService chatRoomService;
    private final ChatParticipantsService chatParticipantsService;

    @Transactional
    @PostMapping("/room/{salesBoardId}")
    public ResponseEntity<ChatRoomIdResponse> addChatRoom(@PathVariable Long salesBoardId,
                                                          @RequestBody ChatParticipantsRequest chatParticipantsRequest) {

        ChatRoom chatRoom = chatRoomService.addChatRoom(salesBoardId);

        chatParticipantsService.addChatParticipants(chatRoom, chatParticipantsRequest);
        ChatRoomIdResponse chatRoomIdResponse = new ChatRoomIdResponse(chatRoom.getChatRoomId());

        return ResponseEntity.status(OK).body(chatRoomIdResponse);
    }

}
