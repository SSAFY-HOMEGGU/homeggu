"use client";

import React, { useState, useEffect } from "react";
import Profile from "../components/Profile";
import Image from "next/image";
import LikeStore from "@/app/store/likeStore";
import Link from "next/link"; // Link import 추가

// 더미데이터
const DUMMY_WISHLIST = [
  {
    id: 1,
    title: "폭닥폭닥 침대",
    sellerName: "판매자명",
    price: 10000,
    registeredAt: "2024년 10월 24일",
    image: "/images/bed2.png",
    isLiked: true,
  },
  {
    id: 2,
    title: "폭닥폭닥 침대",
    sellerName: "판매자명",
    price: 10000,
    registeredAt: "2024년 10월 21일",
    image: "/images/bed2.png",
    isLiked: true,
  },
  {
    id: 3,
    title: "폭닥폭닥 침대",
    sellerName: "판매자명",
    price: 10000,
    registeredAt: "2024년 10월 16일",
    image: "/images/bed2.png",
    isLiked: true,
  },
];

// WishlistItem 컴포넌트 수정
const WishlistItem = ({ item: initialItem, onLikeToggle }) => {
  const [item, setItem] = useState(initialItem);
  const setLikedProducts = LikeStore((state) => state.setlikedProducts);

  const handleLikeClick = (e) => {
    e.preventDefault();
    e.stopPropagation();

    setLikedProducts(item.id);
    setItem((prev) => ({
      ...prev,
      isLiked: !prev.isLiked,
    }));

    if (onLikeToggle) {
      onLikeToggle(item.id);
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
              <span className="text-[#828C94] text-sm">{item.sellerName}</span>
            </div>
            <button
              onClick={handleLikeClick}
              className="flex-shrink-0 self-center"
            >
              <Image
                src={
                  item.isLiked
                    ? "/icons/activeHeart.svg"
                    : "/icons/unactiveHeart.svg"
                }
                alt="찜하기"
                width={24}
                height={24}
              />
            </button>
          </div>
          <h3 className="text-[#2F3438] text-lg font-medium mb-2">
            {item.title}
          </h3>
          <div className="flex justify-between items-center">
            <p className="text-[#828C94] text-sm mt-6">
              등록일자: {item.registeredAt}
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

export default function WishlistPage() {
  const [wishlist, setWishlist] = useState(DUMMY_WISHLIST);
  const [totalItems, setTotalItems] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const likedProducts = LikeStore((state) => state.likedProducts);

  const user = {
    nickname: "사용자닉네임",
    name: "홍길동",
    profileImage: null,
  };

  useEffect(() => {
    // API 호출 대신 더미데이터 사용
    setTotalItems(DUMMY_WISHLIST.length);
    setWishlist(DUMMY_WISHLIST);
  }, []);

  const handleLikeToggle = (productId) => {
    setWishlist((prev) => prev.filter((item) => item.id !== productId));
    setTotalItems((prev) => prev - 1);
  };

  return (
    <div>
      <Profile user={user} />

      {/* 찜한 상품 섹션 */}
      <div className="mt-8 w-full">
        <h2 className="text-[1.25rem] font-bold text-[#2F3438]">찜한 상품</h2>

        {/* 회색 밑줄 */}
        <div className="flex mt-4 relative">
          <div className="absolute bottom-0 w-full h-[0.0625rem] bg-[#C2C8CB]" />
        </div>

        {/* 총 상품 개수 */}
        <div className="flex  items-center mt-4">
          <span className="text-[#2F3438] text-base">총 {totalItems}개</span>
        </div>

        {/* 찜한 상품 리스트 */}
        <div className="mt-4">
          {isLoading ? (
            <div className="h-[280px] bg-gray-100 rounded-lg flex items-center justify-center">
              <p className="text-[#828C94]">로딩 중...</p>
            </div>
          ) : wishlist.length > 0 ? (
            <div className="border-t border-[#EAEBEF]">
              {wishlist.map((item) => (
                <WishlistItem
                  key={item.id}
                  item={item}
                  onLikeToggle={handleLikeToggle}
                />
              ))}
            </div>
          ) : (
            <div className="h-[280px] bg-gray-100 rounded-lg flex items-center justify-center">
              <p className="text-[#828C94]">찜한 상품이 없습니다.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
