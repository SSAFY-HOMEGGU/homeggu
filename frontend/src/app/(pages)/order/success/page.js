"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { BlueButton, WhiteButton } from "@/app/components/Button";

export default function OrderSuccessPage() {
  const product = {
    name: "폭닥폭닥 침대",
    shippingAddress: "서울특별시 강남구 테헤란로 123, 12층 1203호",
    price: 40000, // 상품 가격 10000 + 배송비 30000
  };

  return (
    <div className="flex flex-col items-center justify-center w-full h-screen space-y-8">
      {/* 주문 완료 메시지 */}
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

      {/* 성공 이미지 */}
      <Image
        src="/images/success.png"
        alt="주문 성공"
        width={350}
        height={350}
        className="mt-3"
      />

      {/* 주문 정보 테이블 */}
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

        {/* 버튼들 */}
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
