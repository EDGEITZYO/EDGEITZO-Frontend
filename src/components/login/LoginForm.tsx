import { useState } from "react";
import { useForm, useWatch, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Box,
  TextField,
  Typography,
  IconButton,
  InputAdornment,
  Divider,
  CircularProgress,
} from "@mui/material";
import { type SxProps, type Theme } from "@mui/material/styles";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
import { useNavigate } from "react-router-dom";
import { authApi } from "../../api/auth";
import { useAuthStore } from "../../stores/authStore";
import axios from "axios";

const loginSchema = z.object({
  email: z
    .string()
    .min(1, "이메일을 입력해주세요")
    .check(z.email({ error: "올바른 이메일 형식이 아니에요" })),
  password: z.string().min(1, "비밀번호를 입력해주세요"),
});

type LoginFormValues = z.infer<typeof loginSchema>;
type LoginErrorType = "unregistered_email" | "wrong_password" | null;

const pillInputSx: SxProps<Theme> = {
  "& .MuiOutlinedInput-root": {
    borderRadius: "216px",
    backgroundColor: "background.default",
    fontSize: "16px",
    fontWeight: 400,
    lineHeight: "24px",
    letterSpacing: "-0.336px",
    "& fieldset": {
      borderColor: "line.normal",
      borderWidth: "1px",
    },
    "&:hover fieldset": {
      borderColor: "line.normal",
    },
    "&.Mui-focused fieldset": {
      borderColor: "line.normal",
      borderWidth: "1px",
    },
  },
  "& input": {
    padding: "16px 24px",
  },
};

const errorPillInputSx: SxProps<Theme> = {
  "& .MuiOutlinedInput-root": {
    borderRadius: "216px",
    backgroundColor: "background.default",
    fontSize: "16px",
    fontWeight: 400,
    lineHeight: "24px",
    letterSpacing: "-0.336px",
    "& fieldset": {
      borderColor: "status.negative",
      borderWidth: "1px",
    },
    "&:hover fieldset": {
      borderColor: "status.negative",
    },
    "&.Mui-focused fieldset": {
      borderColor: "status.negative",
      borderWidth: "1px",
    },
  },
  "& input": {
    padding: "16px 24px",
  },
};

const passwordPillInputSx: SxProps<Theme> = {
  "& .MuiOutlinedInput-root": {
    paddingRight: "8px",
    borderRadius: "216px",
    backgroundColor: "background.default",
    fontSize: "16px",
    fontWeight: 400,
    lineHeight: "24px",
    letterSpacing: "-0.336px",
    "& fieldset": {
      borderColor: "line.normal",
      borderWidth: "1px",
    },
    "&:hover fieldset": {
      borderColor: "line.normal",
    },
    "&.Mui-focused fieldset": {
      borderColor: "line.normal",
      borderWidth: "1px",
    },
  },
  "& input": {
    padding: "16px 24px",
  },
};

const errorPasswordPillInputSx: SxProps<Theme> = {
  "& .MuiOutlinedInput-root": {
    paddingRight: "8px",
    borderRadius: "216px",
    backgroundColor: "background.default",
    fontSize: "16px",
    fontWeight: 400,
    lineHeight: "24px",
    letterSpacing: "-0.336px",
    "& fieldset": {
      borderColor: "status.negative",
      borderWidth: "1px",
    },
    "&:hover fieldset": {
      borderColor: "status.negative",
    },
    "&.Mui-focused fieldset": {
      borderColor: "status.negative",
      borderWidth: "1px",
    },
  },
  "& input": {
    padding: "16px 24px",
  },
};

