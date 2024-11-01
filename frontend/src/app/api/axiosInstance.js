import axios from 'axios';

// 1. 로그인용 axios instance (8084 포트, 토큰 불필요)
export const authInstance = axios.create({
    baseURL: 'http://localhost:8084',
    timeout: 5000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// 2. 유저 관련 API용 axios instance (8084 포트, 토큰 필요)
export const userInstance = axios.create({
    baseURL: 'http://localhost:8084',
    timeout: 5000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// 3. 기본 API용 axios instance (8080 포트, 토큰 필요)
export const chatInstance = axios.create({
    baseURL: 'http://localhost:8083',
    timeout: 5000,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    },
});

// 1. 요청이 서버로 전송되기 전에 실행
// 2. 로컬에서 accessToken 가져옴
// 3. 모든 요청에 의해 헤더에 자동으로 Bearer토큰 추가
const addTokenInterceptor = (instance) => {
    instance.interceptors.request.use(
        (config) => {
            const accessToken = localStorage.getItem('accessToken');
            if (accessToken) {
                config.headers.Authorization = `Bearer ${accessToken}`;
            }
            return config;
        },
        (error) => {
            return Promise.reject(error);
        }
    );
};

// 1. 서버로 응답이 돌아온 후에 실행
// 2. 토큰 만료로인한 401에러 처리
// 3. 자동으로 리프레시 토큰 사용해 새로운 액세스 토큰 발큽
// 4. 리프레시 토큰 만료 시 로그인 페이지로 이동
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
                    // 리프레시 토큰으로 새로운 액세스 토큰 발급
                    const refreshToken = localStorage.getItem('refreshToken');
                    const response = await authInstance.post('/api/auth/refresh', { refreshToken });
                    const newToken = response.data.accessToken;

                    localStorage.setItem('accessToken', newToken);
                    originalRequest.headers.Authorization = `Bearer ${newToken}`;

                    return instance(originalRequest);
                } catch (refreshError) {
                    localStorage.removeItem('accessToken');
                    localStorage.removeItem('refreshToken');
                    window.location.href = '/login';
                    return Promise.reject(refreshError);
                }
            }

            return Promise.reject(error);
        }
    );
};

// 토큰이 필요한 instance들에만 interceptor 적용
addTokenInterceptor(userInstance);
addTokenInterceptor(chatInstance);
addResponseInterceptor(userInstance);
addResponseInterceptor(chatInstance);