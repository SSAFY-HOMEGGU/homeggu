"use client";
import React, { useState, useRef } from "react";
import Image from "next/image";
import dynamic from "next/dynamic";
import addProfileImg from "/public/icons/addprofileimg.svg";
import infoIcon from "/public/icons/info.svg";
import AddressSearch from "../../../components/AddressSearch";
import { BlueButton } from "../../../components/Button";
import InputBox from "../../../components/InputBox";
import TransactionCard from "@/app/components/TransactionCard";
import { Plus, SendHorizonal } from "lucide-react"; // 아이콘 추가

const Register = dynamic(() => import("../../../components/RegisterModal"), {
  ssr: false,
});

export default function PayPage() {
  const [showAccountDelete, setShowAccountDelete] = useState(false);
  const [uploadedImage, setUploadedImage] = useState(null);
  const accountBoxRef = useRef(null);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [connectedAccount, setConnectedAccount] = useState({
    accountHolder: "홍길동",
    bankName: "국민은행",
    accountNumber: "123-4567-8901",
  });
  const [homccuMoney, setHomccuMoney] = useState(0);
  const [selectedTab, setSelectedTab] = useState("전체");

  // 거래 내역 데이터
  const transactions = {
    송금: [
      {
        id: 1,
        type: "송금",
        title: "폭닥폭닥 침대",
        date: "10.22 13:44",
        amount: -100000,
        status: "승인",
      },
    ],
    충전: [
      {
        id: 2,
        type: "충전",
        title: "신한 6606",
        date: "10.22 13:44",
        amount: 100000,
        status: "승인",
      },
      {
        id: 3,
        type: "충전",
        title: "농협 1234",
        date: "10.22 13:43",
        amount: 50000,
        status: "승인",
      },
      {
        id: 4,
        type: "충전",
        title: "카카오 5678",
        date: "10.22 13:42",
        amount: 30000,
        status: "승인",
      },
      {
        id: 5,
        type: "충전",
        title: "우리 9012",
        date: "10.22 13:41",
        amount: 80000,
        status: "승인",
      },
      {
        id: 6,
        type: "충전",
        title: "IBK기업 3456",
        date: "10.22 13:40",
        amount: 70000,
        status: "승인",
      },
      {
        id: 7,
        type: "충전",
        title: "하나 7890",
        date: "10.22 13:39",
        amount: 60000,
        status: "승인",
      },
      {
        id: 8,
        type: "충전",
        title: "부산 2468",
        date: "10.22 13:38",
        amount: 40000,
        status: "승인",
      },
      {
        id: 9,
        type: "충전",
        title: "시티 1357",
        date: "10.22 13:37",
        amount: 90000,
        status: "승인",
      },
      {
        id: 10,
        type: "충전",
        title: "KDB산업 9876",
        date: "10.22 13:36",
        amount: 45000,
        status: "승인",
      },
      {
        id: 11,
        type: "충전",
        title: "SC제일 5432",
        date: "10.22 13:35",
        amount: 55000,
        status: "승인",
      },
      {
        id: 12,
        type: "충전",
        title: "토스 8520",
        date: "10.22 13:34",
        amount: 65000,
        status: "승인",
      },
      {
        id: 13,
        type: "충전",
        title: "MG새마을금고 7410",
        date: "10.22 13:33",
        amount: 75000,
        status: "승인",
      },
      {
        id: 14,
        type: "충전",
        title: "신협 9630",
        date: "10.22 13:32",
        amount: 85000,
        status: "승인",
      },
      {
        id: 15,
        type: "충전",
        title: "iM뱅크 1590",
        date: "10.22 13:31",
        amount: 95000,
        status: "승인",
      },
    ],
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setUploadedImage(imageUrl);
    }
  };

  const handleTabClick = (tab) => {
    setSelectedTab(tab);
  };

  // 현재 선택된 탭에 따라 표시할 거래 내역 필터링
  const getFilteredTransactions = () => {
    if (selectedTab === "전체") {
      return [...transactions.송금, ...transactions.충전];
    }
    return transactions[selectedTab] || [];
  };

  return (
    <div>
      <h1 className="text-2xl font-bold">My PAY</h1>

      {/* 회색 밑줄 */}
      <div className="w-full h-[0.0625rem] bg-[#C2C8CB] mt-2" />

      {/* 홈꾸머니 박스 */}
      <div className="mt-8 w-full">
        <div className="h-[13.5rem] rounded-[0.9375rem] border-[2px] border-greyButtonText bg-white p-4 relative">
          <div className="text-[1.2rem] font-bold">홈꾸머니</div>
          <div className="absolute top-4 right-4 text-base">
            연결계좌: {connectedAccount.bankName}{" "}
            {connectedAccount.accountNumber}
          </div>
          <div className="text-[2rem] font-bold text-center mt-8">
            {homccuMoney.toLocaleString()} 원
          </div>
          <div className="flex justify-center gap-4 mt-8">
            <button className="w-32 h-10 rounded-lg bg-[#F6F8FA] text-[#2F3438] border border-[#C2C8CB] font-bold cursor-pointer flex items-center justify-center gap-2">
              <Plus size={16} />
              충전하기
            </button>
            <button className="w-32 h-10 rounded-lg bg-[#F6F8FA] text-[#2F3438] border border-[#C2C8CB] font-bold cursor-pointer flex items-center justify-center gap-2">
              <SendHorizonal size={16} />
              계좌송금
            </button>
          </div>
        </div>
      </div>

      {/* 이용내역 */}
      <div className="mt-8 w-full">
        <h2 className="text-[#2F3438] font-bold text-[1.25rem]">이용내역</h2>

        {/* 회색 밑줄 */}
        <div className="flex mt-4 relative">
          <div className="absolute bottom-0 w-full h-[0.0625rem] bg-[#C2C8CB]" />
        </div>

        {/* 탭 */}
        <div className="flex justify-start items-center mt-4 gap-4">
          {["전체", "송금", "충전"].map((tab) => (
            <div
              key={tab}
              onClick={() => handleTabClick(tab)}
              className={`cursor-pointer ${
                selectedTab === tab ? "font-bold" : "font-normal"
              }`}
            >
              {tab}
            </div>
          ))}
        </div>

        {/* 거래 내역 표시 */}
        <div className="mt-4 bg-gray-50 rounded-lg">
          {getFilteredTransactions().map((transaction) => (
            <TransactionCard key={transaction.id} {...transaction} />
          ))}
        </div>
      </div>
    </div>
  );
}
