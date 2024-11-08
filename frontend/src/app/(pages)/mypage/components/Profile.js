import Image from "next/image";
import profileDefault from "/public/icons/profile.svg";
import React, { useEffect, useState } from "react";
import { fetchUserProfile } from "@/app/api/userApi";

export default function Profile({ user }) {
  const [profileData, setProfileData] = useState(null);
  const { name, profileImage, orderCount, salesCount, wishlistCount } = user;

  useEffect(() => {
    const loadUserProfile = async () => {
      try {
        const data = await fetchUserProfile();
        setProfileData(data);
      } catch (error) {
        console.error("프로필 정보 로딩 실패:", error);
      }
    };

    loadUserProfile();
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
            {orderCount}
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
            {salesCount}
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
            {wishlistCount}
          </span>
        </div>
      </div>
    </div>
  );
}
