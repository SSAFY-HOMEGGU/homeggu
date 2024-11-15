// 'use client'

// import React, { useState } from 'react'
// import Image from 'next/image'
// import { useRouter } from 'next/navigation'
// import { BlueButton, WhiteButton } from '@/app/components/Button'
// import useProductActionStore from '@/app/store/useProductActionStore'
// import usePurchaseStore from '@/app/store/usePurchaseStore'
// import ChatModal from '@/app/(pages)/chat/components/ChatModal'
// import { createChatRoom, getChatList } from '@/app/api/chatApi'
// import { preferenceUpdate } from '@/app/api/userApi'


// function BuyerActions({ product,onLikeChange, onChatCreate }) {
//   const router = useRouter();
//   const [isChatModalOpen, setIsChatModalOpen] = useState(false);
//   const [chatRoomId, setChatRoomId] = useState();
  
//   const { toggleLike } = useProductActionStore();
//   const { setSelectedProduct, loading: purchaseLoading } = usePurchaseStore();
//   const userId = localStorage.getItem('userId')
//   const productId = product.salesBoardId
  
//   const MOOD_KOREAN = {
//     'WOOD_VINTAGE': '우드 & 빈티지',
//     'BLACK_METALLIC': '블랙 & 메탈릭',
//     'WHITE_MINIMAL': '화이트 & 미니멀',
//     'MODERN_CLASSIC': '모던 & 클래식'
//   };

//   // 채팅방 존재 여부 확인 및 생성
//   const handleChatClick = async (e) => {
//     e.preventDefault();
//     const sellerId = Number(product.userId);
//     const buyerId = Number(userId);
    
//     try {
//       // 1. 먼저 기존 채팅방 목록을 가져옴
//       const chatList = await getChatList(buyerId);
      
//       // 2. 현재 상품과 판매자에 대한 채팅방이 있는지 확인
//       const existingChatRoom = chatList.find(chat => 
//         chat.userId === sellerId && chat.salesBoardId === productId
//       );

//       if (existingChatRoom) {
//         // 기존 채팅방이 있으면 그 채팅방 사용
//         console.log('기존 채팅방 사용:', existingChatRoom.chatRoomId);
//         setChatRoomId(existingChatRoom.chatRoomId);
//       } else {
//         // 없으면 새로 생성
//         const data = {
//           sellerUserId: sellerId,
//           buyerUserId: buyerId
//         };
        
//         const response = await createChatRoom(productId, data);
//         console.log('새 채팅방 생성:', response.chatRoomId);
//         setChatRoomId(response.chatRoomId);
//         onChatCreate();
//       }
      
//       await preferenceUpdate({
//         category: product.category,
//         mood: MOOD_KOREAN[product.mood],
//         action: "chat",
//         clickedSalesBoardId: ""
//       });

//       // 채팅 모달 열기
//       setIsChatModalOpen(true);
//     } catch (error) {
//       console.error('채팅방 처리 중 에러 발생:', error);
//     }
//   };

//   const handleLikeClick = async (e) => {
//     e.preventDefault();
//     // console.log('좋아요 클릭:', productId);
//     // await toggleLike(productId);
//     try {
//       await toggleLike(productId);
//       if (!product.isLiked) {
//         onLikeChange();
//       }
//     } catch (error) {
//       console.error('좋아요 처리 실패:', error);
//     }
//   };

//   const handlePurchase = async () => {
//     try {
//       // await purchaseProduct(productId);
//       setSelectedProduct(product)
//       router.push('/order')
//     } catch (error) {
//       console.error('구매 실패:', error);
//       setSelectedProduct(null)
//     }
//   };

//   return (
//     <div className="flex flex-row items-center gap-4 mt-4">
//       <div onClick={handleLikeClick} className="cursor-pointer">
//         <Image
//           src={product.isLiked ? '/icons/activeHeart.svg' : '/icons/unactiveHeart.svg'}
//           alt="Heart Icon"
//           width={24}
//           height={24}
//         />
//       </div>
//       <WhiteButton onClick={handleChatClick}>채팅하기</WhiteButton>
//       <ChatModal 
//         isOpen={isChatModalOpen}
//         onClose={() => setIsChatModalOpen(false)}
//         productId={productId}
//         chatRoomId={chatRoomId}
//         userId={userId}
//       />
//       <BlueButton 
//         onClick={handlePurchase}
//         disabled={purchaseLoading}
//       >
//         {purchaseLoading ? '처리중...' : '구매하기'}
//       </BlueButton>
//     </div>
//   )
// }

