package com.homeggu.chat.domain.chatting.repository;

import com.homeggu.chat.domain.chatting.entity.ChatParticipants;
import com.homeggu.chat.domain.chatting.entity.ChatParticipantsPK;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ChatParticipantsRepository extends JpaRepository<ChatParticipants, ChatParticipantsPK>, ChatParticipantsCustomRepository {
}