const LoginForm = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState<LoginErrorType>(null);
  const [loadingButton, setLoadingButton] = useState<
    "submit" | "google" | "kakao" | null
  >(null);
  const isLoading = loadingButton !== null;
  const { setAccessToken } = useAuthStore();

  const { register, handleSubmit, getValues, control } =
    useForm<LoginFormValues>({
      resolver: zodResolver(loginSchema),
      defaultValues: { email: "", password: "" },
      mode: "onSubmit",
    });

  const emailValue = useWatch({ control, name: "email" });
  const passwordValue = useWatch({ control, name: "password" });
  const isFormFilled = emailValue.length > 0 && passwordValue.length > 0;

  const onSubmit: SubmitHandler<LoginFormValues> = async (data) => {
    setLoginError(null);
    setLoadingButton("submit");
    try {
      const { data: tokenData } = await authApi.login(data);
      setAccessToken(tokenData.data.access_token);
      navigate("/home", { replace: true });
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response?.status === 400) {
        const detail = error.response.data?.message ?? "";
        if (detail.includes("가입되지 않은")) {
          setLoginError("unregistered_email");
        } else {
          setLoginError("wrong_password");
        }
      }
    } finally {
      setLoadingButton(null);
    }
  };

  const handleSignup = () => {
    const email = getValues("email");
    navigate("/signup", { state: { email } });
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      sx={{
        width: { xs: "100%", sm: "480px" },
        minWidth: { xs: "unset", sm: "480px" },
        height: { xs: "auto", sm: "608px" },
        minHeight: { xs: "100vh", sm: "unset" },
        pt: "24px",
        pb: "32px",
        px: { xs: "16px", sm: "20px" },
        borderRadius: { xs: 0, sm: "12px" },
        border: { xs: "none", sm: "1px solid #FAFAFC" },
        backgroundColor: "fill.normal",
        display: "flex",
        flexDirection: "column",
        justifyContent: { xs: "center", sm: "flex-end" },
        alignItems: "center",
        gap: { xs: "20px", sm: "64px" },
        flexShrink: 0,
      }}
    >
      {/* 로고 */}
      <Box
        component="img"
        src="/login_logo.svg"
        alt="Biome 로고"
        sx={{
          width: "78.298px",
          height: "66.371px",
          flexShrink: 0,
        }}
      />

      {/* 폼 하단 영역 */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "16px",
          alignSelf: "stretch",
        }}
      >
        {/* 이메일 + 비밀번호 영역 */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            gap: "12px",
            alignSelf: "stretch",
          }}
        >
          {/* 에러 텍스트 */}
          {loginError !== null && (
            <Box
              sx={{
                display: "flex",
                height: "24px",
                padding: "0 12px",
                justifyContent: "space-between",
                alignItems: "center",
                alignSelf: "stretch",
              }}
            >
              <Typography
                sx={{
                  fontSize: "13px",
                  fontWeight: 400,
                  lineHeight: "22px",
                  letterSpacing: "-0.26px",
                  color: "#D0220B",
                }}
              >
                {loginError === "unregistered_email"
                  ? "가입되지 않은 이메일 계정이에요"
                  : "비밀번호가 일치하지 않습니다."}
              </Typography>
              {loginError === "unregistered_email" && (
                <Typography
                  onClick={handleSignup}
                  sx={{
                    fontSize: "13px",
                    fontWeight: 400,
                    lineHeight: "22px",
                    letterSpacing: "-0.26px",
                    color: "#D0220B",
                    textDecoration: "underline",
                    cursor: "pointer",
                  }}
                >
                  가입하기
                </Typography>
              )}
            </Box>
          )}

          {/* 이메일 인풋 */}
          <TextField
            {...register("email")}
            placeholder="이메일 주소"
            type="email"
            autoComplete="email"
            fullWidth
            sx={
              loginError === "unregistered_email"
                ? errorPillInputSx
                : pillInputSx
            }
          />

          {/* 비밀번호 인풋 */}
          <TextField
            {...register("password")}
            placeholder="비밀번호"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            fullWidth
            sx={
              loginError === "wrong_password"
                ? errorPasswordPillInputSx
                : passwordPillInputSx
            }
            slotProps={{
              input: {
                endAdornment: (
                  <InputAdornment position="end" sx={{ gap: "4px", ml: 0 }}>
                    {passwordValue.length > 0 && (
                      <IconButton
                        onClick={() => setShowPassword((prev) => !prev)}
                        size="small"
                        aria-label={
                          showPassword ? "비밀번호 숨기기" : "비밀번호 보기"
                        }
                        sx={{
                          width: "40px",
                          height: "40px",
                          padding: "10px",
                          borderRadius: "24px",
                        }}
                      >
                        {showPassword ? (
                          <VisibilityOutlinedIcon
                            sx={{ fontSize: 20, color: "label.alternative" }}
                          />
                        ) : (
                          <VisibilityOffOutlinedIcon
                            sx={{ fontSize: 20, color: "label.alternative" }}
                          />
                        )}
                      </IconButton>
                    )}
                    {/* 제출 버튼 */}
                    <IconButton
                      type="submit"
                      disabled={isLoading}
                      sx={{
                        width: "42px",
                        height: "40px",
                        padding: "8px 9px",
                        borderRadius: "24px",
                        backgroundColor: isFormFilled
                          ? "label.normal"
                          : "label.disable",
                        "&:hover": {
                          backgroundColor: isFormFilled
                            ? "label.neutral"
                            : "label.disable",
                        },
                        "&.Mui-disabled": {
                          backgroundColor: isFormFilled
                            ? "label.normal"
                            : "label.disable",
                        },
                      }}
                    >
                      {loadingButton === "submit" ? (
                        <CircularProgress
                          size={20}
                          sx={{ color: "static.white" }}
                        />
                      ) : (
                        <ArrowForwardIcon
                          sx={{ fontSize: 24, color: "static.white" }}
                        />
                      )}
                    </IconButton>
                  </InputAdornment>
                ),
              },
            }}
          />
        </Box>

        {/* 비밀번호 잊으셨나요 */}
        <Typography
          sx={{
            fontSize: "16px",
            fontWeight: 400,
            lineHeight: "24px",
            letterSpacing: "-0.336px",
            color: "label.neutral",
            cursor: "pointer",
          }}
        >
          비밀번호를 잊으셨나요?
        </Typography>

        {/* 구분선 + 소셜 + 이메일로 시작하기 */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            gap: "20px",
            alignSelf: "stretch",
          }}
        >
          <Divider sx={{ alignSelf: "stretch", borderColor: "line.normal" }} />

          {/* 소셜 + 이메일로 시작하기 */}
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "24px",
              alignSelf: "stretch",
            }}
          >
            {/* 소셜 버튼들 */}
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                gap: "12px",
                alignSelf: "stretch",
              }}
            >
              {/* 구글 */}
              <Box
                component="button"
                type="button"
                disabled={isLoading}
                onClick={() => {
                  setLoadingButton("google");
                  window.location.href =
                    "https://accounts.google.com/o/oauth2/v2/auth?client_id=317993078634-ns5vkm8seavjpvnie4tittbmr713ahh0.apps.googleusercontent.com&redirect_uri=https://api.biomepaper.shop/api/v1/auth/google/callback&response_type=code&scope=openid%20email%20profile";
                }}
                sx={{
                  display: "flex",
                  padding: "12px 0",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: "8px",
                  alignSelf: "stretch",
                  borderRadius: "8px",
                  backgroundColor: "static.white",
                  border: "none",
                  cursor: "pointer",
                  "&:disabled": {
                    cursor: "default",
                    opacity: 0.7,
                  },
                }}
              >
                {loadingButton === "google" ? (
                  <CircularProgress size={24} sx={{ color: "label.strong" }} />
                ) : (
                  <Box
                    component="img"
                    src="/icons/google.svg"
                    alt="Google"
                    sx={{ width: 24, height: 24 }}
                  />
                )}
                <Typography
                  sx={{
                    color: "label.strong",
                    fontSize: { xs: "16px", sm: "18px" },
                    fontWeight: { xs: 400, sm: 500 },
                    lineHeight: { xs: "24px", sm: "30px" },
                    letterSpacing: { xs: "-0.336px", sm: "-0.378px" },
                  }}
                >
                  Sign in with Google
                </Typography>
              </Box>

              {/* 카카오 */}
              <Box
                component="button"
                type="button"
                disabled={isLoading}
                onClick={() => {
                  setLoadingButton("kakao");
                  window.location.href =
                    "https://kauth.kakao.com/oauth/authorize?client_id=efcaf6bea68a9c17d9069e7f168f5a25&redirect_uri=https://api.biomepaper.shop/api/v1/auth/kakao/callback&response_type=code";
                }}
                sx={{
                  display: "flex",
                  padding: "12px 0",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: "8px",
                  alignSelf: "stretch",
                  borderRadius: "8px",
                  backgroundColor: "#FFE812",
                  border: "none",
                  cursor: "pointer",
                  "&:disabled": {
                    cursor: "default",
                    opacity: 0.7,
                  },
                }}
              >
                {loadingButton === "kakao" ? (
                  <CircularProgress size={24} sx={{ color: "label.normal" }} />
                ) : (
                  <Box
                    component="img"
                    src="/icons/kakao.svg"
                    alt="카카오"
                    sx={{ width: 24, height: 24 }}
                  />
                )}
                <Typography
                  sx={{
                    color: "label.normal",
                    fontSize: { xs: "16px", sm: "18px" },
                    fontWeight: { xs: 400, sm: 500 },
                    lineHeight: { xs: "24px", sm: "30px" },
                    letterSpacing: { xs: "-0.336px", sm: "-0.378px" },
                  }}
                >
                  카카오 로그인
                </Typography>
              </Box>
            </Box>

            {/* 이메일로 시작하기 */}
            <Typography
              onClick={handleSignup}
              sx={{
                fontSize: "16px",
                fontWeight: 400,
                lineHeight: "24px",
                letterSpacing: "-0.336px",
                color: "label.strong",
                cursor: "pointer",
              }}
            >
              또는 이메일로 시작하기
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default LoginForm;
