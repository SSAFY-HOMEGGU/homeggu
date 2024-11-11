"use client";

import React, { useState } from "react";
import alertIcon from "/public/icons/alert.svg"; // 경고 아이콘
import Modal from "../../../components/Modal"; // 모달 컴포넌트 불러오기

export default function WithdrawalPage() {
  const [showModal, setShowModal] = useState(false);

  const handleWithdrawal = () => {
    alert("회원 탈퇴가 완료되었습니다.");
    setShowModal(false); // 탈퇴 후 모달창 닫기
  };

  return (
    <div>
      {/* 탈퇴하기 타이틀 */}
      <h1 className="text-2xl font-bold">탈퇴하기</h1>
      <div className="flex mt-4 relative w-full">
        <div
          style={{
            position: "absolute",
            bottom: "-0.35rem",
            width: "100%",
            height: "0.0625rem",
            background: "var(--GreyButtonText, #C2C8CB)",
          }}
        />
      </div>

      {/* 안내 문구 */}
      <div
        style={{ width: "46.072rem", margin: "4rem auto", textAlign: "left" }}
      >
        <p
          style={{
            color: "var(--subText, #828C94)",
            fontFamily: "'Noto Sans KR', sans-serif",
            fontSize: "1.0625rem",
            lineHeight: "1.75rem",
          }}
        >
          (주) 홈꾸는 회원 간의 자유로운 거래를 돕기 위한 중개 역할만을 제공하며, 실제 판매 및 구매 절차에 직접적인 개입을 하지 않습니다.
          <br />
          <br />
          &apos;전자상거래법 제08조&apos;에 의거하여, 저희는 거래의 성사, 제품의 품질,
          결제 및 환불 등 판매자와 구매자 간의 거래 과정에 대해 책임을 지지 않습니다. 회원 탈퇴를 요청하시면, 탈퇴 즉시 모든 거래 내역, 대화 기록이 삭제되며, 복구가 불가능합니다.
          <br />
          <br />
          탈퇴 전 반드시 현재 진행 중인 거래가 있는지 확인해 주시기 바라며, 거래가 완료되지 않은 상태에서의 탈퇴는 구매자 또는 판매자에게 피해를 줄 수 있습니다. 따라서 탈퇴 시에는 거래 종료 여부와 관련된 분쟁 발생 가능성을 신중히 고려해 주세요. 만약 회원 탈퇴 이후 발생하는 거래 관련 분쟁에 대해서는 당사는 개입할 수 없으며, &apos;소비자 보호법 제11조&apos;에 따라 거래 당사자 간에 해결해야 합니다.
          <br />
          <br />
          또한, 회원 탈퇴 이후 동일한 이메일 또는 전화번호로 재가입이 제한될 수 있으니 이 점 유의하시기 바랍니다. 더 궁금한 사항이 있으시면 고객센터로 문의해 주시기 바랍니다.
        </p>
      </div>

      {/* 탈퇴하기 버튼 */}
      <div style={{ textAlign: "center", marginTop: "15rem" }}>
        <button className="withdraw-button" onClick={() => setShowModal(true)}>
          탈퇴하기
        </button>
      </div>

      {/* 모달 */}
      <Modal
        show={showModal}
        onClose={() => setShowModal(false)}
        title="정말 탈퇴하실건가요?"
        description="탈퇴 버튼 클릭 시, 계정은 삭제되며, 복구되지 않습니다."
        icon={alertIcon}
        confirmText="탈퇴하기"
        cancelText="취소하기"
        onConfirm={handleWithdrawal}
      />

      {/* hover 스타일 */}
      <style jsx>{`
        .withdraw-button {
          width: 46rem;
          height: 3.75rem;
          flex-shrink: 0;
          border-radius: 0.625rem;
          background-color: #f6f8fa;
          color: #c2c8cb;
          font-size: 1.5rem;
          font-family: "Noto Sans KR", sans-serif;
          font-weight: 500;
          line-height: 2.875rem;
          cursor: pointer;
          transition: background-color 0.3s ease, color 0.3s ease;
        }

        .withdraw-button:hover {
          background-color: #35c5f0;
          color: #fff;
        }
      `}</style>
    </div>
  );
}
