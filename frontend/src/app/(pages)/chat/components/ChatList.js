'use client'

import React,{ useEffect, useState } from 'react';
import { getChatList } from '@/app/api/chatApi'

export default function ChatList({ onSelectRoom }) {
  const [chatRooms, setChatRooms] = useState([]);
  

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    const fetchChatRooms = async () => {
      try {
        const data = await getChatList(userId);
        const reversedRooms = [...data].reverse();
        setChatRooms(reversedRooms);
        // setChatRooms(data);
      } catch (error) {
        console.error('채팅방 목록을 불러오는 중 에러 발생:', error);
      }
    };

    if (userId) {
      fetchChatRooms();
    }
  }, []);


  return (
    <div className='w-1/2 h-[86vh] border rounded-[20px] p-5'>
      <h1 className='font-tmoney font-bold text-point1 text-[1.3rem]'>채팅</h1>
      <div className='space-y-2 mt-4'>
        {chatRooms.map((room) => (
          // 상대 프로필로 수정
          <div 
            key={room.chatRoomId} 
            className='border rounded-lg h-[3.5rem] p-3 flex items-center justify-between cursor-pointer hover:bg-gray-50'
            onClick={() => onSelectRoom(room.chatRoomId, room.salesBoardId, room.userId)}
          >
            <div className='flex items-center space-x-3'>
              <div className='w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center'>
                {room.userId.toString().charAt(0)}
              </div>
              <div>
                {/* 상대 이름으로 수정 */}
                <div className='font-medium'>상대방 {room.userId}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
