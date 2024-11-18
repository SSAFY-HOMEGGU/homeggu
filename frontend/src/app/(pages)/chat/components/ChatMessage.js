'use client'

import React from 'react';
import PurchaseConfirmMessage from './ChatTemplate';

const ChatMessage = ({ msg, chatRoomId, onPurchaseConfirm, onPurchaseCancel }) => {
  const isCurrentUser = msg.userId === Number(localStorage.getItem('userId'));
  const messageClass = isCurrentUser ? 'bg-point1 text-white' : 'bg-white border border-gray-200';
  
  const isPurchaseConfirmMessage = msg.message.startsWith("메시지_구매확정_");
  console.log("메세지 확인",msg)
  
  return (
    <div className={`flex items-end gap-2 ${isCurrentUser ? 'justify-end' : 'flex-row'} mb-4`}>
      {!isCurrentUser && (
        <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm bg-gray-400">
          {msg.userId}
        </div>
      )}
      
      {isPurchaseConfirmMessage ? (
        <div className="max-w-[80%]">
          <PurchaseConfirmMessage 
            onConfirm={onPurchaseConfirm}
            onCancel={onPurchaseCancel}
            chatRoomId={chatRoomId}
          />
        </div>
      ) : (
        <div className={`max-w-[70%] break-words ${messageClass} rounded-[15px] px-4 py-1 shadow-sm`}>
          <div className={`${isCurrentUser ? 'text-white' : 'text-gray-800'}`}>
            {msg.message}
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatMessage;