export interface TokenResponse {
  access_token: string;
  token_type: "bearer";
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface AuthStartResponse {
  authenticated: boolean;
  next_route: string;
  user_id: string;
}

// POST /auth/email/check
export interface EmailCheckRequest {
  email: string;
}

// POST /auth/email/send-code
export interface SendCodeRequest {
  email: string;
}

// POST /auth/email/verify-code
export interface VerifyCodeRequest {
  email: string;
  code: string;
}

// POST /auth/register
export interface RegisterRequest {
  email: string;
  password: string;
  confirm_password: string;
}

// POST /auth/login
export interface LoginRequest {
  email: string;
  password: string;
}

// POST /auth/profile
export interface ProfileRequest {
  name: string;
  gender: "남성" | "여성" | "선택 안함";
  age: string;
  role: string;
  research_field: string;
  purposes: string[];
  purpose_custom?: string;
}
