import React from "react";
import Image from "next/image";

// 실제 은행 로고 경로
const BANK_LOGOS = {
  BNK부산은행: "/banklogo/bnkbank.svg",
  시티은행: "/banklogo/citybank.svg",
  국민은행: "/banklogo/gukminbank.svg",
  하나은행: "/banklogo/hanabank.svg",
  IBK기업은행: "/banklogo/ibkbank.svg",
  iM뱅크: "/banklogo/imbank.svg",
  카카오뱅크: "/banklogo/kakaobank.svg",
  KDB산업은행: "/banklogo/kdbbank.svg",
  농협은행: "/banklogo/nonghyup.svg",
  SC제일은행: "/banklogo/scbank.svg",
  신한은행: "/banklogo/sinhanbank.svg",
  토스뱅크: "/banklogo/tossbank.svg",
  MG새마을금고: "/banklogo/saemaulbank.svg",
  신협은행: "/banklogo/sinhyup.svg",
  우리은행: "/banklogo/wooribank.svg",
};

// 간단 표기를 풀네임으로 매핑
const BANK_NAME_MAPPING = {
  부산: "BNK부산은행",
  시티: "시티은행",
  국민: "국민은행",
  하나: "하나은행",
  IBK기업: "IBK기업은행",
  iM: "iM뱅크",
  카카오: "카카오뱅크",
  KDB산업: "KDB산업은행",
  농협: "농협은행",
  SC제일: "SC제일은행",
  신한: "신한은행",
  토스: "토스뱅크",
  MG새마을: "MG새마을금고",
  신협: "신협은행",
  우리: "우리은행",
};

const TransactionCard = ({ type, title, date, amount, status, balance }) => {
  const getBankLogo = () => {
    // 간단 표기된 은행명 찾기
    const simpleBankName = Object.keys(BANK_NAME_MAPPING).find((key) =>
      title?.includes(key)
    );

    if (simpleBankName && type === "충전") {
      const fullBankName = BANK_NAME_MAPPING[simpleBankName];
      return (
        <Image
          src={BANK_LOGOS[fullBankName]}
          alt={`${fullBankName} 로고`}
          width={48}
          height={48}
          className="rounded-lg"
        />
      );
    }
    return <div className="text-2xl">🛏️</div>;
  };

  return (
    <div className="flex items-center justify-between p-4 bg-white border-b border-gray-100">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 flex items-center justify-center">
          {getBankLogo()}
        </div>
        <div>
          <div className="font-medium text-[#2F3438]">{title}</div>
          <div className="text-sm text-gray-500">
            {date} | {status}
          </div>
        </div>
      </div>
      <div className="text-right">
        <div
          className={`font-medium ${
            amount < 0 ? "text-[#2F3438]" : "text-[#35C5F0]"
          }`}
        >
          {type === "충전" ? "+" : ""}
          {amount.toLocaleString()}원
        </div>
        {balance !== null && (
          <div className="text-sm text-gray-400">
            {balance.toLocaleString()}원
          </div>
        )}
      </div>
    </div>
  );
};

export default TransactionCard;
