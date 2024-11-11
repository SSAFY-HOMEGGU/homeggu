package com.homeggu.chat.domain.chatting.repository;

import com.homeggu.chat.domain.chatting.entity.ChatRoom;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ChatRoomRepository extends JpaRepository<ChatRoom, Long> {

}
