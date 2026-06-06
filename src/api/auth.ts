import apiClient from "./client";
import type {
  EmailCheckRequest,
  SendCodeRequest,
  VerifyCodeRequest,
  RegisterRequest,
  LoginRequest,
  ProfileRequest,
  RefreshRequest,
  LogoutRequest,
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
    apiClient.post<TokenResponse>("/auth/register", data),

  login: (data: LoginRequest) =>
    apiClient.post<TokenResponse>("/auth/login", data),

  createProfile: (data: ProfileRequest) =>
    apiClient.post<string>("/auth/profile", data),

  refresh: (data: RefreshRequest) =>
    apiClient.post<TokenResponse>("/auth/refresh", data),

  logout: (data: LogoutRequest) => apiClient.post<string>("/auth/logout", data),

  start: () => apiClient.get<AuthStartResponse>("/auth/start"),
};
