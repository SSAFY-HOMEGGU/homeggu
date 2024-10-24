import { create } from 'zustand';

// Zustand 스토어 생성
const useUserStore = create((set) => ({
  user: {
    name: '',
    nickname: '',
    phone: '',
    address: '',
    isLoggedIn: false,
  },
  // 사용자 정보 업데이트 함수
  updateUser: (newInfo) => set((state) => ({
    user: {
      ...state.user,
      ...newInfo, // 새로운 정보로 업데이트
    }
  })),
  // 로그인 상태 업데이트 함수
  setLoginStatus: (status) => set((state) => ({
    user: {
      ...state.user,
      isLoggedIn: status,
    }
  })),
}));

export default useUserStore;
