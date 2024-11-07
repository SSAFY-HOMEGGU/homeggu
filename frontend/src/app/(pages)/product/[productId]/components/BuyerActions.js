// 'use client'

// import React,{useState} from 'react'
// import Image from 'next/image';
// import { BlueButton,WhiteButton } from '@/app/components/Button';
// import LikeStore from '@/app/store/likeStore';
// import { createChatRoom } from '@/app/api/chatApi';
// import ChatModal from '@/app/(pages)/chat/components/ChatModal';

// function BuyerActions({product}) {
//   console.log('buyer페이지')
//   const { likedProducts, setlikedProducts } = LikeStore();
//   const [isChatModalOpen, setIsChatModalOpen] = useState(false);
//   const [chatRoomId, setChatRoomId] = useState();


//   const isLiked = likedProducts.includes(product.id);
//   const userId = localStorage.getItem('userId')

//   const handleLikeClick = (e) => {
//     e.preventDefault();
//     setlikedProducts(product.id); // 좋아요 상태 변경
//   };

//    // 채팅하기 버튼 클릭 시 호출될 함수
//    const handleChatClick = async (e) => {
//     e.preventDefault();
//     console.log('판매아이디:',Number(product.sellerId))
//     const data = {
//       "sellerUserId": Number(product.sellerId), 
//       "buyerUserId": Number(userId) 
//   };
//   console.log(data)
//     try {
//       // createChatRoom API 호출하여 채팅방 생성
//       const response = await createChatRoom(product.id, data);
      
//       console.log('채팅방 생성 성공:', response);
//       setIsChatModalOpen(true);
//       // 채팅방 생성 후 이동할 경로로 리다이렉트
//       // 예를 들어 /chat/{roomId}와 같은 경로로 이동 가능
//       // window.location.href = `/chat/${response.roomId}`;
//       setChatRoomId(response.chatRoomId)
//       router.push(`/chat/${response.chatRoomId}`);
//       // await router.push(`/chat/${response.chatRoomId}`);
//     } catch (error) {
//       console.error('채팅방 생성 중 에러 발생:', error);
//     }
//   };

//   return (
//     <div className="flex flex-row items-center gap-4 mt-4">
//       <div onClick={handleLikeClick} className="cursor-pointer">
//         <Image
//           src={isLiked ? '/icons/activeHeart.svg' : '/icons/unactiveHeart.svg'}
//           alt="Heart Icon"
//           width={24} // 아이콘 크기 설정
//           height={24}
//         />
//       </div>
//       <WhiteButton onClick={handleChatClick}>채팅하기</WhiteButton>
//       <ChatModal 
//         isOpen={isChatModalOpen}
//         onClose={() => setIsChatModalOpen(false)}
//         productId={product.id}
//         chatRoomId={chatRoomId}
//         userId={userId}
//       />
//       <BlueButton>구매하기</BlueButton>
//     </div>
//   )
// }

// export default BuyerActions

// 'use client'

// import React,{useState} from 'react'
// import Image from 'next/image';
// import { BlueButton,WhiteButton } from '@/app/components/Button';
// import LikeStore from '@/app/store/likeStore';
// import { createChatRoom } from '@/app/api/chatApi';
// import ChatModal from '@/app/(pages)/chat/components/ChatModal';

// function BuyerActions({product}) {
//   console.log('buyer페이지')
//   const { likedProducts, setlikedProducts } = LikeStore();
//   const [isChatModalOpen, setIsChatModalOpen] = useState(false);
//   const [chatRoomId, setChatRoomId] = useState();


//   const isLiked = likedProducts.includes(product.id);
//   const userId = localStorage.getItem('userId')

//   const handleLikeClick = (e) => {
//     e.preventDefault();
//     setlikedProducts(product.id); // 좋아요 상태 변경
//   };

//    // 채팅하기 버튼 클릭 시 호출될 함수
//    const handleChatClick = async (e) => {
//     e.preventDefault();
//     console.log('판매아이디:',Number(product.sellerId))
//     const data = {
//       "sellerUserId": Number(product.sellerId), 
//       "buyerUserId": Number(userId) 
//   };
//   console.log(data)
//     try {
//       // createChatRoom API 호출하여 채팅방 생성
//       const response = await createChatRoom(product.id, data);
      
