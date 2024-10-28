"use client";

import { useState } from "react";
import Profile from "./components/Profile";
import React from "react";

export default function Dashboard() {
  // 임의의 user 데이터 설정
  const user = {
    nickname: "사용자닉네임",
    name: "홍길동",
    profileImage: null,
    orderCount: 3,
    salesCount: 5,
    wishlistCount: 8,
  };

  const today = new Date().toLocaleDateString("ko-KR"); // 오늘 날짜를 한국 표기법으로 표시

  // 탭 및 필터 상태 관리
  const [activeTab, setActiveTab] = useState("전체");
  const [activeFilter, setActiveFilter] = useState("최신순");

  // 상품 데이터 (임의)
  const totalItems = 15; // 총 상품 개수

  return (
    <div>
      {/* 프로필 섹션을 컴포넌트로 사용 */}
      <Profile user={user} />

      {/* 내 상품 섹션 */}
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
          내 상품
        </h2>
        {/* 탭 섹션 */}
        <div className="flex mt-4 relative mb-6" style={{ width: "65rem" }}>
          {["전체", "예약중", "판매완료"].map((tab) => (
            <button
              key={tab}
              className="flex flex-col items-center flex-grow"
              onClick={() => setActiveTab(tab)}
            >
              <span
                style={{
                  color: "var(--normalText, #2F3438)",
                  fontFamily: "'Noto Sans KR', sans-serif",
                  fontSize: "1.25rem",
                  fontWeight: "700",
                  lineHeight: "normal",
                }}
              >
                {tab}
              </span>
            </button>
          ))}
          {/* 회색 밑줄 */}
          <div
            style={{
              position: "absolute",
              bottom: "-0.5rem",
              width: "100%",
              height: "0.0625rem",
              background: "var(--GreyButtonText, #C2C8CB)",
            }}
          />
          {/* 검은 밑줄 */}
          <div
            style={{
              position: "absolute",
              bottom: "-0.5rem",
              width: `${
                activeTab === "전체"
                  ? "33.33%"
                  : activeTab === "예약중"
                  ? "33.33%"
                  : "33.33%"
              }`,
              height: "0.125rem",
              background: "var(--normalText, #2F3438)",
              left: `${
                activeTab === "전체"
                  ? "0%"
                  : activeTab === "예약중"
                  ? "33.33%"
                  : "66.66%"
              }`,
              transition: "left 0.3s ease",
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

          {/* 필터 섹션 */}
          <div className="flex space-x-4 items-center">
            {["최신순", "낮은가격순", "높은가격순"].map(
              (filter, index, array) => (
                <React.Fragment key={filter}>
                  <button
                    className="flex flex-col justify-center items-center"
                    onClick={() => setActiveFilter(filter)}
                    style={{
                      width: "5rem",
                      height: "1.75rem",
                      color:
                        activeFilter === filter
                          ? "var(--normalText, #2F3438)"
                          : "var(--subText, #828C94)",
                      fontFamily: "'Noto Sans KR', sans-serif",
                      fontSize: "1rem",
                      fontWeight: activeFilter === filter ? "bold" : "400",
                      lineHeight: "normal",
                    }}
                  >
                    {filter}
                  </button>
                  {index < array.length - 1 && (
                    <span style={{ color: "#828C94" }}>|</span>
                  )}
                </React.Fragment>
              )
            )}
          </div>
        </div>

        <div className="h-[280px] bg-gray-100 my-4">
          {/* 상품 컴포넌트가 들어갈 자리입니다 */}
        </div>
      </div>

      {/* 최근 본 상품 섹션 */}
      <div className="flex mt-4 relative" style={{ width: "65rem" }}>
        <span
          style={{
            color: "var(--normalText, #2F3438)",
            fontFamily: "'Noto Sans KR', sans-serif",
            fontSize: "1.25rem",
            fontWeight: "700",
            lineHeight: "normal",
          }}
        >
          최근 본 상품
        </span>

        {/* 회색 밑줄 */}
        <div
          style={{
            position: "absolute",
            bottom: "-1rem",
            width: "100%",
            height: "0.0625rem",
            background: "var(--GreyButtonText, #C2C8CB)",
          }}
        />
      </div>

      {/* 오늘 날짜 - 회색 밑줄 아래에 위치 */}
      <div className="flex mt-6" style={{ width: "65rem" }}>
        <span
          style={{
            color: "var(--subText, #828C94)",
            fontFamily: "'Noto Sans KR', sans-serif",
            fontSize: "1rem",
            fontWeight: "400",
            lineHeight: "normal",
          }}
        >
          {today}
        </span>
      </div>

      <div className="h-[280px] bg-gray-100 my-4">
        {/* 상품 컴포넌트가 들어갈 자리입니다 */}
      </div>
    </div>
  );
}
