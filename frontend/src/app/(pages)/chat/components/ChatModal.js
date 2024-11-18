'use client'

import React from 'react';
import ChatContainer from './ChatContainer';
import { IoIosClose } from "react-icons/io";

export default function ChatModal({ isOpen, onClose, productId,chatRoomId, userId }) {
  if (!isOpen) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 w-[20rem]">
      <div className="bg-white rounded-lg w-full max-w-xs max-h-[80vh] overflow-auto relative shadow-lg">
        <div className='flex flex-row bg-point2 w-full h-[3.2rem] flex items-center justify-center relative'>
          <h1 className='font-tmoney font-bold text-white text-[1.3rem]'>채팅</h1>
          <button 
            onClick={onClose}
            className="absolute top-2 right-2 text-white hover:text-gray-700"
          >
            <IoIosClose className='text-white text-[1.8rem]'/>
          </button>
          
        </div>
      <div className="h-[400px]">
        <ChatContainer chatRoomId={chatRoomId} userId={userId} />
      </div>
      </div>
    </div>
  );
}