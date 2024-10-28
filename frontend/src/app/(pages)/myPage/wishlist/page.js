"use client";

import React from "react";
import Profile from "../components/Profile";

export default function WishlistPage() {
  // 임의의 user 데이터 설정 (사용자 정보)
  const user = {
    nickname: "사용자닉네임",
    name: "홍길동",
    profileImage: null,
    orderCount: 3,
    salesCount: 5,
    wishlistCount: 8, // 찜한 상품 개수
  };

  return (
    <div>
      {/* Profile 컴포넌트 사용 */}
      <Profile user={user} />

      {/* 찜한 상품 섹션 */}
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
          찜한 상품
        </h2>

        {/* 회색 밑줄 */}
        <div className="flex mt-4 relative" style={{ width: "65rem" }}>
          <div
            style={{
              position: "absolute",
              bottom: "0",
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
            총 {user.wishlistCount}개
          </div>
        </div>

        {/* 220px 높이의 상품 컴포넌트를 위한 자리 */}
        <div className="h-[220px] bg-gray-100 mt-4">
          {/* 상품 컴포넌트가 들어갈 자리입니다 */}
        </div>
      </div>
    </div>
  );
}
