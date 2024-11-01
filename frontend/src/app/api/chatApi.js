import { chatInstance } from "./axiosInstance";

// 채팅 내용 목록
export const getChatList = (chatRoomId, recent) => {
  return chatInstance.get(`/chat/room/${chatRoomId}`, {
    params: {
      recent: recent
    }
  })
    .then(response => response.data)
    .catch(error => {
      console.error('상세 에러 정보:', error);
      throw error;
    });
};

// getChatList(chatRoomId, 10);  사용법

// 채팅방 생성
export const createChatRoom = (salesBoardId, formData) => {
  console.log('api',formData)
  return chatInstance.post(`/chat/room/${salesBoardId}`, formData)
    .then(response => response.data)
    .catch(error => {
      console.error('상세 에러 정보:', error);
      throw error;
    });
};


// 채팅방 구독
export const fetchChatSubscribe = (chatRoomId) => {
  return chatInstance.post(`/exchange/chat.exchange/room.${chatRoomId}`)
    .then(response => response.data)
    .catch(error => {
      console.error('상세 에러 정보:', error);
      throw error;
    });
};

// 채팅 보내기
export const fetchChatSend = (chatRoomId, formData) => {
  return chatInstance.post(`/pub/chat.message.${chatRoomId}`,formData)
    .then(response => response.data)
    .catch(error => {
      console.error('상세 에러 정보:', error);
      throw error;
    });
};
