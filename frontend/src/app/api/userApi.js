import { authInstance, userInstance } from "./axiosInstance";

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
  return userInstance
    .post("/oauth/kakao/logout", { accessToken: accessToken })
    .then((response) => response.data)
    .catch((error) => {
      console.error("상세 에러 정보:", error);
      throw error;
    });
};

// 회원가입 시 선호도 초기화
export const preferenceInit = () => {
  return userInstance.get("/preference/init")
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
export const goodsLike = (formData) => {
  return userInstance
    .post("/goods/like", formData)
    .then((response) => response.data)
    .catch((error) => {
      console.error("상세 에러 정보:", error);
      throw error;
    });
};
// request body:
// {
// 	"user_id": 1,
// 	"sales_board_id": 1,
// }

// 찜 해제
export const goodsUnlike = (formData) => {
  return userInstance
    .delete("/goods/unlike", formData)
    .then((response) => response.data)
    .catch((error) => {
      console.error("상세 에러 정보:", error);
      throw error;
    });
};

// 사용자 프로필 조회
export const fetchUserProfile = () => {
  return userInstance
    .get("/user-profile/detail")
    .then((response) => {
      console.log("Response Data:", response.data); // 응답 데이터 출력
      return response.data;
    })
    .catch((error) => {
      console.error("프로필 조회 에러:", error);
      throw error;
    });
};

// 닉네임 중복 확인 수정
export const checkNickname = async (nickname) => {
  try {
    const response = await userInstance.post("/user-profile/nickname", {
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
    .put("/user-profile/update", requestBody)
    .then((response) => response.data)
    .catch((error) => {
      console.error("프로필 업데이트 에러:", error);
      throw error;
    });
};

// // 프로필 이미지 업로드 수정
export const uploadProfileImage = async (file) => {
  const formData = new FormData();
  formData.append("file", file);

  try {
    const response = await userInstance.post("/upload/user-image", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    console.error("이미지 업로드 에러:", error.response || error);
    if (error.response?.status === 403) {
      throw new Error("권한이 없습니다. 다시 로그인해주세요.");
    }
    throw error;
  }
};
