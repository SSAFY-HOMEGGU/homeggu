package com.homeggu.chat.domain.chatting.controller;


import com.homeggu.chat.domain.chatting.service.ChatRoomService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import static org.springframework.http.HttpStatus.OK;

@RestController
@RequiredArgsConstructor
@RequestMapping("/chat")
public class ChatController {

    private final ChatRoomService chatRoomService;

    @PostMapping("/room/{salesBoardId}")
    public ResponseEntity<Long> getLikedAnalystBoard(@PathVariable Long salesBoardId) {

        Long chatRoomId = chatRoomService.addChatRoom(salesBoardId);

        return ResponseEntity.status(OK).body(chatRoomId);
    }

}
