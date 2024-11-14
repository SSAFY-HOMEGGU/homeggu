// "use client";

// import React,{useEffect,useState} from "react";
// import Link from "next/link";
// import Image from "next/image";
// import { BlueButton, WhiteButton } from "@/app/components/Button";
// import usePurchaseStore from "@/app/store/usePurchaseStore";
// import { transferMoney } from "@/app/api/payApi";
// import { sendSafePurchaseMessage } from "./PayChat";
// import { preferenceBuy } from "@/app/api/userApi";

// export default function OrderSuccessPage() {
//   const selectedProduct = usePurchaseStore(state => state.selectedProduct);
//   const { setUserData, orderInfo, userData } = usePurchaseStore();
//   const [userId, setUserId] = useState(null);
//   const [isLoading, setIsLoading] = useState(true);
//   const [product, setProduct] = useState(null);

  
  
//   // useEffect(() => {
//   //   // localStorage는 클라이언트 사이드에서만 접근
//   //   setUserId(localStorage.getItem('userId'));
//   //   setIsLoading(false);
//   // }, []);

//   // const product = {
//   //   saledBoardId : selectedProduct.salesBoardId,
//   //   isSafe:selectedProduct.isSafe,
//   //   saleuserId: selectedProduct.userId,
//   //   name: selectedProduct.title,
//   //   shippingAddress: `${userData.address} ${userData.addressDetail}`,
//   //   price: selectedProduct.price + selectedProduct.deliveryPrice, // 상품 가격 10000 + 배송비 30000
//   // };
//   useEffect(() => {
//     const initializeData = () => {
//       setUserId(localStorage.getItem('userId'));
//       if (selectedProduct && userData) {
//         console.log("현재 selectedProduct 상태:", selectedProduct);

//         setProduct({
//           saledBoardId: selectedProduct.salesBoardId,
//           isSafe: selectedProduct.isSafe,
//           saleuserId: selectedProduct.userId,
//           name: selectedProduct.title,
//           shippingAddress: `${userData.address} ${userData.addressDetail}`,
//           price: selectedProduct.price + selectedProduct.deliveryPrice,
//         });
//       }
//       setIsLoading(false);
//     };

//     initializeData();
//   }, [selectedProduct, userData]);

//   const categoryMap = {
//     "BED":"침대",
//     "DINING_TABLE":"식탁", 
//     "DESK":"책상",
//     "SOFA":"소파",
//     "CHAIR": "의자",
//     "DRESSER":"서랍",
//     "BOOKSHELF":"수납",
//     "LIGHTING" :"조명",
//     "LIGHTING":"전등",   /// 수정하기
//     "WARDROBE":"가전"
//   };
 
//   // 가구 스타일 매핑
//   const moodMap = {
//     "WOOD_VINTAGE": "우드 & 빈티지",
//     "BLACK_METALLIC" :"블랙 & 메탈릭",
//     "WHITE_MINIMAL" :"화이트 & 미니멀",
//     "MODERN_CLASSIC": "모던 & 클래식"
//   };
 

//   useEffect(() => {
//     const processTransfer = async () => {
//       try {
//         const response = await transferMoney(
//           product.saledBoardId,
//           product.saleuserId,
//           product.price,
//           product.isSafe
//         );
//         console.log('송금이 성공적으로 완료되었습니다.');

//         const preferenceData = {
//           category: categoryMap[selectedProduct.category],
//           mood: moodMap[selectedProduct.mood],
//           action: ""
//         };
        
//         await preferenceBuy(preferenceData);
//         console.log('선호도 업데이트 완료:', preferenceData);

//         console.log('유저 아이디',userId)
//         if (product.isSafe) {
//           const transferId=response.data.transferId;;
//           const message = `메시지_구매확정_${transferId}`;
//           const success = await sendSafePurchaseMessage(
//             userId,
//             product.saledBoardId,
//             product.saleuserId,
//             message
//           );
//           console.log(message)
//           if (success) {
//             console.log('안전거래 메시지가 성공적으로 전송되었습니다.');
//           }
//         }
//       } catch (error) {
//         console.error('송금 중 오류 발생:', error);
//         // setTransferError(error.message);
//       }
//     };

//     processTransfer();
//   }, [product.saledBoardId, product.saleuserId, product.price, product.isSafe, userId ]);

