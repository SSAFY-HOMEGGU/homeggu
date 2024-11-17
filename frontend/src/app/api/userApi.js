import { authInstance, userInstance } from "./axiosInstance";
// import { authInstance,userInstance } from "./axiosInstanceLocal";

// 로그인
export const fetchLogin = (code) => {
  return authInstance
    .post("/oauth/kakao/login", { code: code })
    .then((response) => response.data)
    .catch((error) => {
      console.error("상세 에러 정보:", error);
      throw error;
    });
};

// 로그아웃
export const fetchLogout = (accessToken) => {
  return userInstancez
    .post("/oauth/kakao/logout", { accessToken: accessToken })
    .then((response) => response.data)
    .catch((error) => {
      console.error("상세 에러 정보:", error);
      throw error;
    });
};

// 회원가입 시 선호도 초기화
export const preferenceInit = () => {
  return userInstance
    .get("/preference/init")
    .then((response) => response.data)
    .catch((error) => {
      console.error("상세 에러 정보:", error);
      throw error;
    });
};

// 회원가입
export const firstLogin = () => {
  return userInstance
    .get("/oauth/kakao/firstLogin")
    .then((response) => response.data)
    .catch((error) => {
      console.error("상세 에러 정보:", error);
      throw error;
    });
};

// 회원탈퇴
export const deleteAccount = () => {
  return userInstance
    .delete("/oauth/delete")
    .then((response) => response.data)
    .catch((error) => {
      console.error("상세 에러 정보:", error);
      throw error;
    });
};

// 찜 상품 조회
export const goodsLikeList = () => {
  return userInstance
    .get("/goods/like-list")
    .then((response) => response.data)
    .catch((error) => {
      console.error("상세 에러 정보:", error);
      throw error;
    });
};

// 찜 등록
export const goodsLike = (salesBoardId) => {
  return userInstance
    .post("/goods/like", { salesBoardId: salesBoardId })
    .then((response) => response.data)
    .catch((error) => {
      console.error("상세 에러 정보:", error);
      throw error;
    });
};

// 찜 해제
export const goodsUnlike = (salesBoardId) => {
  return userInstance
    .delete("/goods/unlike", { salesBoardId: salesBoardId })
    .then((response) => response.data)
    .catch((error) => {
      console.error("상세 에러 정보:", error);
      throw error;
    });
};

// 찜 여부 확인
export const goodsIsLike = (salesBoardId) => {
  console.log("찜 여부 확인", salesBoardId);
  return userInstance
    .get("/like/isLike", { salesBoardId: salesBoardId })
    .then((response) => response.data)
    .catch((error) => {
      console.error("상세 에러 정보:", error);
      throw error;
    });
};

// 사용자 프로필 조회
export const fetchUserProfile = () => {
  return userInstance
    .get("/profile/detail")
    .then((response) => {
      // blob URL을 사용하지 않고 서버에서 받은 실제 이미지 경로를 사용
      const profileData = response.data;
      if (
        profileData.userImagePath &&
        profileData.userImagePath.startsWith("blob:")
      ) {
        // blob URL인 경우 처리
        delete profileData.userImagePath;
      }
      return profileData;
    })
    .catch((error) => {
      console.error("프로필 조회 에러:", error);
      throw error;
    });
};

// 닉네임 중복 확인 수정
export const checkNickname = async (nickname) => {
  try {
    const response = await userInstance.post("/profile/nickname", {
      nickname: nickname,
    });

    return {
      available: true,
      message: response.data.message || "사용 가능한 닉네임입니다.",
    };
  } catch (error) {
    if (error.response?.status === 409) {
      return {
        available: false,
        message: error.response.data.message || "이미 사용중인 닉네임입니다.",
      };
    }
    throw error;
  }
};

// 프로필 정보 업데이트 수정
export const updateUserProfile = (profileData) => {
  const requestBody = {
    nickname: profileData.nickname || null,
    address: profileData.address || null,
    addressDetail: profileData.addressDetail || null,
    addressNickname: profileData.addressNickname || null,
    phoneNumber: profileData.phoneNumber || null,
    userImagePath: profileData.userImagePath || null,
  };

  return userInstance
    .put("/profile/update", requestBody)
    .then((response) => response.data)
    .catch((error) => {
      console.error("프로필 업데이트 에러:", error);
      if (error.response?.status === 404) {
        throw new Error(
          error.response.data.message || "프로필 업데이트에 실패했습니다."
        );
      }
      throw error;
    });
};

// 프로필 이미지 등록
export const uploadProfileImage = async (file) => {
  const formData = new FormData();
  formData.append("file", file);

  try {
    const response = await userInstance.post("/profile/image", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    console.error("이미지 업로드 에러:", error.response || error);
    throw error;
  }
};

// 사용자 행동에 따른 선호도 업데이트
export const preferenceUpdate = (formData) => {
  console.log("선호도 업데이트", formData);
  return userInstance
    .post("/preference/update", formData)
    .then((response) => response.data)
    .catch((error) => {
      console.error("상세 에러 정보", error);
    });
};

// 가구 구매 시 선호도 업데이트
export const preferenceBuy = (formData) => {
  console.log("구매시 선호도 업데이트", formData);
  return userInstance
    .post("/preference/buy", formData)
    .then((response) => response.data)
    .catch((error) => {
      console.error("상세 에러 정보", error);
    });
};

// 최근 본 상품 조회
export const fetchRecentViewedItems = () => {
  return userInstance
    .get("/goods/latest")
    .then((response) => response.data)
    .catch((error) => {
      console.error("최근 본 상품 조회 에러:", error);
      throw error;
    });
};

// 추천 상품
export const preferenceList = () => {
  return userInstance
    .get("/preference/list")
    .then((response) => response.data)
    .catch((error) => {
      console.error("최근 본 상품 조회 에러:", error);
      throw error;
    });
};
