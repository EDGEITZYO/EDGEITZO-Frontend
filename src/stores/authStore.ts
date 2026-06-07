import { create } from "zustand";
import type { TokenResponse } from "../types/auth";

interface AuthState {
  accessToken: string | null;
  isAuthenticated: boolean;
  userName: string | null;
  setTokens: (tokens: TokenResponse) => void;
  setAccessToken: (accessToken: string) => void;
  setUserName: (name: string) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>()((set) => ({
  accessToken: null,
  isAuthenticated: false,
  userName: null,

  setTokens: (tokens: TokenResponse) => {
    localStorage.setItem("refreshToken", tokens.refresh_token);
    set({
      accessToken: tokens.access_token,
      isAuthenticated: true,
    });
  },

  setAccessToken: (accessToken: string) => {
    set({
      accessToken,
      isAuthenticated: true,
    });
  },

  setUserName: (name: string) => {
    set({ userName: name });
  },

  clearAuth: () => {
    localStorage.removeItem("refreshToken");
    set({
      accessToken: null,
      isAuthenticated: false,
      userName: null,
    });
  },
}));
