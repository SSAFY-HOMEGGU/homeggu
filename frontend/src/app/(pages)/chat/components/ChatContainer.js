// // 'use client'

// // import React, { useEffect, useState } from 'react';
// // import SockJS from 'sockjs-client';
// // import { Client } from '@stomp/stompjs';

// // export default function ChatContainer({ chatRoomId }) {
// //   const [stompClient, setStompClient] = useState(null);

// //   useEffect(() => {
// //     // WebSocket 연결 설정
// //     const socket = new SockJS("http://localhost:8083/ws");
// //     const client = new Client({
// //       webSocketFactory: () => socket,
// //       debug: (str) => console.log(str),
// //       reconnectDelay: 5000,
// //     });

// //     client.onConnect = () => {
// //       console.log("웹 소켓 연결 성공");
// //       setStompClient(client);

// //       // WebSocket을 통한 구독
// //       client.subscribe(`/exchange/chat.exchange/room.${chatRoomId}`, (message) => {
// //         console.log('받은 메시지:', JSON.parse(message.body));
// //       });
// //     };

// //     client.onStompError = (frame) => {
// //       console.error("Broker reported error: " + frame.headers['message']);
// //       console.error("Additional details: " + frame.body);
// //     };

// //     // 연결 시작
// //     client.activate();
    
// //     // 컴포넌트 언마운트 시 연결 해제
// //     return () => {
// //       if (client) {
// //         client.deactivate();
// //       }
// //     };
// //   }, [chatRoomId]);

// //   return (
// //     <div className='flex flex-col h-full'>
// //       <p>WebSocket 연결 테스트 중... (콘솔을 확인해주세요)</p>
// //     </div>
// //   );
// // }

// // components/chat/ChatContainer.js
// 'use client'

// import React, { useEffect, useState } from 'react';
// import SockJS from 'sockjs-client';
// import { Client } from '@stomp/stompjs';
// import { fetchChatSend } from '@/app/api/chatApi';
// import Chat from './Chat';

// export default function ChatContainer({ chatRoomId }) {  // userId prop 추가
//   const [stompClient, setStompClient] = useState(null);
//   const [messages, setMessages] = useState([]);
//   const [newMessage, setNewMessage] = useState("");
//   const [connected, setConnected] = useState(false);
//   const userId = localStorage.getItem('userId')
//   useEffect(() => {
//     const socket = new SockJS("http://localhost:8083/ws");
//     const client = new Client({
//       webSocketFactory: () => socket,
//       debug: (str) => console.log(str),
//       reconnectDelay: 5000,
//     });

//     client.onConnect = () => {
//       console.log("웹 소켓 연결 성공");
//       setStompClient(client);
//       setConnected(true);

//       client.subscribe(`/exchange/chat.exchange/room.${chatRoomId}`, (message) => {
//         const receivedMessage = JSON.parse(message.body);
//         setMessages(prev => [...prev, receivedMessage]);
//       });
//     };

//     client.onStompError = (frame) => {
//       console.error("Broker reported error: " + frame.headers['message']);
//       console.error("Additional details: " + frame.body);
//       setConnected(false);
//     };

//     client.activate();
    
//     return () => {
//       if (client) {
//         client.deactivate();
//         setConnected(false);
//       }
//     };
//   }, [chatRoomId]);

//   const handleSendMessage = async (e) => {
//     e.preventDefault();
//     if (!newMessage.trim() || !connected) return;

//     try {
//       const messageData = {
//         chatRoomId: Number(chatRoomId), // 숫자로 변환
//         message: newMessage.trim(),
//         userId: Number(userId), // 숫자로 변환
//       };

//       await fetchChatSend(chatRoomId, messageData);
//       setNewMessage("");
//     } catch (error) {
//       console.error("메시지 전송 실패:", error);
//       alert("메시지 전송에 실패했습니다. 다시 시도해주세요.");
//     }
//   };

//   return (
//     <Chat 
//       messages={messages}
//       newMessage={newMessage}
//       setNewMessage={setNewMessage}
//       handleSendMessage={handleSendMessage}
//       connected={connected}
//     />
//   );
// }

'use client'

import React, { useEffect, useState } from 'react';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';
import Chat from './Chat';

export default function ChatContainer({ chatRoomId, userId }) {
  const [stompClient, setStompClient] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    const socket = new SockJS("http://localhost:8083/ws");
    const client = new Client({
      webSocketFactory: () => socket,
      debug: (str) => console.log(str),
      reconnectDelay: 5000,
    });

    client.onConnect = () => {
      console.log("웹 소켓 연결 성공");
      setStompClient(client);
      setConnected(true);

      client.subscribe(`/exchange/chat.exchange/room.${chatRoomId}`, (message) => {
        const receivedMessage = JSON.parse(message.body);
        setMessages(prev => [...prev, receivedMessage]);
      });
    };

    client.onStompError = (frame) => {
      console.error("Broker reported error: " + frame.headers['message']);
      console.error("Additional details: " + frame.body);
      setConnected(false);
    };

    client.activate();
    
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
      const messageData = {
        chatRoomId: Number(chatRoomId),
        userId: Number(userId),
        message: newMessage.trim()
      };

      // STOMP를 통해 메시지 전송
      stompClient.publish({
        destination: `/pub/chat.message.${chatRoomId}`,
        body: JSON.stringify(messageData)
      });

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
    />
  );
}