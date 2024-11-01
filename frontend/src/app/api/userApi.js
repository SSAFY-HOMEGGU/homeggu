import { authInstance, userInstance } from "./axiosInstance";

export const fetchLogin = (code) => {
  return authInstance.post('/oauth/kakao/login', {"code":code})
    .then(response => response.data)
    .catch(error => {
      console.error('상세 에러 정보:', error);
      throw error;
    });
};

export const fetchLogout = (accessToken) => {
  return userInstance.post('/oauth/kakao/logout',  {"accessToken": accessToken})
    .then(response => response.data)
    .catch(error => {
      console.error('상세 에러 정보:', error);
      throw error;
    });
};
