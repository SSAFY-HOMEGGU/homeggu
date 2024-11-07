'use client'

import React, { useEffect, useState } from 'react';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';
import Chat from './Chat';
import { getChatHistory, fetchChatSend } from '@/app/api/chatApi';

export default function ChatContainer({ chatRoomId, userId }) {
  const [stompClient, setStompClient] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [connected, setConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  console.log('채팅 유저 아이디',userId)
  // 채팅 내역을 불러오는 함수
  const fetchChatHistory = async () => {
    try {
      setIsLoading(true);
      const data = await getChatHistory(chatRoomId, 50);
      console.log("채팅 내역 로드:", data);


      setMessages(formattedData);
      setIsLoading(false);
    } catch (error) {
      console.error("채팅 내역 로드 실패:", error);
      setIsLoading(false);
    }
  };

  // 웹소켓 연결 및 채팅 내역 로드
  useEffect(() => {
    const connectWebSocket = () => {
      const socket = new SockJS("http://localhost:8083/ws");
      const client = new Client({
        webSocketFactory: () => socket,
        debug: (str) => console.log(str),
        reconnectDelay: 5000,
        onConnect: async () => {
          console.log("웹소켓 연결 성공");
          setStompClient(client);
          setConnected(true);
          
          // 연결 성공 후 채팅 내역 불러오기
          // await fetchChatHistory();
          
          // 새 메시지 구독
          client.subscribe(`/exchange/chat.exchange/room.${chatRoomId}`, (message) => {
            const receivedMessage = JSON.parse(message.body);
            setMessages(prev => [...prev, receivedMessage]);
            console.log('한번더')
            fetchChatHistory();
          });
          
        },
        onStompError: (frame) => {
          console.error("Broker reported error: " + frame.headers['message']);
          console.error("Additional details: " + frame.body);
          setConnected(false);
        }
      });

      client.activate();
      return client;
    };

    const client = connectWebSocket();
    
    // 컴포넌트 언마운트 시 연결 해제
    return () => {
      if (client) {
        client.deactivate();
        setConnected(false);
      }
    };
  }, [chatRoomId]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !connected || !stompClient) return;

    try {
      const formData = {
        chatRoomId: Number(chatRoomId),
        userId: Number(userId),
        message: newMessage.trim()
      };
      console.log("메시지 전송:", formData);

      if (stompClient) {
        stompClient.publish({
          destination: `/pub/chat.message.${chatRoomId}`,
          body: JSON.stringify(formData)
        });
      }

      setNewMessage("");
    } catch (error) {
      console.error("메시지 전송 실패:", error);
      alert("메시지 전송에 실패했습니다. 다시 시도해주세요.");
    }
  };

  return (
    <Chat 
      messages={messages}
      newMessage={newMessage}
      setNewMessage={setNewMessage}
      handleSendMessage={handleSendMessage}
      connected={connected}
      isLoading={isLoading}
    />
  );
}