//   return (
//     <div className="flex flex-col items-center justify-center w-full h-screen space-y-8">
//       {/* 주문 완료 메시지 */}
//       <h1
//         className="text-center text-normalText"
//         style={{
//           width: "80rem",
//           color: "var(--normalText, #2F3438)",
//           fontFamily: "'Noto Sans KR', sans-serif",
//           fontSize: "2.5rem",
//           fontWeight: 700,
//           lineHeight: "normal",
//         }}
//       >
//         주문이 완료되었어요!
//       </h1>

//       {/* 성공 이미지 */}
//       <Image
//         src="/images/success.png"
//         alt="주문 성공"
//         width={350}
//         height={350}
//         className="mt-3"
//       />

//       {/* 주문 정보 테이블 */}
//       <div className="w-[47%] mx-auto flex flex-col items-center">
//         <div
//           className="grid grid-cols-2 mt-2 text-left w-full"
//           style={{ gridTemplateColumns: "1fr 4fr" }}
//         >
//           <div
//             className="text-xl font-medium text-normalText flex items-center justify-center p-2"
//             style={{
//               borderTop: "1px solid var(--subText, #828C94)",
//               borderBottom: "1px solid var(--subText, #828C94)",
//               background: "var(--GreyButton, #F6F8FA)",
//             }}
//           >
//             주문상품
//           </div>
//           <div
//             className="text-xl text-subText text-left flex items-center p-3"
//             style={{
//               borderBottom: "1px solid var(--subText, #828C94)",
//               borderTop: "1px solid var(--subText, #828C94)",
//             }}
//           >
//             {product.name}
//           </div>

//           <div
//             className="text-xl font-medium text-normalText flex items-center justify-center p-2"
//             style={{
//               borderBottom: "1px solid var(--subText, #828C94)",
//               background: "var(--GreyButton, #F6F8FA)",
//             }}
//           >
//             배송지
//           </div>
//           <div
//             className="text-xl text-subText text-left flex items-center p-3"
//             style={{
//               borderBottom: "1px solid var(--subText, #828C94)",
//             }}
//           >
//             {product.shippingAddress}
//           </div>

//           <div
//             className="text-xl font-medium text-normalText flex items-center justify-center p-2"
//             style={{
//               borderBottom: "1px solid var(--subText, #828C94)",
//               background: "var(--GreyButton, #F6F8FA)",
//             }}
//           >
//             결제금액
//           </div>
//           <div
//             className="text-xl text-subText text-left flex items-center p-3"
//             style={{
//               borderBottom: "1px solid var(--subText, #828C94)",
//             }}
//           >
//             {product.price.toLocaleString()}원
//           </div>
//         </div>

//         {/* 버튼들 */}
//         <div className="flex justify-between mt-8 w-full">
//           <Link href="/" passHref>
//             <BlueButton className="w-[48%] py-3">쇼핑 계속하기</BlueButton>
//           </Link>
//           <Link href="/mypage/purchase" passHref>
//             <WhiteButton className="w-[48%] py-3">구매내역 보기</WhiteButton>
//           </Link>
//         </div>
//       </div>
//     </div>
//   );
// }


"use client";

// 페이지 설정 수정
export const dynamic = 'force-dynamic';
export const revalidate = false;

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { BlueButton, WhiteButton } from "@/app/components/Button";
import usePurchaseStore from "@/app/store/usePurchaseStore";
import { transferMoney } from "@/app/api/payApi";
import { sendSafePurchaseMessage } from "./PayChat";
import { preferenceBuy } from "@/app/api/userApi";

// route segment config
export const runtime = 'edge'; // 'nodejs' (default) | 'edge'

