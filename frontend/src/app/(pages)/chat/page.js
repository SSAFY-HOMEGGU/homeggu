// ChatContainer.js
'use client'

import React, { useEffect, useState } from 'react';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';
import ChatList from './components/ChatList';
import Chat from './components/Chat';

export default function ChatContainer() {
  const [stompClient, setStompClient] = useState(null);
  const [messages, setMessages] = useState([]);
  const [chatRoomId, setChatRoomId] = useState(null);

  useEffect(() => {
    // 웹소켓 연결 설정
    const socket = new SockJS("http://localhost:8083/ws");
    const client = new Client({
      webSocketFactory: () => socket,
      debug: (str) => console.log(str), // 디버그 메시지를 확인하기 위해 추가
      reconnectDelay: 5000, // 재연결 시도 간격 (5초)
    });

    client.onConnect = () => {
      console.log("Connected to WebSocket");
      setStompClient(client);
    };

    client.onStompError = (frame) => {
      console.error("Broker reported error: " + frame.headers['message']);
      console.error("Additional details: " + frame.body);
    };

    client.activate();

    // 컴포넌트 언마운트 시 연결 해제
    return () => {
      if (client) {
        client.deactivate();
      }
    };
  }, []);

  // 채팅방 구독 함수
  const subscribeToRoom = (roomId) => {
    if (stompClient && stompClient.connected) {
      setChatRoomId(roomId);
      stompClient.subscribe(`/exchange/chat.exchange/room.${roomId}`, (messageOutput) => {
        const message = JSON.parse(messageOutput.body);
        setMessages((prevMessages) => [...prevMessages, message]);
      });

      // 서버에 채팅방 입장 메시지 전송
      stompClient.publish({
        destination: `/pub/chat.enter.${roomId}`,
        body: JSON.stringify({
          userId: "유진",
          chatRoomId: roomId,
          message: `유진님이 채팅방에 입장했습니다.`,
        }),
      });
    }
  };

  // 메시지 전송 함수
  const sendMessage = (newMessage) => {
    if (stompClient && stompClient.connected && newMessage.trim() !== "" && chatRoomId) {
      const messageData = {
        userId: "유진",
        chatRoomId: chatRoomId,
        message: newMessage,
      };

      stompClient.publish({
        destination: `/pub/chat.message.${chatRoomId}`,
        body: JSON.stringify(messageData),
      });
    }
  };

  return (
    <div className='flex flex-row gap-3'>
      {/* 채팅방 목록을 관리하는 ChatList 컴포넌트 */}
      <ChatList onSelectRoom={subscribeToRoom} />

      {/* 실제 채팅을 담당하는 Chat 컴포넌트 */}
      <Chat messages={messages} sendMessage={sendMessage} />
    </div>
  );
}
