import { create } from "zustand";
import type { TokenResponse } from "../types/auth";

interface AuthState {
  accessToken: string | null;
  isAuthenticated: boolean;
  setTokens: (tokens: TokenResponse) => void;
  setAccessToken: (accessToken: string) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>()((set) => ({
  accessToken: null,
  isAuthenticated: false,

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

  clearAuth: () => {
    localStorage.removeItem("refreshToken");
    set({
      accessToken: null,
      isAuthenticated: false,
    });
  },
}));
