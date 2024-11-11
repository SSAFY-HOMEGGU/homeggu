'use client'

import React, { useEffect, useState } from 'react'
import ChatContainer from './ChatContainer'
import ChatMessage from './ChatMessage'
import { getChatHistory } from '@/app/api/chatApi';

export default function ChatPage({ roomId }) {
  const [userId, setUserId] = useState(null);
  const [chatHistory, setChatHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedUserId = localStorage.getItem('userId');
    setUserId(storedUserId);
  }, []);

  useEffect(() => {
    const fetchChatHistory = async () => {
      try {
        setIsLoading(true);
        const data = await getChatHistory(roomId, 50);
        console.log("채팅 내역 로드:", data);
        setChatHistory(data);
        setIsLoading(false);
      } catch (error) {
        console.error("채팅 내역 로드 실패:", error);
        setIsLoading(false);
      }
    };

    if (roomId) {
      fetchChatHistory();
    }
  }, [roomId]);

  return (
    <div className='w-1/2 h-[86vh] border rounded-[20px] flex flex-col'>
       <div className="flex-1 overflow-y-auto p-4 flex flex-col pb-0"> 
          <div className="flex-1 px-4">
            {chatHistory.map((msg, index) => (
              <ChatMessage key={index} msg={msg} />
            ))}
          </div>
          {/* </div> */}
        {/* </div> */}
      
          <ChatContainer 
            chatRoomId={roomId} 
            userId={userId}
            initialMessages={chatHistory}
            isLoading={isLoading}
          />
       
      </div>
    </div>
  );
}
