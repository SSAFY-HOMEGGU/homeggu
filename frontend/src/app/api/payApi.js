import { payInstance } from "./axiosInstance";


// 홈꾸머니 정보 조회
export const fetchPayInfo = async () => {
  try {
    const response = await payInstance.get("/pay-info");
    const balance = parseInt(response.data.hgMoneyBalance, 10);
    return {
      homccuMoney: balance,
      accountNumber: response.data.accountNumber,
      bank: response.data.bank,
    };
  } catch (error) {
    console.error("홈꾸머니 정보 조회 실패:", error);
    throw error;
  }
};

// 이용내역 조회 API
export const fetchPayHistory = async (page = 0, size = 20, filter = "") => {
  try {
    let url = `/pay-info/history?page=${page}&size=${size}`;
    if (filter) {
      // filter가 '전체'가 아닐 경우에만 필터 파라미터 추가
      if (filter === "송금") {
        url += "&filter=transfer";
      } else if (filter === "충전") {
        url += "&filter=charge";
      }
    }

    const response = await payInstance.get(url);
    return response.data;
  } catch (error) {
    console.error("이용내역 조회 실패:", error);
    throw error;
  }
};

//머니 충전 조회 API
export const chargeMoney = async (chargeAmount) => {
  try {
    const response = await payInstance.post("/charge", {
      chargeAmount: Number(chargeAmount), // 숫자로 변환하여 전송
    });
    if (response.status === 201) {
      console.log("충전 성공");
      return response.data;
    }
  } catch (error) {
    if (error.response?.status === 400) {
      // 서버에서 반환된 오류 메시지를 그대로 표시
      console.error("충전 실패:", error.response.data);
      throw new Error(
        error.response.data.message || "충전 중 오류가 발생했습니다."
      );
    } else {
      console.error("충전 실패:", error);
      throw error;
    }
  }
};

//송금(일반/안전) api
export const transferMoney = async (
  salesBoardId,
  receiverId,
  transferAmount,
  safePay
) => {
  try {
    const response = await payInstance.post("/transfer", {
      salesBoardId: Number(salesBoardId), // Long 형식으로 전달
      receiverId: Number(receiverId),
      transferAmount: Number(transferAmount),
      safePay: Boolean(safePay),
    });
    if (response.status === 201) {
      console.log("송금 성공");
      return response.data;
    }
  } catch (error) {
    if (
      error.response?.status === 400 &&
      error.response.data.message === "홈꾸머니 잔액이 부족합니다."
    ) {
      console.error("송금 실패: 홈꾸머니 잔액이 부족합니다.");
      throw new Error("홈꾸머니 잔액이 부족합니다.");
    } else {
      console.error("송금 실패:", error);
      throw error;
    }
  }
};

// 안전 송금 확정
export const transferConfirm = (transferId) => {
  return payInstance.patch("/transfer/confirm", transferId )
    .then((response) => response.data)
    .catch((error) => {
      console.error("상세 에러 정보:", error);
      throw error;
    });
};

// 안전 송금 취소
export const transferCancel = (transferId) => {
  return payInstance.patch("/transfer/cancel", transferId )
    .then((response) => response.data)
    .catch((error) => {
      console.error("상세 에러 정보:", error);
      throw error;
    });
};

