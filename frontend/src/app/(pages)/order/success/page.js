
"use client";


import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { BlueButton, WhiteButton } from "@/app/components/Button";
import usePurchaseStore from "@/app/store/usePurchaseStore";
import { transferMoney } from "@/app/api/payApi";
import { sendSafePurchaseMessage } from "./PayChat";
import { preferenceBuy } from "@/app/api/userApi";
import { useRouter } from "next/navigation";
import useProductStore from "@/app/store/useProductManageStore";

const OrderSuccessPage = () => {
  const router = useRouter();
  const selectedProduct = usePurchaseStore(state => state.selectedProduct);
  const { setUserData, orderInfo, userData } = usePurchaseStore();

  // Product Store
  const updateProductStatus = useProductStore(state => state.updateProductStatus);
  const fetchProducts = useProductStore(state => state.fetchProducts);

  // State
  const [userId, setUserId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [product, setProduct] = useState(null);
  const [updateError, setUpdateError] = useState(null);


  useEffect(() => {
    // 필수 데이터가 없으면 주문 페이지로 리다이렉트
    if (!selectedProduct || !userData) {
      router.push('/order');
      return;
    }

    const initializeData = () => {
      const storedUserId = localStorage?.getItem('userId') || "";
      setUserId(storedUserId);
      
      if (selectedProduct && userData) {
        setProduct({
          saledBoardId: selectedProduct.salesBoardId,
          isSafe: selectedProduct.isSafe,
          saleuserId: selectedProduct.userId,
          name: selectedProduct.title,
          shippingAddress: userData?.address && userData?.addressDetail ? 
            `${userData.address} ${userData.addressDetail}` : "",
          price: (selectedProduct.price || 0) + (selectedProduct.deliveryPrice || 0),
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

        try {
          await updateProductStatus(selectedProduct, "SOLD");
          console.log('상품 상태가 판매완료로 업데이트되었습니다.');
          
          // 상품 목록 새로고침
          await fetchProducts();
        } catch (error) {
          console.error('상품 상태 업데이트 실패:', error);
          setUpdateError('상품 상태 업데이트 중 오류가 발생했습니다.');
        }

        const preferenceData = {
          category: selectedProduct.category,
          mood: selectedProduct.mood,
          action: ""
        };
        
        await preferenceBuy(preferenceData);
        console.log('선호도 업데이트 완료:', preferenceData);

        if (product.isSafe) {
          const transferId = response.transferId;
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

export default OrderSuccessPage;