const OrderSuccessPage = () => {
  const selectedProduct = usePurchaseStore(state => state.selectedProduct);
  const { setUserData, orderInfo, userData } = usePurchaseStore();
  const [userId, setUserId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [product, setProduct] = useState(null);

  useEffect(() => {
    const initializeData = () => {
      const storedUserId = typeof window !== 'undefined' ? localStorage.getItem('userId') : null;
      setUserId(storedUserId);
      
      if (selectedProduct && userData) {
        console.log("현재 selectedProduct 상태:", selectedProduct);
        
        setProduct({
          saledBoardId: selectedProduct.salesBoardId,
          isSafe: selectedProduct.isSafe,
          saleuserId: selectedProduct.userId,
          name: selectedProduct.title,
          shippingAddress: `${userData.address} ${userData.addressDetail}`,
          price: selectedProduct.price + selectedProduct.deliveryPrice,
        });
      }
      setIsLoading(false);
    };

    initializeData();
  }, [selectedProduct, userData]);

  const categoryMap = {
    "BED": "침대",
    "DINING_TABLE": "식탁",
    "DESK": "책상",
    "SOFA": "소파",
    "CHAIR": "의자",
    "DRESSER": "서랍",
    "BOOKSHELF": "수납",
    "LIGHTING": "조명",
    "WARDROBE": "가전"
  };

  const moodMap = {
    "WOOD_VINTAGE": "우드 & 빈티지",
    "BLACK_METALLIC": "블랙 & 메탈릭",
    "WHITE_MINIMAL": "화이트 & 미니멀",
    "MODERN_CLASSIC": "모던 & 클래식"
  };

  useEffect(() => {
    if (!userId || !product || !selectedProduct) return;

    const processTransfer = async () => {
      try {
        const response = await transferMoney(
          product.saledBoardId,
          product.saleuserId,
          product.price,
          product.isSafe
        );
        console.log('송금이 성공적으로 완료되었습니다.');

        const preferenceData = {
          category: categoryMap[selectedProduct.category],
          mood: moodMap[selectedProduct.mood],
          action: ""
        };
        
        await preferenceBuy(preferenceData);
        console.log('선호도 업데이트 완료:', preferenceData);

        if (product.isSafe) {
          const transferId = response.data.transferId;
          const message = `메시지_구매확정_${transferId}`;
          const success = await sendSafePurchaseMessage(
            userId,
            product.saledBoardId,
            product.saleuserId,
            message
          );
          if (success) {
            console.log('안전거래 메시지가 성공적으로 전송되었습니다.');
          }
        }
      } catch (error) {
        console.error('송금 중 오류 발생:', error);
      }
    };

    processTransfer();
  }, [userId, product, selectedProduct]);

  // 로딩 중이거나 필수 데이터가 없을 때 로딩 화면 표시
  if (typeof window === 'undefined' || isLoading || !product || !selectedProduct || !userData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-xl">주문 처리중...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center w-full min-h-screen space-y-8 py-8">
      <h1
        className="text-center text-normalText"
        style={{
          width: "80rem",
          color: "var(--normalText, #2F3438)",
          fontFamily: "'Noto Sans KR', sans-serif",
          fontSize: "2.5rem",
          fontWeight: 700,
          lineHeight: "normal",
        }}
      >
        주문이 완료되었어요!
      </h1>

      <Image
        src="/images/success.png"
        alt="주문 성공"
        width={350}
        height={350}
        className="mt-3"
      />

      <div className="w-[47%] mx-auto flex flex-col items-center">
        <div
          className="grid grid-cols-2 mt-2 text-left w-full"
          style={{ gridTemplateColumns: "1fr 4fr" }}
        >
          <div
            className="text-xl font-medium text-normalText flex items-center justify-center p-2"
            style={{
              borderTop: "1px solid var(--subText, #828C94)",
              borderBottom: "1px solid var(--subText, #828C94)",
              background: "var(--GreyButton, #F6F8FA)",
            }}
          >
            주문상품
          </div>
          <div
            className="text-xl text-subText text-left flex items-center p-3"
            style={{
              borderBottom: "1px solid var(--subText, #828C94)",
              borderTop: "1px solid var(--subText, #828C94)",
            }}
          >
            {product.name}
          </div>

          <div
            className="text-xl font-medium text-normalText flex items-center justify-center p-2"
            style={{
              borderBottom: "1px solid var(--subText, #828C94)",
              background: "var(--GreyButton, #F6F8FA)",
            }}
          >
            배송지
          </div>
          <div
            className="text-xl text-subText text-left flex items-center p-3"
            style={{
              borderBottom: "1px solid var(--subText, #828C94)",
            }}
          >
            {product.shippingAddress}
          </div>

          <div
            className="text-xl font-medium text-normalText flex items-center justify-center p-2"
            style={{
              borderBottom: "1px solid var(--subText, #828C94)",
              background: "var(--GreyButton, #F6F8FA)",
            }}
          >
            결제금액
          </div>
          <div
            className="text-xl text-subText text-left flex items-center p-3"
            style={{
              borderBottom: "1px solid var(--subText, #828C94)",
            }}
          >
            {product.price.toLocaleString()}원
          </div>
        </div>

        <div className="flex justify-between mt-8 w-full">
          <Link href="/" passHref>
            <BlueButton className="w-[48%] py-3">쇼핑 계속하기</BlueButton>
          </Link>
          <Link href="/mypage/purchase" passHref>
            <WhiteButton className="w-[48%] py-3">구매내역 보기</WhiteButton>
          </Link>
        </div>
      </div>
    </div>
  );
}