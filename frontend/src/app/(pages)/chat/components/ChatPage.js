

// import React, { useEffect, useState } from 'react'
// import ChatContainer from './ChatContainer'
// import ChatMessage from './ChatMessage'
// import { getChatHistory } from '@/app/api/chatApi';
// import { detailSalesBoard } from '@/app/api/productApi';
// import { fetchUserProfile } from '@/app/api/userApi';
// import { WhiteButton } from '@/app/components/Button';
// import Dropdown from '@/app/components/Dropdown';
// import useProductActionStore from '@/app/store/useProductActionStore';
// import useProductListStore from '@/app/store/useProductListStore';
// import Link from 'next/link';
// import useProductStore from '@/app/store/useProductManageStore';

// export default function ChatPage({ roomId, salesBoardId }) {
//   const [userId, setUserId] = useState(null);
//   const [product, setProduct] = useState(null);
//   const [userName, setUserName] = useState(null);
//   const updateStatus = useProductActionStore(state => state.updateStatus);
//   const updateSelectedProduct = useProductListStore(state => state.updateSelectedProduct);

//   // 상태 매핑
//   const statusMapping = {
//     'RESERVING': '예약 중',
//     'SOLD': '판매 완료',
//     'AVAILABLE': '판매 중'
//   };

//   const reverseStatusMap = Object.entries(statusMapping).reduce((acc, [key, value]) => {
//     acc[value] = key;
//     return acc;
//   }, {});

//   const dropdownOptions = Object.values(statusMapping);
  
//   const handleStatusChange = async (selectedOption) => {
//     const newStatus = reverseStatusMap[selectedOption];
//     if (newStatus) {
//       try {
//         await updateStatus(product, newStatus);
//         updateSelectedProduct({ status: newStatus });
//         setProduct(prev => ({
//           ...prev,
//           status: newStatus
//         }));
//       } catch (error) {
//         console.error('상태 업데이트 실패:', error);
//       }
//     }
//   };

//   useEffect(() => {
//     const storedUserId = localStorage.getItem('userId');
//     setUserId(storedUserId);
//   }, []);

//   useEffect(() => {
//     const fetchProfile = async () => {
//       try {
//         const data = await fetchUserProfile();
//         setUserName(data.user.username);
//         console.log(data.user.username)
//         // userName이 필요한 경우 여기서 설정
//         // setUserName(data.name);
//       } catch (error) {
//         console.error("프로필 로딩 실패:", error);
//       }
//     };
//     fetchProfile()
//   },[])

//   useEffect(() => {
//     const fetchProductDetails = async () => {
//       if (salesBoardId) {
//         try {
//           const data = await detailSalesBoard(salesBoardId);
//           setProduct(data);
//           console.log(data)
//         } catch (error) {
//           console.error('상품 정보 로드 실패:', error);
//         }
//       }
//     };

//     fetchProductDetails();
//   }, [salesBoardId]);

//   const tradeMethodMap = {
//     'IN_PERSON': '직거래',
//     'SHIPPING': '택배 거래'
//   };

//   if (!product) return <div>Loading...</div>;

//   const currentStatus = statusMapping[product.status] || '판매 중';


//   return (
//     <div className='w-1/2 h-[86vh] border rounded-[20px] flex flex-col'>
//       <div className="flex-1 overflow-y-auto p-4 flex flex-col pb-0"> 
//         {/* 상단 채팅 상대방 이름 */}
//         <div className="font-medium text-lg mb-1">
//           {product.userId === Number(userId) ? `판매자 ${product.userId}` : userName} 
//         </div>

//         {/* 상품 정보 컨테이너 */}
//         <div className="flex items-center justify-between p-1 rounded-lg mb-4">
//         <Link href={`/product/${salesBoardId}`}>
//           {/* 상품 이미지 */}
//           <div className="w-16 h-16 bg-gray-200 rounded-lg flex-shrink-0">
//             {/* 이미지 들어갈 자리 */}
//           </div>
//         </Link>

//           {/* 상품 정보 */}
//           <div className="flex-grow mx-4">
//             <div className="font-medium">{product.title}</div>
//             <div className="text-lg font-bold">{product.price.toLocaleString()}원</div>
//             <div className="text-sm text-gray-500">{tradeMethodMap[product.tradeMethod]}</div>
//           </div>

//           {/* 버튼 */}
//           <div className='self-end mb-1'>
//             {product.userId === Number(userId) ? (
//               <Dropdown 
//                 options={dropdownOptions}
//                 onSelect={handleStatusChange}
//                 selectedFont="text-point1"
//                 defaultValue={currentStatus}
//                 width = "w-[7rem]"
//                 borderColor = "border-point1"
//                 iconColor = "text-point1"
//               />
//             ) : (
//               <WhiteButton 
//                 width="w-[5.5rem]" 
//                 height="h-[2.2rem]"
//                 text="text-[0.8rem]"
//                 rounded="rounded-[8px]"
//                 borderWidth="border-[0.08rem]" >
//                 구매하기
//               </WhiteButton>
//             )}
//           </div>
//         </div>

