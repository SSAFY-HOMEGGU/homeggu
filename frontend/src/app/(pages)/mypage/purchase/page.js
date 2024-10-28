"use client";

import React from "react";
import Profile from "../components/Profile";

export default function PurchasePage() {
  // 임의의 상품 데이터 (빈 자리로 놔둠)
  const user = {
    nickname: "사용자닉네임",
    name: "홍길동",
    profileImage: null,
    orderCount: 3,
    salesCount: 5,
    wishlistCount: 8,
  };
  const totalItems = 10; // 예시로 총 10개의 구매내역이라고 가정

  return (
    <div>
      <Profile user={user} />

      {/* 구매내역 타이틀 */}
      <div className="mt-8">
        <h2
          style={{
            color: "var(--normalText, #2F3438)",
            fontFamily: "'Noto Sans KR', sans-serif",
            fontSize: "1.25rem",
            fontWeight: "700",
            lineHeight: "normal",
          }}
        >
          구매 내역
        </h2>

        {/* 회색 밑줄 */}
        <div className="flex mt-4 relative" style={{ width: "65rem" }}>
          <div
            style={{
              position: "absolute",
              bottom: "0", // 부모 요소에서 바로 아래에 위치
              width: "100%",
              height: "0.0625rem",
              background: "var(--GreyButtonText, #C2C8CB)",
            }}
          />
        </div>

        {/* 총 상품 개수 */}
        <div className="flex justify-between items-center mt-4">
          <div
            style={{
              display: "flex",
              width: "3.25rem",
              height: "1.75rem",
              flexDirection: "column",
              justifyContent: "center",
              flexShrink: 0,
              color: "var(--normalText, #2F3438)",
              fontFamily: "'Noto Sans KR', sans-serif",
              fontSize: "1rem",
              fontWeight: "400",
              lineHeight: "normal",
            }}
          >
            총 {totalItems}개
          </div>
        </div>

        {/* 280px 높이의 상품 컴포넌트를 위한 자리 */}
        <div className="h-[220px] bg-gray-100 mt-4">
          {/* 상품 컴포넌트가 들어갈 자리입니다 */}
        </div>
      </div>
    </div>
  );
}
