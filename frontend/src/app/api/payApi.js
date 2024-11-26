'use client'
// import { payInstance } from "./axiosInstance";
import { payInstance } from "./axiosInstanceLocal";

// 홈꾸머니 정보 조회
// export const fetchPayInfo = async () => {
//   try {
//     const response = await payInstance.get("/info");
//     const balance = parseInt(response.data.hgMoneyBalance, 10);
//     return {
//       homccuMoney: balance,
//       accountNumber: response.data.accountNumber,
//       bank: response.data.bank,
//     };
//   } catch (error) {
//     console.error("홈꾸머니 정보 조회 실패:", error);
//     throw error;
//   }
// };
// 홈꾸머니 정보 조회
export const fetchPayInfo = async () => {
  const userId = localStorage.getItem('userId')
  try {
    console.log("홈꾸머니 정보 조회 요청 시작");
    const response = await payInstance.get("/info",{
      headers:{userId: userId}
    });
    console.log("홈꾸머니 정보 조회 응답 데이터:", response.data);

    const balance = parseInt(response.data.hgMoneyBalance, 10);
    return {
      homccuMoney: balance,
      accountNumber: response.data.accountNumber,
      bank: response.data.bank,
    };
  } catch (error) {
    if (error.response) {
      // 서버 응답이 존재하는 경우
      console.error(
        "홈꾸머니 정보 조회 실패 - 서버 응답 에러:",
        error.response.status,
        error.response.data
      );
    } else if (error.request) {
      // 요청이 전송되었으나 응답이 없는 경우
      console.error("홈꾸머니 정보 조회 실패 - 응답 없음:", error.request);
    } else {
      // 요청 설정 중에 발생한 에러
      console.error("홈꾸머니 정보 조회 실패 - 요청 설정 에러:", error.message);
    }
    throw error;
  }
};

// 이용내역 조회 API
export const fetchPayHistory = async (page = 0, size = 20, filter = "") => {
  const userId = localStorage.getItem('userId')
  try {
    let url = `/info/history?page=${page}&size=${size}`;
    if (filter) {
      // filter가 '전체'가 아닐 경우에만 필터 파라미터 추가
      if (filter === "송금") {
        url += "&filter=transfer";
      } else if (filter === "충전") {
        url += "&filter=charge";
      }
    }

    const response = await payInstance.get(url,{
      headers:{userId: userId}
    });
    return response.data;
  } catch (error) {
    console.error("이용내역 조회 실패:", error);
    throw error;
  }
};

//머니 충전 조회 API
export const chargeMoney = async (chargeAmount) => {
  const userId = localStorage.getItem('userId')
  try {
    const response = await payInstance.post("/charge", 
      { chargeAmount: Number(chargeAmount) },  // body
      { headers: { "userId": userId } }        // headers는 별도 객체로
    );
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
  const userId = localStorage.getItem('userId')
  try {
    const response = await payInstance.post("/transfer", {
      salesBoardId: Number(salesBoardId), // Long 형식으로 전달
      receiverId: Number(receiverId),
      transferAmount: Number(transferAmount),
      safePay: Boolean(safePay),
    },
  {headers: {userId:userId}}
  );
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
  const userId = localStorage.getItem('userId')
  return payInstance
    .patch("/transfer/confirm", transferId,{
      headers:{userId: userId}
    })
    .then((response) => response.data)
    .catch((error) => {
      console.error("상세 에러 정보:", error);
      throw error;
    });
};

// 안전 송금 취소
export const transferCancel = (transferId) => {
  const userId = localStorage.getItem('userId')
  return payInstance
    .patch("/transfer/cancel", transferId,{
      headers:{userId:userId}
    })
    .then((response) => response.data)
    .catch((error) => {
      console.error("상세 에러 정보:", error);
      throw error;
    });
};
