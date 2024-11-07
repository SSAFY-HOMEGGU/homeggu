import { authInstance, userInstance } from "./axiosInstance";

// 로그인
export const fetchLogin = (code) => {
  return authInstance.post('/oauth/kakao/login', {"code":code})
    .then(response => response.data)
    .catch(error => {
      console.error('상세 에러 정보:', error);
      throw error;
    });
};

// 로그아웃
export const fetchLogout = (accessToken) => {
  return userInstance.post('/oauth/kakao/logout',  {"accessToken": accessToken})
    .then(response => response.data)
    .catch(error => {
      console.error('상세 에러 정보:', error);
      throw error;
    });
};

// 찜 상품 조회
export const goodsLikeList = () => {
  return userInstance.get('/goods/like-list')
    .then(response => response.data)
    .catch(error => {
      console.error('상세 에러 정보:', error);
      throw error;
    });
};

// 찜 등록
export const goodsLike = (formData) => {
  return userInstance.post('/goods/like',formData)
    .then(response => response.data)
    .catch(error => {
      console.error('상세 에러 정보:', error);
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
  return userInstance.delete('/goods/unlike',formData)
    .then(response => response.data)
    .catch(error => {
      console.error('상세 에러 정보:', error);
      throw error;
    });
};