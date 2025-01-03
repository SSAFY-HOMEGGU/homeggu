import axios from "axios";

// 1. 로그인용 axios instance (8084 포트, 토큰 불필요)
export const authInstance = axios.create({
  baseURL: "https://k11b206.p.ssafy.io/api/user",
  timeout: 5000000,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// 2. 유저 관련 API용 axios instance (8084 포트, 토큰 필요)
export const userInstance = axios.create({
  baseURL: "https://k11b206.p.ssafy.io/api/user",
  timeout: 5000000,
  headers: {
    "Content-Type": "application/json",
    "userId" : "11007"
  },
  withCredentials: true,
});

// 3. 채팅 API용 axios instance (8080 포트, 토큰 필요)
export const chatInstance = axios.create({
  baseURL: "https://k11b206.p.ssafy.io/api/",
  timeout: 5000000,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    "userId" : "11007"
  },
});

// 4. 상품 API용 axios instance (8082 포트, 토큰 필요)
export const productInstance = axios.create({
  baseURL: "https://k11b206.p.ssafy.io/api/goods",
  timeout: 5000000,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    "userId" : "11007"
  },
});

// 5. 페이 API용 axios instance (8081 포트, 토큰 필요)
export const payInstance = axios.create({
  baseURL: "https://k11b206.p.ssafy.io/api/pay",
  timeout: 5000000,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    "userId" : "11007"
  },
});

// 토큰 인터셉터 함수
const addTokenInterceptor = (instance) => {
  instance.interceptors.request.use(
    (config) => {
      // const accessToken = localStorage.getItem("accessToken");
      const accessToken = sessionStorage.getItem("accessToken");
      console.log('Interceptor token:', accessToken);
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
          const refreshToken = sessionStorage.getItem("refreshToken");
          const response = await authInstance.post("/api/auth/refresh", {
            refreshToken,
          });
          const newToken = response.data.accessToken;

          sessionStorage.setItem("accessToken", newToken);
          originalRequest.headers.Authorization = `Bearer ${newToken}`;

          return instance(originalRequest);
        } catch (refreshError) {
          sessionStorage.removeItem("accessToken");
          sessionStorage.removeItem("refreshToken");
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
