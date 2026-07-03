import apiClient from "./client";
import type {
  ApiResponse,
  EmailCheckRequest,
  SendCodeRequest,
  VerifyCodeRequest,
  RegisterRequest,
  LoginRequest,
  ProfileRequest,
  TokenResponse,
  AuthStartResponse,
} from "../types/auth";

export const authApi = {
  checkEmail: (data: EmailCheckRequest) =>
    apiClient.post<string>("/auth/email/check", data),

  sendCode: (data: SendCodeRequest) =>
    apiClient.post<string>("/auth/email/send-code", data),

  verifyCode: (data: VerifyCodeRequest) =>
    apiClient.post<string>("/auth/email/verify-code", data),

  register: (data: RegisterRequest) =>
    apiClient.post<ApiResponse<TokenResponse>>("/auth/register", data),

  login: (data: LoginRequest) =>
    apiClient.post<ApiResponse<TokenResponse>>("/auth/login", data),

  createProfile: (data: ProfileRequest) =>
    apiClient.post<string>("/auth/profile", data),

  refresh: () => apiClient.post<TokenResponse>("/auth/refresh"),

  logout: () => apiClient.post<string>("/auth/logout"),

  start: () => apiClient.get<AuthStartResponse>("/auth/start"),

  getMe: () => apiClient.get<string>("/auth/me"),
};
