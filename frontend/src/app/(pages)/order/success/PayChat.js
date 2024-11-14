"use client";

import { getChatList, createChatRoom } from "@/app/api/chatApi";
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';

export const sendSafePurchaseMessage = async (userId, salesBoardId, sellerId, message) => {
  console.log('1. sendSafePurchaseMessage 시작 - 받은 파라미터:', { userId, salesBoardId, sellerId, message });
  
  const buyerId = Number(userId);

  try {
    // 1. 채팅방 확인
    const chatList = await getChatList(buyerId);
    const existingChatRoom = chatList.find(chat => 
      chat.userId === sellerId && chat.salesBoardId === salesBoardId
    );

    let chatRoomId;

    if (existingChatRoom) {
      console.log('기존 채팅방 사용:', existingChatRoom.chatRoomId);
      chatRoomId = existingChatRoom.chatRoomId;
    } else {
      // 새 채팅방 생성
      const data = {
        sellerUserId: sellerId,
        buyerUserId: buyerId
      };
      
      const response = await createChatRoom(salesBoardId, data);
      console.log('새 채팅방 생성:', response.chatRoomId);
      chatRoomId = response.chatRoomId;
    }

    // 웹소켓 연결하여 메시지 전송
    const socket = new SockJS("http://localhost:8083/ws");
    const stompClient = new Client({
      webSocketFactory: () => socket,
      debug: (str) => console.log('STOMP:', str),
      onConnect: () => {
        console.log('웹소켓 연결 성공, 메시지 전송 시도');
        
        // 메시지 전송
        const messageData = {
          chatRoomId: Number(chatRoomId),
          userId: Number(userId),
          message: message
        };

        stompClient.publish({
          destination: `/pub/chat.message.${chatRoomId}`,
          body: JSON.stringify(messageData)
        });

        // 메시지 전송 후 연결 종료
        setTimeout(() => {
          stompClient.deactivate();
          console.log('메시지 전송 완료, 연결 종료');
        }, 1000);
      },
      onStompError: (frame) => {
        console.error('STOMP 에러:', frame.headers['message']);
        stompClient.deactivate();
      }
    });

    stompClient.activate();
    return chatRoomId; // 채팅방 ID 반환

  } catch (error) {
    console.error('채팅 처리 중 에러 발생:', error);
    return null;
  }
};