//       console.log('채팅방 생성 성공:', response);
//       setIsChatModalOpen(true);
//       // 채팅방 생성 후 이동할 경로로 리다이렉트
//       // 예를 들어 /chat/{roomId}와 같은 경로로 이동 가능
//       // window.location.href = `/chat/${response.roomId}`;
//       setChatRoomId(response.chatRoomId)
//       router.push(`/chat/${response.chatRoomId}`);
//       // await router.push(`/chat/${response.chatRoomId}`);
//     } catch (error) {
//       console.error('채팅방 생성 중 에러 발생:', error);
//     }
//   };

//   return (
//     <div className="flex flex-row items-center gap-4 mt-4">
//       <div onClick={handleLikeClick} className="cursor-pointer">
//         <Image
//           src={isLiked ? '/icons/activeHeart.svg' : '/icons/unactiveHeart.svg'}
//           alt="Heart Icon"
//           width={24} // 아이콘 크기 설정
//           height={24}
//         />
//       </div>
//       <WhiteButton onClick={handleChatClick}>채팅하기</WhiteButton>
//       <ChatModal 
//         isOpen={isChatModalOpen}
//         onClose={() => setIsChatModalOpen(false)}
//         productId={product.id}
//         chatRoomId={chatRoomId}
//         userId={userId}
//       />
//       <BlueButton>구매하기</BlueButton>
//     </div>
//   )
// }

// export default BuyerActions

'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { BlueButton, WhiteButton } from '@/app/components/Button'
import useProductActionStore from '@/app/store/useProductActionStore'
import usePurchaseStore from '@/app/store/usePurchaseStore'
import ChatModal from '@/app/(pages)/chat/components/ChatModal'
import { createChatRoom } from '@/app/api/chatApi'

function BuyerActions({ product }) {
  console.log('buyer페이지')
  const router = useRouter();
  const [isChatModalOpen, setIsChatModalOpen] = useState(false);
  const [chatRoomId, setChatRoomId] = useState();
  
  const { toggleLike } = useProductActionStore();
  const { purchaseProduct, loading: purchaseLoading } = usePurchaseStore();
  const userId = localStorage.getItem('userId')

  // 채팅하기 버튼 클릭 시 호출될 함수
  const handleChatClick = async (e) => {
        e.preventDefault();
        console.log('판매아이디:',Number(product.user_id))
        const data = {
          "sellerUserId": Number(product.user_id), 
          "buyerUserId": Number(userId) 
      };
      console.log(data)
        try {
          // createChatRoom API 호출하여 채팅방 생성
          const response = await createChatRoom(product.sales_board_id, data);
          
          console.log('채팅방 생성 성공:', response);
          
          // 채팅방 생성 후 이동할 경로로 리다이렉트
          // 예를 들어 /chat/{roomId}와 같은 경로로 이동 가능
          // window.location.href = `/chat/${response.roomId}`;
          setChatRoomId(response.chatRoomId)
          setIsChatModalOpen(true);
          // await router.push(`/chat/${response.chatRoomId}`);
        } catch (error) {
          console.error('채팅방 생성 중 에러 발생:', error);
        }
      };

  const handleLikeClick = async (e) => {
    e.preventDefault();
    console.log('좋아요 클릭:', product.sales_board_id);
    await toggleLike(product.sales_board_id);
  };

  const handlePurchase = async () => {
    try {
      await purchaseProduct(product.sales_board_id);
    } catch (error) {
      console.error('구매 실패:', error);
    }
  };

  return (
    <div className="flex flex-row items-center gap-4 mt-4">
      <div onClick={handleLikeClick} className="cursor-pointer">
        <Image
          src={product.isLiked ? '/icons/activeHeart.svg' : '/icons/unactiveHeart.svg'}
          alt="Heart Icon"
          width={24}
          height={24}
        />
      </div>
      <WhiteButton onClick={handleChatClick}>채팅하기</WhiteButton>
      <ChatModal 
        isOpen={isChatModalOpen}
        onClose={() => setIsChatModalOpen(false)}
        productId={product.sales_board_id}
        chatRoomId={chatRoomId}
        userId={userId}
      />
      <BlueButton 
        onClick={handlePurchase}
        disabled={purchaseLoading}
      >
        {purchaseLoading ? '처리중...' : '구매하기'}
      </BlueButton>
    </div>
  )
}

export default BuyerActions