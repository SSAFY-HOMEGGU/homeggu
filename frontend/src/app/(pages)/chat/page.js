'use client'

import React, { useState } from 'react';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';
import ChatList from './components/ChatList';
import Chat from './components/Chat';
import ChatPage from './components/ChatPage';
import Image from 'next/image';

export default function ChatLayout() {
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [selectedSalesBoardId, setSelectedSalesBoardId] = useState(null);
  const [selectedPartnerId, setselectedPartnerId] = useState(null);

  const handleRoomSelect = (roomId, salesBoardId, userId) => {
    setSelectedRoom(roomId);
    setSelectedSalesBoardId(salesBoardId);
    setselectedPartnerId(userId);
  };

  return (
    <div className='flex flex-row gap-3'>
      {/* 채팅방 목록을 관리하는 ChatList 컴포넌트 */}
      <ChatList onSelectRoom={handleRoomSelect} />

      {/* 실제 채팅을 담당하는 Chat 컴포넌트 */}
      {selectedRoom ? (
        <ChatPage 
          roomId={selectedRoom} 
          salesBoardId={selectedSalesBoardId}
          partnerId={selectedPartnerId}
        />
      ) : (
        <div className='w-1/2 h-[86vh] border rounded-[20px] p-5 flex items-center justify-center'>
          <div className='flex flex-col items-center gap-3 text-gray-500'>
            <Image
              src='/images/chat.png'
              alt="채팅 이미지"
              width={120}
              height={120}
              quality={90}
            />
            채팅방을 선택해주세요
          </div>
        </div>
      )}
    </div>
  );
}



  