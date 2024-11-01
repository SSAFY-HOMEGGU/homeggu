package com.homeggu.chat.domain.chatting.repository;

import com.homeggu.chat.domain.chatting.dto.response.ChatRoomResponse;
import com.homeggu.chat.domain.chatting.dto.response.QChatRoomResponse;
import com.querydsl.jpa.impl.JPAQueryFactory;
import jakarta.persistence.EntityManager;

import java.util.List;

import static com.homeggu.chat.domain.chatting.entity.QChatParticipants.chatParticipants;

public class ChatParticipantsCustomRepositoryImpl implements ChatParticipantsCustomRepository {

    private final JPAQueryFactory queryFactory;

    public ChatParticipantsCustomRepositoryImpl(EntityManager em) {
        this.queryFactory = new JPAQueryFactory(em);
    }

    @Override
    public List<ChatRoomResponse> getChatParticipants(Long userId) {
        return queryFactory
                .select(new QChatRoomResponse(chatParticipants.userId, chatParticipants.chatRoom.chatRoomId))
                .from(chatParticipants)
                .where(chatParticipants.chatRoom.chatRoomId.in(
                        queryFactory.select(chatParticipants.chatRoom.chatRoomId)
                                .from(chatParticipants)
                                .where(chatParticipants.userId.eq(userId))
                ).and(chatParticipants.userId.ne(userId)))
                .fetch();
    }

}