//         {/* 구분선 */}
//         <hr className="border-gray-200 mb-4" />
      
//         <ChatContainer 
//           chatRoomId={roomId} 
//           userId={userId}
//         />
//       </div>
//     </div>
//   );
// }

import React, { useEffect, useState } from 'react'
import ChatContainer from './ChatContainer'
import { getChatHistory } from '@/app/api/chatApi';
import { fetchUserProfile } from '@/app/api/userApi';
import { WhiteButton } from '@/app/components/Button';
import Dropdown from '@/app/components/Dropdown';
import useProductStore from '@/app/store/useProductManageStore';
import Link from 'next/link';
import Image from 'next/image';
import usePurchaseStore from '@/app/store/usePurchaseStore'
import { useRouter } from 'next/navigation';

export default function ChatPage({ roomId, salesBoardId, partnerId  }) {
  const router = useRouter()
  const [userId, setUserId] = useState(null);
  const [userName, setUserName] = useState(null);
  const { setSelectedProduct, loading: purchaseLoading } = usePurchaseStore();

  console.log('상대',partnerId )
  // 새로운 ProductStore에서 필요한 상태와 액션들을 가져옴
  const { 
    selectedProduct: product,
    fetchProduct,
    updateProductStatus,
    loading
  } = useProductStore();

  // 상태 매핑
  const statusMapping = {
    'RESERVING': '예약중',
    'SOLD': '판매완료',
    'AVAILABLE': '판매중'
  };

  const reverseStatusMap = Object.entries(statusMapping).reduce((acc, [key, value]) => {
    acc[value] = key;
    return acc;
  }, {});

  const dropdownOptions = Object.values(statusMapping);
  
   // 판매자용 상태 변경 핸들러
   const handleStatusChange = async (selectedOption) => {
    if (selectedOption === '삭제하기') {
      setShowDeleteModal(true);
      return;
    }

    const newStatus = reverseStatusMap[selectedOption];
    if (!newStatus || newStatus === product.isSell) return;
    
    console.log('상태 변경 시도:', {
      현재: product.isSell,
      선택: selectedOption,
      변경: newStatus
    });

    await updateProductStatus(product, newStatus);
  };

  // 구매자용 구매하기 핸들러
  const handlePurchase = async () => {
    try {
      setSelectedProduct(product);
      router.push('/order');
    } catch (error) {
      console.error('구매 실패:', error);
      setSelectedProduct(null);
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
      } catch (error) {
        console.error("프로필 로딩 실패:", error);
      }
    };
    fetchProfile();
  }, []);

  useEffect(() => {
    if (salesBoardId) {
      fetchProduct(salesBoardId);
    }
  }, [salesBoardId, fetchProduct]);

  const tradeMethodMap = {
    'IN_PERSON': '직거래',
    'SHIPPING': '택배 거래'
  };

  if (loading || !product) return <div>Loading...</div>;

  const currentStatus = statusMapping[product.isSell] || '판매중';

  return (
    <div className='w-1/2 h-[86vh] border rounded-[20px] flex flex-col'>
      <div className="flex-1 overflow-y-auto p-4 flex flex-col pb-0"> 
        <div className="font-medium text-lg mb-1">
          상대방 {partnerId}
          {/* {product.userId === Number(userId) ?  userName :`판매자 ${product.userId}` }  */}
        </div>

        <div className="flex items-center justify-between p-1 rounded-lg mb-4">
          <Link href={`/product/${salesBoardId}`}>
            <div className="w-16 h-16 bg-gray-200 rounded-lg flex-shrink-0">
              <Image
                src={product.goodsImagePaths?.[0]}
                alt='상품 이미지'
                width={100}
                height={100}
                className='rounded-lg'
              />
            </div>
          </Link>

          <div className="flex-grow mx-4">
            <div className="font-medium">{product.title}</div>
            <div className="text-lg font-bold">{product.price.toLocaleString()}원</div>
            <div className="text-sm text-gray-500">{tradeMethodMap[product.tradeMethod]}</div>
          </div>

          <div className='self-end mb-1'>
            {product.userId === Number(userId) ? (
              <Dropdown 
                options={dropdownOptions}
                onSelect={handleStatusChange}
                selectedFont="text-point1"
                defaultValue={currentStatus}
                width="w-[7rem]"
                borderColor="border-point1"
                iconColor="text-point1"
              />
            ) : (
              <WhiteButton 
                width="w-[5.5rem]" 
                height="h-[2.2rem]"
                text="text-[0.8rem]"
                rounded="rounded-[8px]"
                borderWidth="border-[0.08rem]"
                onClick={handlePurchase}>
                구매하기
              </WhiteButton>
            )}
          </div>
        </div>

        <hr className="border-gray-200 mb-4" />
      
        <ChatContainer 
          chatRoomId={roomId} 
          userId={userId}
        />
      </div>
    </div>
  );
}