// 'use client'

// import React,{ useState, useEffect } from 'react'
// import { fetchChatList } from '@/app/api/chatApi'

// export default function ChatList() {
//   const [chatList, setChatList] = useState([]);

//   useEffect(() => {
//     fetchChatList()
//       .then(data => setChatList(data))
//       .catch(error => {
//         console.error('채팅 목록을 불러오는 중 에러 발생:', error);
//       });
//   }, []);

//   return (
//     <div className='w-1/2 h-[86vh] border rounded-[20px] p-5'>
//         <h1 className='font-tmoney font-bold text-point1 text-[1.3rem]'>채팅</h1>
//         <div className='border h-[3.5rem]'>
//           하하
//           {chatList.map((chat, index) => (
//             <div key={index}>하하</div>
//           ))}  
//         </div>
//     </div>
//   )
// }
// ChatList.js

import React from 'react';
import { getChatList } from '@/app/api/chatApi'

export default function ChatList({ onSelectRoom }) {
  const chatRooms = ["room1", "room2", "room3"]; // 예시로 하드코딩된 방 목록

  return (
    <div className='w-1/2 h-[86vh] border rounded-[20px] p-5'>
      <h1 className='font-tmoney font-bold text-point1 text-[1.3rem]'>채팅</h1>
      <ul>
        {chatRooms.map((room) => (
          <li key={room} className='border h-[3.5rem]'>
            <button onClick={() => onSelectRoom(room)}>Enter {room}</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
