import { create } from "zustand";

interface AuthState {
  accessToken: string | null;
  isAuthenticated: boolean;
  userName: string | null;
  userId: string | null;
  setAccessToken: (accessToken: string) => void;
  setUserName: (name: string) => void;
  setUserId: (id: string) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>()((set) => ({
  accessToken: null,
  isAuthenticated: false,
  userName: null,
  userId: null,

  setAccessToken: (accessToken: string) => {
    set({
      accessToken,
      isAuthenticated: true,
    });
  },

  setUserName: (name: string) => {
    set({ userName: name });
  },

  setUserId: (id: string) => {
    set({ userId: id });
  },

  clearAuth: () => {
    set({
      accessToken: null,
      isAuthenticated: false,
      userName: null,
      userId: null,
    });
  },
}));
