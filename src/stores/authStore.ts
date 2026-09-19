import { create } from "zustand";

interface AuthState {
  accessToken: string | null;
  isAuthenticated: boolean;
  isGuest: boolean;
  setAccessToken: (accessToken: string) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>()((set) => ({
  accessToken: null,
  isAuthenticated: false,
  isGuest: false,

  setAccessToken: (accessToken: string) => {
    let isGuest = false;
    try {
      const payload = JSON.parse(atob(accessToken.split(".")[1])) as {
        guest?: boolean;
      };
      isGuest = payload.guest === true;
    } catch {
      // 파싱 실패 시 기본값 false 유지
    }
    set({ accessToken, isAuthenticated: true, isGuest });
  },

  clearAuth: () => {
    set({ accessToken: null, isAuthenticated: false, isGuest: false });
  },
}));
