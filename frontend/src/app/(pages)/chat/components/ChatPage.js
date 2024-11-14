

import React, { useEffect, useState } from 'react'
import ChatContainer from './ChatContainer'
import ChatMessage from './ChatMessage'
import { getChatHistory } from '@/app/api/chatApi';
import { detailSalesBoard } from '@/app/api/productApi';
import { fetchUserProfile } from '@/app/api/userApi';
import { WhiteButton } from '@/app/components/Button';
import Dropdown from '@/app/components/Dropdown';
import useProductActionStore from '@/app/store/useProductActionStore';
import useProductListStore from '@/app/store/useProductListStore';
import Link from 'next/link';

export default function ChatPage({ roomId, salesBoardId }) {
  const [userId, setUserId] = useState(null);
  const [product, setProduct] = useState(null);
  const [userName, setUserName] = useState(null);
  const updateStatus = useProductActionStore(state => state.updateStatus);
  const updateSelectedProduct = useProductListStore(state => state.updateSelectedProduct);

  // 상태 매핑
  const statusMapping = {
    'RESERVING': '예약 중',
    'SOLD': '판매 완료',
    'AVAILABLE': '판매 중'
  };

  const reverseStatusMap = Object.entries(statusMapping).reduce((acc, [key, value]) => {
    acc[value] = key;
    return acc;
  }, {});

  const dropdownOptions = Object.values(statusMapping);
  
  const handleStatusChange = async (selectedOption) => {
    const newStatus = reverseStatusMap[selectedOption];
    if (newStatus) {
      try {
        await updateStatus(product, newStatus);
        updateSelectedProduct({ status: newStatus });
        setProduct(prev => ({
          ...prev,
          status: newStatus
        }));
      } catch (error) {
        console.error('상태 업데이트 실패:', error);
      }
    }
  };

  useEffect(() => {
    const storedUserId = localStorage.getItem('userId');
    setUserId(storedUserId);
  }, []);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await fetchUserProfile();
        setUserName(data.user.username);
        console.log(data.user.username)
        // userName이 필요한 경우 여기서 설정
        // setUserName(data.name);
      } catch (error) {
        console.error("프로필 로딩 실패:", error);
      }
    };
    fetchProfile()
  },[])

  useEffect(() => {
    const fetchProductDetails = async () => {
      if (salesBoardId) {
        try {
          const data = await detailSalesBoard(salesBoardId);
          setProduct(data);
          console.log(data)
        } catch (error) {
          console.error('상품 정보 로드 실패:', error);
        }
      }
    };

    fetchProductDetails();
  }, [salesBoardId]);

  const tradeMethodMap = {
    'IN_PERSON': '직거래',
    'SHIPPING': '택배 거래'
  };

  if (!product) return <div>Loading...</div>;

  const currentStatus = statusMapping[product.status] || '판매 중';


  return (
    <div className='w-1/2 h-[86vh] border rounded-[20px] flex flex-col'>
      <div className="flex-1 overflow-y-auto p-4 flex flex-col pb-0"> 
        {/* 상단 채팅 상대방 이름 */}
        <div className="font-medium text-lg mb-1">
          {product.userId === Number(userId) ? `판매자 ${product.userId}` : userName} 
        </div>

        {/* 상품 정보 컨테이너 */}
        <div className="flex items-center justify-between p-1 rounded-lg mb-4">
        <Link href={`/product/${salesBoardId}`}>
          {/* 상품 이미지 */}
          <div className="w-16 h-16 bg-gray-200 rounded-lg flex-shrink-0">
            {/* 이미지 들어갈 자리 */}
          </div>
        </Link>

          {/* 상품 정보 */}
          <div className="flex-grow mx-4">
            <div className="font-medium">{product.title}</div>
            <div className="text-lg font-bold">{product.price.toLocaleString()}원</div>
            <div className="text-sm text-gray-500">{tradeMethodMap[product.tradeMethod]}</div>
          </div>

          {/* 버튼 */}
          <div className='self-end mb-1'>
            {product.userId === Number(userId) ? (
              <Dropdown 
                options={dropdownOptions}
                onSelect={handleStatusChange}
                selectedFont="text-point1"
                defaultValue={currentStatus}
                width = "w-[7rem]"
                borderColor = "border-point1"
                iconColor = "text-point1"
              />
            ) : (
              <WhiteButton 
                width="w-[5.5rem]" 
                height="h-[2.2rem]"
                text="text-[0.8rem]"
                rounded="rounded-[8px]"
                borderWidth="border-[0.08rem]" >
                구매하기
              </WhiteButton>
            )}
          </div>
        </div>

        {/* 구분선 */}
        <hr className="border-gray-200 mb-4" />
      
        <ChatContainer 
          chatRoomId={roomId} 
          userId={userId}
        />
      </div>
    </div>
  );
}
