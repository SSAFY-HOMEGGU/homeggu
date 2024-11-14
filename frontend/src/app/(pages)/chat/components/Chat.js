'use client'

import React from 'react';
import { LuPlus } from "react-icons/lu";
import { IoSend } from "react-icons/io5";
import ChatMessage from './ChatMessage';

export default function Chat({ 
  messages, 
  newMessage, 
  setNewMessage, 
  handleSendMessage,
  connected = true,
  chatRoomId
}) {
  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4">
        {messages.map((msg, index) => (
          <ChatMessage key={index} msg={msg} chatRoomId={chatRoomId} />
        ))}
      </div>
      <form onSubmit={handleSendMessage} className="border-t p-4">
        <div className="flex flex-row items-center gap-2">
          <LuPlus className="text-[1.2rem] text-greyButtonText cursor-pointer" />
          <div className="flex-1 relative">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              className="w-full rounded-lg pl-3 pr-12 py-2 outline-none border-none bg-gray-50"
              placeholder="메시지를 입력하세요"
              disabled={!connected}
            />
            <button 
              type="submit"
              className={`absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-lg ${
                connected 
                  ? newMessage.trim() 
                    ? 'text-point2' 
                    : 'text-greyButtonText'
                  : 'text-gray-400 cursor-not-allowed'
              }`}
              disabled={!connected}
            >
              <IoSend className="text-[1.2rem]" />
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}