"use client";

import React, { useState } from "react";

const Register = React.memo(({ onClose }) => {
  const [accountHolder, setAccountHolder] = useState("홍길동");
  const [bankName, setBankName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");

  const handleAccountNumberChange = (event) => {
    const value = event.target.value.replace(/\D/g, "");
    setAccountNumber(value);
  };

  const handleRegister = () => {
    alert("계좌가 등록되었습니다.");
    onClose();
  };

  return (
    <div
      style={{
        position: "fixed",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: "45rem", // 모달 크기 더 크게 조정
        height: "39rem", // 모달 높이 증가
        backgroundColor: "white",
        borderRadius: "1.5rem",
        padding: "2.5rem", // 내부 패딩도 조금 더 추가
        boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.1)",
        zIndex: 1000,
      }}
    >
      {/* 계좌등록 제목 */}
      <h2
        style={{
          color: "var(--normalText, #2F3438)",
          fontFamily: "'Noto Sans KR', sans-serif",
          fontSize: "1.75rem", // 텍스트 크기 약간 더 크게
          fontWeight: "500",
          textAlign: "center",
        }}
      >
        계좌등록
      </h2>

      {/* 예금주 */}
      <div
        style={{
          marginTop: "2rem", // 항목 간 상하 간격 더 추가
          display: "flex",
          flexDirection: "column",
          gap: "2rem", // 항목들 간 여유 공간 확보
        }}
      >
        <div>
          <label
            style={{
              fontSize: "1.25rem", // 라벨 폰트 크기 약간 더 크게
              fontFamily: "'Noto Sans KR', sans-serif",
              fontWeight: "400",
            }}
          >
            예금주
          </label>
          <input
            type="text"
            value={accountHolder}
            readOnly
            style={{
              width: "100%",
              height: "2.875rem", // 높이 약간 증가
              borderRadius: "0.625rem",
              border: "1px solid var(--GreyButtonText, #C2C8CB)",
              paddingLeft: "0.75rem", // 패딩 약간 더 넉넉하게
              backgroundColor: "#F6F8FA",
            }}
          />
        </div>

        {/* 은행명 */}
        <div>
          <label
            style={{
              fontSize: "1.25rem", // 라벨 폰트 크기 약간 더 크게
              fontFamily: "'Noto Sans KR', sans-serif",
              fontWeight: "400",
            }}
          >
            은행명
          </label>
          <select
            value={bankName}
            onChange={(e) => setBankName(e.target.value)}
            style={{
              width: "100%",
              height: "2.875rem", // 높이 약간 증가
              borderRadius: "0.625rem",
              border: "1px solid var(--GreyButtonText, #C2C8CB)",
              paddingLeft: "0.75rem", // 패딩 약간 더 넉넉하게
            }}
          >
            <option value="">은행 선택</option>
            <option value="국민은행">국민은행</option>
            <option value="우리은행">우리은행</option>
            <option value="신한은행">신한은행</option>
            <option value="농협은행">농협은행</option>
            <option value="하나은행">하나은행</option>
          </select>
        </div>

        {/* 계좌번호 */}
        <div>
          <label
            style={{
              fontSize: "1.25rem", // 라벨 폰트 크기 약간 더 크게
              fontFamily: "'Noto Sans KR', sans-serif",
              fontWeight: "400",
            }}
          >
            계좌번호
          </label>
          <input
            type="text"
            value={accountNumber}
            onChange={handleAccountNumberChange}
            placeholder="숫자만 입력하세요"
            style={{
              width: "100%",
              height: "2.875rem", // 높이 약간 증가
              borderRadius: "0.625rem",
              border: "1px solid var(--GreyButtonText, #C2C8CB)",
              paddingLeft: "0.75rem", // 패딩 약간 더 넉넉하게
            }}
            maxLength={14} // 계좌번호 최대 길이 제한
          />
        </div>
      </div>

      {/* 버튼 그룹 */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          marginTop: "3rem", // 버튼과 입력폼 간격을 더 넓게 설정
        }}
      >
        <button
          onClick={onClose}
          style={{
            width: "8rem",
            height: "2.875rem", // 버튼 높이 증가
            marginRight: "1rem",
            borderRadius: "0.625rem",
            backgroundColor: "#F6F8FA",
            border: "1px solid var(--GreyButtonText, #C2C8CB)",
            color: "#828C94",
            cursor: "pointer",
          }}
        >
          취소하기
        </button>
        <button
          onClick={handleRegister}
          style={{
            width: "8rem",
            height: "2.875rem", // 버튼 높이 증가
            borderRadius: "0.625rem",
            backgroundColor: "#35C5F0",
            color: "#FFF",
            border: "none",
            cursor: "pointer",
          }}
        >
          계좌등록
        </button>
      </div>
    </div>
  );
});
export default Register;
