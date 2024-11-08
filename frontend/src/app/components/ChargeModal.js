// @/app/components/ChargeModal.js

import React, { useState } from "react";

export default function ChargeModal({ onClose, onConfirm }) {
  const [chargeAmount, setChargeAmount] = useState("");

  const handleConfirm = () => {
    const amount = parseInt(chargeAmount, 10);
    if (isNaN(amount) || amount <= 0) {
      alert("유효한 금액을 입력하세요.");
      return;
    }
    onConfirm(amount);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg p-6 w-96">
        <h2 className="text-lg font-bold mb-4">충전하기</h2>
        <p className="text-sm mb-2">충전할 금액을 입력하세요</p>
        <input
          type="number"
          value={chargeAmount}
          onChange={(e) => setChargeAmount(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded mb-4"
          placeholder="예: 10000"
        />
        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
          >
            취소
          </button>
          <button
            onClick={handleConfirm}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            충전하기
          </button>
        </div>
      </div>
    </div>
  );
}
