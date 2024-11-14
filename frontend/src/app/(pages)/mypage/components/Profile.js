import Image from "next/image";
import profileDefault from "/public/icons/profile.svg";
import React, { useEffect, useState } from "react";
import { fetchUserProfile, goodsLikeList } from "@/app/api/userApi";
import { fetchPayHistory } from "@/app/api/payApi";

export default function Profile({ user }) {
  const [profileData, setProfileData] = useState(null);
  const [userCounts, setUserCounts] = useState({
    orderCount: 0,
    salesCount: 0,
    wishlistCount: 0,
  });
  const { name, profileImage } = user;

  useEffect(() => {
    const loadUserData = async () => {
      try {
        // 프로필 정보 가져오기
        const profileInfo = await fetchUserProfile();
        setProfileData(profileInfo);

        // 찜한 상품 개수 가져오기
        const wishlistData = await goodsLikeList();

        // 구매/판매 내역 가져오기
        const payHistory = await fetchPayHistory(0, 1000);
        const purchaseCount = payHistory.content.filter(
          (item) => item.type === "PURCHASE"
        ).length;
        const salesCount = payHistory.content.filter(
          (item) => item.type === "SALE"
        ).length;

        setUserCounts({
          orderCount: purchaseCount,
          salesCount: salesCount,
          wishlistCount: wishlistData.length || 0,
        });
      } catch (error) {
        console.error("사용자 데이터 로딩 실패:", error);
      }
    };

    loadUserData();
  }, []);

  return (
    <div>
      {/* 프로필 섹션 */}
      <div className="flex items-center mb-6">
        <Image
          src={profileImage ? profileImage : profileDefault}
          alt="Profile Image"
          width={37}
          height={37}
          className="rounded-full"
        />
        <h1 className="text-2xl font-bold ml-4">
          {profileData?.nickname || name}님
        </h1>
      </div>

      {/* 박스 섹션 */}
      <div
        className="flex justify-between items-center mt-6 px-10"
        style={{
          width: "100%",
          height: "8.0625rem",
          flexShrink: 0,
          borderRadius: "1.25rem",
          border: "1px solid var(--GreyButtonText, #C2C8CB)",
          backgroundColor: "var(--ButtonText, #FFF)",
        }}
      >
        {/* 주문배송 */}
        <div className="flex flex-col items-center">
          <span
            style={{
              color: "var(--normalText, #2F3438)",
              fontFamily: "'Noto Sans KR', sans-serif",
              fontSize: "1.25rem",
              fontStyle: "normal",
              fontWeight: "700",
              lineHeight: "normal",
            }}
          >
            주문배송
          </span>
          <span
            style={{
              color: "var(--Button, #35C5F0)",
              fontFamily: "'Noto Sans KR', sans-serif",
              fontSize: "1.25rem",
              fontStyle: "normal",
              fontWeight: "700",
              lineHeight: "normal",
            }}
          >
            {userCounts.orderCount}
          </span>
        </div>

        {/* 판매완료 */}
        <div className="flex flex-col items-center">
          <span
            style={{
              color: "var(--normalText, #2F3438)",
              fontFamily: "'Noto Sans KR', sans-serif",
              fontSize: "1.25rem",
              fontStyle: "normal",
              fontWeight: "700",
              lineHeight: "normal",
            }}
          >
            판매완료
          </span>
          <span
            style={{
              color: "var(--Button, #35C5F0)",
              fontFamily: "'Noto Sans KR', sans-serif",
              fontSize: "1.25rem",
              fontStyle: "normal",
              fontWeight: "700",
              lineHeight: "normal",
            }}
          >
            {userCounts.salesCount}
          </span>
        </div>

        {/* 찜한상품 */}
        <div className="flex flex-col items-center">
          <span
            style={{
              color: "var(--normalText, #2F3438)",
              fontFamily: "'Noto Sans KR', sans-serif",
              fontSize: "1.25rem",
              fontStyle: "normal",
              fontWeight: "700",
              lineHeight: "normal",
            }}
          >
            찜한상품
          </span>
          <span
            style={{
              color: "var(--Button, #35C5F0)",
              fontFamily: "'Noto Sans KR', sans-serif",
              fontSize: "1.25rem",
              fontStyle: "normal",
              fontWeight: "700",
              lineHeight: "normal",
            }}
          >
            {userCounts.wishlistCount}
          </span>
        </div>
      </div>
    </div>
  );
}
