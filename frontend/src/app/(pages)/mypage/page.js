"use client";

import { useState, useEffect } from "react";
import Profile from "./components/Profile";
import React from "react";
import { fetchRecentViewedItems } from "../../api/userApi";
import { salesBoardList } from "../../api/productApi";
import Product from "@/app/components/Product";
import Image from "next/image";

export default function Dashboard() {
  const user = {
    nickname: "사용자닉네임",
    name: "홍길동",
    profileImage: null,
  };

  const today = new Date().toLocaleDateString("ko-KR");
  const [activeTab, setActiveTab] = useState("전체");
  const [activeFilter, setActiveFilter] = useState("최신순");
  const [recentViewedItems, setRecentViewedItems] = useState([]);
  const [myProducts, setMyProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);

  useEffect(() => {
    // 최근 본 상품 가져오기
    fetchRecentViewedItems()
      .then((data) => {
        setRecentViewedItems(data);
      })
      .catch((error) =>
        console.error("최근 본 상품 데이터 불러오기 실패:", error)
      );

    // 내 판매 상품 목록 가져오기
    salesBoardList({})
      .then((data) => {
        const myItems = data.content || [];
        setMyProducts(myItems);
        setFilteredProducts(myItems); // 초기에는 전체 목록 설정
      })
      .catch((error) => console.error("판매 상품 목록 조회 실패:", error));
  }, []);

  // 탭 변경 시 필터링
  useEffect(() => {
    let filtered = [...myProducts];

    if (activeTab === "예약중") {
      filtered = myProducts.filter((product) => product.status === "RESERVED");
    } else if (activeTab === "판매완료") {
      filtered = myProducts.filter((product) => product.status === "SOLD_OUT");
    }

    // 정렬 적용
    if (activeFilter === "낮은가격순") {
      filtered.sort((a, b) => a.price - b.price);
    } else if (activeFilter === "높은가격순") {
      filtered.sort((a, b) => b.price - a.price);
    } else {
      // 최신순
      filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    setFilteredProducts(filtered);
  }, [activeTab, activeFilter, myProducts]);

  return (
    <>
      <Profile user={user} />

      {/* 내 상품 섹션 */}
      <div className="mt-8">
        <h2 className="text-xl font-bold text-[#2F3438]">내 상품</h2>

        {/* 탭 네비게이션 */}
        <div className="flex mt-4 relative mb-6 w-full">
          {["전체", "예약중", "판매완료"].map((tab) => (
            <button
              key={tab}
              className={`flex-1 py-2 text-lg font-bold ${
                activeTab === tab ? "text-[#2F3438]" : "text-[#C2C8CB]"
              }`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
          <div className="absolute bottom-0 w-full h-px bg-[#C2C8CB]" />
          <div
            className="absolute bottom-0 h-0.5 bg-[#2F3438] transition-all duration-300"
            style={{
              width: "33.33%",
              left: `${
                activeTab === "전체"
                  ? "0%"
                  : activeTab === "예약중"
                  ? "33.33%"
                  : "66.66%"
              }`,
            }}
          />
        </div>

        {/* 필터 및 총 개수 */}
        <div className="flex justify-between items-center mt-4">
          <span className="text-[#2F3438]">총 {filteredProducts.length}개</span>
          <div className="flex items-center">
            {["최신순", "낮은가격순", "높은가격순"].map((filter, index) => (
              <React.Fragment key={filter}>
                <button
                  onClick={() => setActiveFilter(filter)}
                  className={`px-4 ${
                    activeFilter === filter
                      ? "text-[#2F3438] font-bold"
                      : "text-[#828C94]"
                  }`}
                >
                  {filter}
                </button>
                {index < 2 && <span className="text-[#828C94]">|</span>}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* 상품 그리드 */}
        <div className="mt-4">
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-4 gap-3">
              {filteredProducts.map((product) => (
                <Product key={product.sales_board_id} product={product} />
              ))}
            </div>
          ) : (
            <div className="h-[280px] bg-gray-100 rounded-lg flex items-center justify-center">
              <p className="text-[#828C94]">등록된 상품이 없습니다.</p>
            </div>
          )}
        </div>
      </div>

      {/* 최근 본 상품 섹션 */}
      <div className="mt-8">
        <div className="relative">
          <h2 className="text-xl font-bold text-[#2F3438]">최근 본 상품</h2>
          <div className="absolute bottom-[-1rem] w-full h-px bg-[#C2C8CB]" />
        </div>

        <div className="mt-4 relative">
          {recentViewedItems.length > 0 ? (
            <div className="overflow-x-auto overflow-y-hidden">
              <div className="flex gap-6 pb-4">
                {recentViewedItems.map((item) => (
                  <div
                    key={item.salesBoardId}
                    className="flex-shrink-0 w-[200px]"
                  >
                    <div className="relative w-[200px] h-[200px] mb-2">
                    <div className="relative w-full h-full">
                      <Image
                        src={item.goodsImagePaths?.[0] || "/api/placeholder/200/200"}
                        alt={item.title}
                        fill
                        className="object-cover rounded-lg"
                      />
                    </div>
                      {/* <img
                        src={
                          item.goodsImagePaths?.[0] ||
                          "/api/placeholder/200/200"
                        }
                        alt={item.title}
                        className="w-full h-full object-cover rounded-lg"
                      /> */}
                    </div>
                    <div className="flex flex-col gap-1">
                      <h3 className="font-medium text-gray-900 line-clamp-2">
                        {item.title}
                      </h3>
                      <p className="text-lg font-bold">
                        {item.price?.toLocaleString()}원
                      </p>
                      <p className="text-sm text-gray-500">
                        {item.sellerNickname}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="h-[280px] rounded-lg flex items-center justify-center">
              <p className="text-[#828C94]">최근 본 상품이 없습니다.</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
