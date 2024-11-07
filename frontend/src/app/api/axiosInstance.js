import axios from "axios";

// 1. 로그인용 axios instance (8084 포트, 토큰 불필요)
export const authInstance = axios.create({
  baseURL: "http://localhost:8084",
  timeout: 5000,
  headers: {
    "Content-Type": "application/json",
  },
});

// 2. 유저 관련 API용 axios instance (8084 포트, 토큰 필요)
export const userInstance = axios.create({
  baseURL: "http://localhost:8084",
  timeout: 5000,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// 3. 채팅 API용 axios instance (8080 포트, 토큰 필요)
export const chatInstance = axios.create({
  baseURL: "http://localhost:8083",
  timeout: 5000,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// 4. 상품 API용 axios instance (8082 포트, 토큰 필요)
export const productInstance = axios.create({
  baseURL: "http://localhost:8082",
  timeout: 5000,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// 5. 페이 API용 axios instance (8081 포트, 토큰 필요)
export const payInstance = axios.create({
  baseURL: "http://localhost:8081",
  timeout: 5000,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
  },
});

// 토큰 인터셉터 함수
const addTokenInterceptor = (instance) => {
  instance.interceptors.request.use(
    (config) => {
      const accessToken = localStorage.getItem("accessToken");
      if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
      }
      config.headers["Access-Control-Allow-Origin"] = "*";

      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );
};

// 응답 인터셉터 함수
const addResponseInterceptor = (instance) => {
  instance.interceptors.response.use(
    (response) => {
      return response;
    },
    async (error) => {
      const originalRequest = error.config;

      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;

        try {
          const refreshToken = localStorage.getItem("refreshToken");
          const response = await authInstance.post("/api/auth/refresh", {
            refreshToken,
          });
          const newToken = response.data.accessToken;

          localStorage.setItem("accessToken", newToken);
          originalRequest.headers.Authorization = `Bearer ${newToken}`;

          return instance(originalRequest);
        } catch (refreshError) {
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
          window.location.href = "/login";
          return Promise.reject(refreshError);
        }
      }

      return Promise.reject(error);
    }
  );
};

// 인터셉터 적용
addTokenInterceptor(userInstance);
addTokenInterceptor(chatInstance);
addTokenInterceptor(productInstance);
addTokenInterceptor(payInstance);
addResponseInterceptor(userInstance);
addResponseInterceptor(chatInstance);
addResponseInterceptor(productInstance);
addResponseInterceptor(payInstance);
