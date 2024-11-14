"use client";

import React, { useState, useEffect } from "react";
import Profile from "../components/Profile";
import Image from "next/image";
import Link from "next/link";
import {
  fetchPayHistory,
  transferConfirm,
  transferCancel,
} from "@/app/api/payApi";

// 더미데이터
const DUMMY_PURCHASES = [
  {
    id: 1,
    title: "폭닥폭닥 침대",
    storeName: "홈스타일 가구",
    price: 10000,
    createdAt: "2024년 10월 24일",
    image: "/images/bed2.png",
    status: "PENDING",
  },
  {
    id: 2,
    title: "폭닥폭닥 침대",
    storeName: "모던하우스",
    price: 10000,
    createdAt: "2024년 10월 21일",
    image: "/images/bed2.png",
    status: "CONFIRMED",
  },
  {
    id: 3,
    title: "폭닥폭닥 침대",
    storeName: "가구마켓",
    price: 10000,
    createdAt: "2024년 10월 16일",
    image: "/images/bed2.png",
    status: "CANCELLED",
  },
];

// PurchaseItem 컴포넌트
const PurchaseItem = ({ item: initialItem, onConfirm, onCancel }) => {
  const [item, setItem] = useState(initialItem);
  const [isLoading, setIsLoading] = useState(false);

  const handleConfirmPurchase = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      setIsLoading(true);
      await transferConfirm(item.id);

      setItem((prev) => ({
        ...prev,
        status: "CONFIRMED",
      }));

      alert("구매가 확정되었습니다.");
    } catch (error) {
      console.error("구매확정 처리 실패:", error);
      alert(
        error.response?.data?.message || "구매확정 처리 중 오류가 발생했습니다."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelPurchase = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      if (!confirm("구매를 취소하시겠습니까?")) {
        return;
      }

      setIsLoading(true);
      await transferCancel(item.id);

      setItem((prev) => ({
        ...prev,
        status: "CANCELLED",
      }));

      alert("구매가 취소되었습니다.");
    } catch (error) {
      console.error("구매취소 처리 실패:", error);
      alert(
        error.response?.data?.message || "구매취소 처리 중 오류가 발생했습니다."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const renderActionButtons = () => {
    if (isLoading) {
      return <span className="text-gray-500">처리중...</span>;
    }

    switch (item.status) {
      case "PENDING":
        return (
          <div className="flex gap-2">
            <button
              onClick={handleConfirmPurchase}
              className="px-4 py-2 border border-[#35C5F0] text-[#35C5F0] rounded-lg hover:bg-[#35C5F0] hover:text-white transition-colors disabled:opacity-50"
              disabled={isLoading}
            >
              구매확정
            </button>
            <button
              onClick={handleCancelPurchase}
              className="px-4 py-2 border border-[#F77] text-[#F77] rounded-lg hover:bg-[#F77] hover:text-white transition-colors disabled:opacity-50"
              disabled={isLoading}
            >
              구매취소
            </button>
          </div>
        );
      case "CONFIRMED":
        return (
          <span className="inline-block px-4 py-2 bg-[#F5FCFF] text-[#35C5F0] font-medium rounded-lg">
            구매확정 완료
          </span>
        );
      case "CANCELLED":
        return (
          <span className="inline-block px-4 py-2 bg-[#F5F5F5] text-[#828C94] font-medium rounded-lg">
            구매취소 완료
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <Link href={`/product/${item.id}`} className="block">
      <div className="flex items-start gap-6 p-6 border-b border-[#EAEBEF] hover:bg-gray-50 transition-colors">
        <div className="w-[120px] h-[120px] relative flex-shrink-0">
          <Image
            src={item.image}
            alt={item.title}
            width={120}
            height={120}
            className="object-cover rounded-lg"
          />
        </div>

        <div className="flex-grow">
          <div className="flex justify-between items-center">
            <div className="mb-1">
              <span className="text-[#828C94] text-sm">{item.storeName}</span>
            </div>
            <div className="flex-shrink-0 self-center">
              {renderActionButtons()}
            </div>
          </div>
          <h3 className="text-[#2F3438] text-lg font-medium mb-2">
            {item.title}
          </h3>
          <div className="flex justify-between items-center">
            <p className="text-[#828C94] text-sm mt-6">
              거래일자: {item.createdAt}
            </p>
            <p className="text-[#2F3438] font-bold text-xl">
              {item.price.toLocaleString()}원
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default function PurchasePage() {
  const [purchases, setPurchases] = useState(DUMMY_PURCHASES);
  const [totalItems, setTotalItems] = useState(0);
  const [isPageLoading, setIsPageLoading] = useState(false);

  const user = {
    nickname: "사용자닉네임",
    name: "홍길동",
    profileImage: null,
  };

  useEffect(() => {
    const fetchPurchaseHistory = async () => {
      try {
        setIsPageLoading(true);
        const response = await fetchPayHistory(0, 1000);
        const purchaseItems = response.content.filter(
          (item) => item.type === "PURCHASE"
        );

        setPurchases(purchaseItems);
        setTotalItems(purchaseItems.length);
      } catch (error) {
        console.error("구매 내역 조회 실패:", error);
        setPurchases(DUMMY_PURCHASES);
        setTotalItems(DUMMY_PURCHASES.length);
      } finally {
        setIsPageLoading(false);
      }
    };

    fetchPurchaseHistory();
  }, []);

  return (
    <div>
      <Profile user={user} />

      {/* 구매내역 타이틀 */}
      <div className="mt-8 w-full">
        <h2 className="text-[1.25rem] font-bold text-[#2F3438]">구매 내역</h2>

        {/* 회색 밑줄 */}
        <div className="flex mt-4 relative">
          <div className="absolute bottom-0 w-full h-[0.0625rem] bg-[#C2C8CB]" />
        </div>

        {/* 총 상품 개수 */}
        <div className="flex justify-between items-center mt-4">
          <span className="text-[#2F3438] text-base">총 {totalItems}개</span>
        </div>

        {/* 구매 내역 리스트 */}
        <div className="mt-4">
          {isPageLoading ? (
            <div className="h-[280px] bg-gray-100 rounded-lg flex items-center justify-center">
              <p className="text-[#828C94]">로딩 중...</p>
            </div>
          ) : purchases.length > 0 ? (
            <div className="border-t border-[#EAEBEF]">
              {purchases.map((item) => (
                <PurchaseItem key={item.id} item={item} />
              ))}
            </div>
          ) : (
            <div className="h-[280px] bg-gray-100 rounded-lg flex items-center justify-center">
              <p className="text-[#828C94]">구매 내역이 없습니다.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
