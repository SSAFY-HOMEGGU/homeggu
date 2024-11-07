'use client'

import React from 'react';

const ChatMessage = ({ msg }) => {
  const isCurrentUser = msg.userId === Number(localStorage.getItem('userId'));
  const messageClass = isCurrentUser ? 'bg-point1 text-white' : 'bg-white border border-gray-200';
  
  return (
    <div className={`flex items-end gap-2 ${isCurrentUser ? 'justify-end' : 'flex-row'} mb-4`}>
      {!isCurrentUser && (
        <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm bg-gray-400">
          {msg.userId}
        </div>
      )}
      <div className={`max-w-[70%] break-words ${messageClass} rounded-full px-4 py-2 shadow-sm`}>
        <div className={`${isCurrentUser ? 'text-white' : 'text-gray-800'}`}>
          {msg.message}
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;