// export default BuyerActions

'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { BlueButton, WhiteButton } from '@/app/components/Button';
import useProductStore from '@/app/store/useProductManageStore';
import ChatModal from '@/app/(pages)/chat/components/ChatModal';
import { createChatRoom, getChatList } from '@/app/api/chatApi';
import { preferenceUpdate } from '@/app/api/userApi';
import usePurchaseStore from '@/app/store/usePurchaseStore'

function BuyerActions({ product, onLikeChange, onChatCreate }) {
  const router = useRouter();
  const [isChatModalOpen, setIsChatModalOpen] = useState(false);
  const [chatRoomId, setChatRoomId] = useState();
  const { setSelectedProduct, loading: purchaseLoading } = usePurchaseStore();

  const {
    toggleLike, // 좋아요 상태 관리
    fetchProduct, // 상품 상세 정보 가져오기
  } = useProductStore();
  const userId = localStorage.getItem('userId');
  const productId = product.salesBoardId;

  const MOOD_KOREAN = {
    WOOD_VINTAGE: '우드 & 빈티지',
    BLACK_METALLIC: '블랙 & 메탈릭',
    WHITE_MINIMAL: '화이트 & 미니멀',
    MODERN_CLASSIC: '모던 & 클래식',
  };

  // 채팅방 존재 여부 확인 및 생성
  const handleChatClick = async (e) => {
    e.preventDefault();
    const sellerId = Number(product.userId);
    const buyerId = Number(userId);

    try {
      // 1. 먼저 기존 채팅방 목록을 가져옴
      const chatList = await getChatList(buyerId);

      // 2. 현재 상품과 판매자에 대한 채팅방이 있는지 확인
      const existingChatRoom = chatList.find(
        (chat) => chat.userId === sellerId && chat.salesBoardId === productId
      );

      if (existingChatRoom) {
        // 기존 채팅방이 있으면 그 채팅방 사용
        console.log('기존 채팅방 사용:', existingChatRoom.chatRoomId);
        setChatRoomId(existingChatRoom.chatRoomId);
      } else {
        // 없으면 새로 생성
        const data = {
          sellerUserId: sellerId,
          buyerUserId: buyerId,
        };

        const response = await createChatRoom(productId, data);
        console.log('새 채팅방 생성:', response.chatRoomId);
        setChatRoomId(response.chatRoomId);
        onChatCreate();
      }

      await preferenceUpdate({
        category: product.category,
        mood: MOOD_KOREAN[product.mood],
        action: 'chat',
        clickedSalesBoardId: '',
      });

      // 채팅 모달 열기
      setIsChatModalOpen(true);
    } catch (error) {
      console.error('채팅방 처리 중 에러 발생:', error);
    }
  };

  const handleLikeClick = async (e) => {
    e.preventDefault();
    try {
      await toggleLike(productId);
      if (!product.isLiked) {
        onLikeChange();
      }
    } catch (error) {
      console.error('좋아요 처리 실패:', error);
    }
  };

  const handlePurchase = async () => {
    try {
      // await purchaseProduct(productId);
      setSelectedProduct(product)
      router.push('/order')
    } catch (error) {
      console.error('구매 실패:', error);
      setSelectedProduct(null)
    }
  }
  // const handlePurchase = async () => {
  //   try {
  //     // 상태 관리에 상품 저장
  //     setSelectedProduct(product);
  //     console.log('선택된 상품 저장 완료:', product);

  //     // 구매 후 성공 페이지로 이동
  //     router.push('/order');
  //   } catch (error) {
  //     console.error('구매 실패:', error);
  //   }
  // };


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
        productId={productId}
        chatRoomId={chatRoomId}
        userId={userId}
      />
      <BlueButton onClick={handlePurchase}>
        구매하기
      </BlueButton>
    </div>
  );
}

export default BuyerActions;
