"use client";
import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import dynamic from "next/dynamic";
import addProfileImg from "/public/icons/addprofileimg.svg";
import infoIcon from "/public/icons/info.svg";
import AddressSearch from "../../../components/AddressSearch";
import { BlueButton } from "../../../components/Button";
import InputBox from "../../../components/InputBox";
import TransactionCard from "@/app/components/TransactionCard";
import { CirclePlus } from "lucide-react";
import { fetchPayInfo, fetchPayHistory, chargeMoney } from "@/app/api/payApi";
import ChargeModal from "@/app/components/ChargeModal";



export default function PayPage() {
  const [showAccountDelete, setShowAccountDelete] = useState(false);
  const [uploadedImage, setUploadedImage] = useState(null);
  const accountBoxRef = useRef(null);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [showChargeModal, setShowChargeModal] = useState(false);
  const [connectedAccount, setConnectedAccount] = useState({
    accountHolder: "",
    bankName: "",
    accountNumber: "",
  });
  const [homccuMoney, setHomccuMoney] = useState(0);
  const [selectedTab, setSelectedTab] = useState("전체");
  const [transactions, setTransactions] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    loadPayInfo();
  }, []);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    loadTransactions();
  }, [selectedTab, currentPage]);

  const loadPayInfo = async () => {
    try {
      const payInfo = await fetchPayInfo();
      setHomccuMoney(payInfo.homccuMoney);
      setConnectedAccount({
        accountHolder: "",
        bankName: payInfo.bank || "",
        accountNumber: payInfo.accountNumber || "",
      });
    } catch (error) {
      console.error("홈꾸머니 정보 로딩 실패:", error);
      setHomccuMoney(0);
    }
  };

  const loadTransactions = async () => {
    try {
      let filter = "";
      if (selectedTab === "송금") filter = "transfer";
      else if (selectedTab === "충전") filter = "charge";

      const data = await fetchPayHistory(currentPage, 20, filter);
      const filteredTransactions = data.content.filter((transaction) => {
        if (selectedTab === "송금") {
          return (
            transaction.historyCategory === "NORMAL_TRANSFER" ||
            transaction.historyCategory === "SAFE_TRANSFER"
          );
        } else if (selectedTab === "충전") {
          return transaction.historyCategory === "CHARGE";
        }
        return true;
      });

      setTransactions(filteredTransactions);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error("거래내역 로딩 실패:", error);
      setTransactions([]);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return `${date.getMonth() + 1}.${date.getDate()} ${date
      .getHours()
      .toString()
      .padStart(2, "0")}:${date.getMinutes().toString().padStart(2, "0")}`;
  };

  const formatTransaction = (transaction) => {
    const formattedDate = formatDate(transaction.createAt);
    let title = "";
    let type = "";
    let status = "승인";

    switch (transaction.historyCategory) {
      case "CHARGE":
        type = "충전";
        title = `${transaction.bank} ${transaction.accountNumber}`;
        break;

      case "NORMAL_TRANSFER":
        type = "송금";
        title =
          transaction.amount > 0
            ? `${transaction.title} (${transaction.counterpartyName}님이 보냄)`
            : `${transaction.title} (${transaction.counterpartyName}님에게)`;
        break;

      case "SAFE_TRANSFER":
        type = "안전송금";
        if (transaction.stateCategory === "PENDING") {
          status = "미확정";
          title = `${transaction.title} (${transaction.counterpartyName}님과 거래중)`;
        } else if (transaction.stateCategory === "CONFIRMED") {
          title =
            transaction.amount > 0
              ? `${transaction.title} (${transaction.counterpartyName}님이 보냄)`
              : `${transaction.title} (${transaction.counterpartyName}님에게)`;
        } else if (transaction.stateCategory === "CANCELLED") {
          status = "취소";
          title = `${transaction.title} (거래취소)`;
        }
        break;
    }

    return {
      id: `${transaction.createAt}-${transaction.amount}`,
      type,
      title,
      date: formattedDate,
      amount: transaction.amount,
      status,
      balance: transaction.balance ?? null,
      salesBoardId: transaction.salesBoardId,
    };
  };

  const handleTransactionClick = (transaction) => {
    if (
      (transaction.type === "송금" || transaction.type === "안전송금") &&
      transaction.salesBoardId
    ) {
      window.location.href = `/products/${transaction.salesBoardId}`;
    }
  };

  const handleTabClick = (tab) => {
    setSelectedTab(tab);
    setCurrentPage(0);
  };

  const handleChargeClick = () => {
    setShowChargeModal(true);
  };

  const confirmCharge = async (amount) => {
    try {
      await chargeMoney(amount);
      alert("충전이 완료되었습니다.");
      loadPayInfo();
      loadTransactions();
    } catch (error) {
      alert(error.message || "충전 중 오류가 발생했습니다.");
    } finally {
      setShowChargeModal(false);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold">My PAY</h1>

      <div className="w-full h-[0.0625rem] bg-[#C2C8CB] mt-2" />

      <div className="mt-8 w-full">
        <div className="h-[12rem] rounded-[0.9375rem] border-[2px] border-greyButtonText bg-white p-4 relative">
          <div className="flex justify-between items-center">
            <div className="text-[1.2rem] font-bold">홈꾸머니</div>
            <button
              className="w-24 h-8 rounded-lg bg-[#F6F8FA] text-[#2F3438] border border-[#C2C8CB] font-bold cursor-pointer flex items-center justify-center gap-1 hover:bg-[#E7E9EB]"
              onClick={handleChargeClick}
            >
              <CirclePlus size={16} /> {/* DollarSign 아이콘으로 변경 */}
              충전하기
            </button>
          </div>

          <div className="text-[2rem] font-bold text-center mt-4">
            {(homccuMoney || 0).toLocaleString()} 원
          </div>

          {connectedAccount.bankName && connectedAccount.accountNumber && (
            <div className="text-center text-base mt-4">
              연결계좌: {connectedAccount.bankName}{" "}
              {connectedAccount.accountNumber}
            </div>
          )}
        </div>
      </div>

      <div className="mt-8 w-full">
        <h2 className="text-[#2F3438] font-bold text-[1.25rem]">이용내역</h2>

        <div className="flex mt-4 relative">
          <div className="absolute bottom-0 w-full h-[0.0625rem] bg-[#C2C8CB]" />
        </div>

        <div className="flex justify-start items-center mt-4 gap-4">
          {["전체", "송금", "충전"].map((tab) => (
            <div
              key={tab}
              onClick={() => handleTabClick(tab)}
              className={`cursor-pointer ${
                selectedTab === tab
                  ? "font-bold text-[#2F3438]"
                  : "font-normal text-[#828C94] hover:text-[#2F3438]"
              }`}
            >
              {tab}
            </div>
          ))}
        </div>

        <div className="mt-4">
          {transactions.map((transaction) => {
            const formattedTransaction = formatTransaction(transaction);
            return (
              <div
                key={formattedTransaction.id}
                onClick={() => handleTransactionClick(formattedTransaction)}
                className={
                  formattedTransaction.salesBoardId ? "cursor-pointer" : ""
                }
              >
                <TransactionCard {...formattedTransaction} />
              </div>
            );
          })}
        </div>

        {totalPages > 1 && (
          <div className="flex justify-center mt-4 gap-2">
            {[...Array(totalPages)].map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentPage(index)}
                className={`px-3 py-1 rounded ${
                  currentPage === index
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 hover:bg-gray-300"
                }`}
              >
                {index + 1}
              </button>
            ))}
          </div>
        )}
      </div>

      
      {showChargeModal && (
        <ChargeModal
          onClose={() => setShowChargeModal(false)}
          onConfirm={confirmCharge}
        />
      )}
    </div>
  );
}
