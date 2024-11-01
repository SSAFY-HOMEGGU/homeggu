// // components/chat/Chat.js
// 'use client'

// import React, { useState } from 'react';
// import { fetchChatSend } from '@/app/api/chatApi';

// export default function Chat({ messages, sendMessage }) {
//   const [newMessage, setNewMessage] = useState("");

//   const handleSendMessage = (e) => {
//     e.preventDefault();
//     if (newMessage.trim()) {
//       sendMessage(newMessage);
//       setNewMessage("");
//     }
//   };

//   return (
//     <div className="flex flex-col h-full">
//       <div className="flex-1 overflow-y-auto p-4">
//         {messages.map((msg, index) => (
//           <div key={index} className="mb-2">
//             <strong>{msg.userId}: </strong>
//             {msg.message}
//           </div>
//         ))}
//       </div>
//       <form onSubmit={handleSendMessage} className="border-t p-4">
//         <div className="flex gap-2">
//           <input
//             type="text"
//             value={newMessage}
//             onChange={(e) => setNewMessage(e.target.value)}
//             className="flex-1 border rounded-lg px-3 py-2"
//             placeholder="메시지를 입력하세요..."
//           />
//           <button 
//             type="submit"
//             className="bg-blue-500 text-white px-4 py-2 rounded-lg"
//           >
//             전송
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// }
'use client'

import React from 'react';

export default function Chat({ 
  messages, 
  newMessage, 
  setNewMessage, 
  handleSendMessage,
  connected = true  // 연결 상태 prop 추가 (기본값 true)
}) {
  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4">
        {messages.map((msg, index) => (
          <div key={index} className="mb-2">
            <strong>{msg.userId}: </strong>
            {msg.message}
          </div>
        ))}
      </div>
      <form onSubmit={handleSendMessage} className="border-t p-4">
        <div className="flex gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className="flex-1 border rounded-lg px-3 py-2"
            placeholder="메시지를 입력하세요..."
            disabled={!connected}
          />
          <button 
            type="submit"
            className={`px-4 py-2 rounded-lg ${
              connected 
                ? 'bg-blue-500 text-white hover:bg-blue-600' 
                : 'bg-gray-400 text-gray-200 cursor-not-allowed'
            }`}
            disabled={!connected}
          >
            전송
          </button>
        </div>
      </form>
    </div>
  );
}