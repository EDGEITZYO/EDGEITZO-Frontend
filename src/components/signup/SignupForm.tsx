import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Box,
  Typography,
  TextField,
  IconButton,
  InputAdornment,
} from "@mui/material";
import { type SxProps, type Theme } from "@mui/material/styles";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import CheckIcon from "@mui/icons-material/Check";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
import { useNavigate, useLocation } from "react-router-dom";
import { authApi } from "../../api/auth";
import axios from "axios";

const signupSchema = z.object({
  email: z
    .string()
    .min(1, "이메일을 입력해주세요")
    .check(z.email({ error: "올바른 이메일 형식을 작성해주세요." })),
  password: z
    .string()
    .min(8, "")
    .max(20, "")
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*])/, ""),
  name: z.string().min(1, "이름을 입력해주세요"),
});

type SignupFormValues = z.infer<typeof signupSchema>;

const pillInputSx: SxProps<Theme> = {
  "& .MuiOutlinedInput-root": {
    borderRadius: "216px",
    backgroundColor: "background.default",
    fontSize: "16px",
    fontWeight: 400,
    lineHeight: "24px",
    letterSpacing: "-0.336px",
    paddingRight: "8px",
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
    paddingRight: "8px",
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

const checkLength = (v: string) => v.length >= 8 && v.length <= 20;
const checkComplexity = (v: string) =>
  /[a-z]/.test(v) && /[A-Z]/.test(v) && /[!@#$%^&*]/.test(v);

type EmailStatus = "idle" | "verified";

const SignupForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const prefillEmail =
    (location.state as { email?: string } | null)?.email ?? "";

  const [showPassword, setShowPassword] = useState(false);
  const [emailStatus, setEmailStatus] = useState<EmailStatus>("idle");
  const [emailApiError, setEmailApiError] = useState<string | null>(null);

  // 한 번 등장한 인풋은 계속 유지
  const [hasShownPassword, setHasShownPassword] = useState(false);
  const [hasShownName, setHasShownName] = useState(false);

  const { register, control } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: { email: prefillEmail, password: "", name: "" },
    mode: "onChange",
  });

  const emailValue = useWatch({ control, name: "email" });
  const passwordValue = useWatch({ control, name: "password" });
  const nameValue = useWatch({ control, name: "name" });

  const isEmailFormatValid = z.email().safeParse(emailValue).success;
  const isLengthOk = checkLength(passwordValue);
  const isComplexityOk = checkComplexity(passwordValue);
  const isPasswordValid = isLengthOk && isComplexityOk;

  // 이메일이 수정되면 검증 상태만 초기화 (하위 인풋은 유지)
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    register("email").onChange(e);
    if (emailStatus === "verified") {
      setEmailStatus("idle");
    }
    setEmailApiError(null);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    register("password").onChange(e);
    const next = e.target.value;
    if (checkLength(next) && checkComplexity(next)) {
      setHasShownName(true);
    }
  };

  const handleEmailCheck = async () => {
    if (!isEmailFormatValid) return;
    setEmailApiError(null);
    try {
      await authApi.checkEmail({ email: emailValue });
      setEmailStatus("verified");
      setHasShownPassword(true);
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response?.status === 400) {
        setEmailApiError("이미 가입된 이메일이에요.");
      }
    }
  };

  const handleLoginRedirect = () => {
    navigate("/login", { state: { email: emailValue } });
  };

  const showPasswordField = hasShownPassword;
  const showNameField = hasShownName;

  const isFormValid =
    emailStatus === "verified" &&
    isPasswordValid &&
    nameValue.trim().length > 0;

  const handleSubmit = () => {
    if (!isFormValid) return;
    navigate("/signup/verify", {
      state: {
        type: "email",
        email: emailValue,
        password: passwordValue,
        name: nameValue,
      },
    });
  };

  const emailSx = emailApiError ? errorPillInputSx : pillInputSx;

  return (
    <Box
      sx={{
        width: "480px",
        minWidth: "480px",
        height: "608px",
        padding: "24px 20px 32px 20px",
        borderRadius: { xs: 0, sm: "12px" },
        border: { xs: "none", sm: "1px solid #FAFAFC" },
        backgroundColor: "fill.normal",
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        gap: "54px",
        flexShrink: 0,
        "@media (max-width: 599px)": {
          width: "100%",
          minWidth: "unset",
          height: "auto",
          minHeight: "100vh",
          borderRadius: 0,
          border: "none",
          px: "16px",
        },
      }}
    >
      {/* 뒤로가기 + 제목 */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          alignSelf: "stretch",
        }}
      >
        <IconButton
          onClick={() => navigate("/login")}
          size="small"
          sx={{ p: 0 }}
          aria-label="뒤로가기"
        >
          <ChevronLeftIcon sx={{ fontSize: 28, color: "label.normal" }} />
        </IconButton>
        <Typography
          sx={{
            fontSize: "24px",
            fontWeight: 600,
            lineHeight: "36px",
            letterSpacing: "-0.528px",
            color: "label.normal",
          }}
        >
          계정 생성
        </Typography>
      </Box>

      {/* 인풋들 */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          gap: "12px",
          alignSelf: "stretch",
        }}
      >
        {/* 이름 인풋 - 가장 위, 가장 나중에 등장 */}
        {showNameField && (
          <TextField
            {...register("name")}
            placeholder="이름을 입력해주세요."
            fullWidth
            sx={pillInputSx}
            slotProps={{
              input: {
                endAdornment: (
                  <InputAdornment position="end" sx={{ gap: "4px" }}>
                    <IconButton
                      onClick={handleSubmit}
                      sx={{
                        width: "42px",
                        height: "40px",
                        padding: "8px 9px",
                        borderRadius: "24px",
                        backgroundColor: isFormValid ? "#1E2026" : "#D8DAE5",
                        "&:hover": {
                          backgroundColor: isFormValid
                            ? "label.neutral"
                            : "#D8DAE5",
                        },
                      }}
                    >
                      <ArrowForwardIcon
                        sx={{ fontSize: 24, color: "static.white" }}
                      />
                    </IconButton>
                  </InputAdornment>
                ),
              },
            }}
          />
        )}

        {/* 비밀번호 인풋 + 체크리스트 */}
        {showPasswordField && (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              gap: { xs: "8px", sm: "12px" },
              alignSelf: "stretch",
            }}
          >
            <TextField
              {...register("password")}
              onChange={handlePasswordChange}
              placeholder="비밀번호를 입력해주세요."
              type={showPassword ? "text" : "password"}
              fullWidth
              sx={pillInputSx}
              slotProps={{
                input: {
                  endAdornment: (
                    <InputAdornment position="end" sx={{ gap: "4px" }}>
                      <IconButton
                        onClick={() => setShowPassword((prev) => !prev)}
                        size="small"
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
                      <IconButton
                        sx={{
                          width: "42px",
                          height: "40px",
                          padding: "8px 9px",
                          borderRadius: "24px",
                          cursor: "default",
                          backgroundColor: "transparent",
                          "&:hover": { backgroundColor: "transparent" },
                        }}
                      >
                        <CheckIcon
                          sx={{
                            fontSize: 24,
                            color: isPasswordValid
                              ? "primary.dark"
                              : "label.disable",
                          }}
                        />
                      </IconButton>
                    </InputAdornment>
                  ),
                },
              }}
            />

            {/* 체크리스트 - 충족되면 사라짐 */}
            {!isPasswordValid && (
              <Box
                sx={{
                  display: "flex",
                  flexDirection: { xs: "column", sm: "row" },
                  alignItems: { xs: "flex-start", sm: "center" },
                  gap: { xs: "4px", sm: "8px" },
                  alignSelf: "stretch",
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: "4px" }}>
                  <Box
                    sx={{
                      width: 24,
                      height: 24,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Box
                      sx={{
                        width: 4,
                        height: 4,
                        borderRadius: "50%",
                        backgroundColor: isLengthOk
                          ? "primary.dark"
                          : "label.alternative",
                      }}
                    />
                  </Box>
                  <Typography
                    sx={{
                      fontSize: "13px",
                      fontWeight: 400,
                      lineHeight: "22px",
                      letterSpacing: "-0.26px",
                      color: isLengthOk ? "primary.dark" : "label.alternative",
                    }}
                  >
                    8자 이상·20자 이하
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: "4px" }}>
                  <Box
                    sx={{
                      width: 24,
                      height: 24,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Box
                      sx={{
                        width: 4,
                        height: 4,
                        borderRadius: "50%",
                        backgroundColor: isComplexityOk
                          ? "primary.dark"
                          : "label.alternative",
                      }}
                    />
                  </Box>
                  <Typography
                    sx={{
                      fontSize: "13px",
                      fontWeight: 400,
                      lineHeight: "22px",
                      letterSpacing: "-0.26px",
                      color: isComplexityOk
                        ? "primary.dark"
                        : "label.alternative",
                    }}
                  >
                    대문자·소문자·특수문자를 모두 포함
                  </Typography>
                </Box>
              </Box>
            )}
          </Box>
        )}

        {/* 이메일 인풋 - 항상 보임, 가장 아래로 밀림 */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            gap: "12px",
            alignSelf: "stretch",
          }}
        >
          <TextField
            {...register("email")}
            onChange={handleEmailChange}
            placeholder="이메일 주소를 입력해주세요."
            fullWidth
            sx={emailSx}
            slotProps={{
              input: {
                endAdornment: (
                  <InputAdornment position="end" sx={{ gap: "4px" }}>
                    <IconButton
                      onClick={
                        emailStatus === "verified"
                          ? undefined
                          : handleEmailCheck
                      }
                      sx={{
                        width: "42px",
                        height: "40px",
                        padding: "8px 9px",
                        borderRadius: "24px",
                        cursor:
                          emailStatus === "verified" ? "default" : "pointer",
                        backgroundColor:
                          emailStatus === "verified"
                            ? "primary.dark"
                            : isEmailFormatValid
                              ? "#1E2026"
                              : "#D8DAE5",
                        "&:hover": {
                          backgroundColor:
                            emailStatus === "verified"
                              ? "primary.dark"
                              : isEmailFormatValid
                                ? "label.neutral"
                                : "#D8DAE5",
                        },
                      }}
                    >
                      {emailStatus === "verified" ? (
                        <CheckIcon
                          sx={{ fontSize: 24, color: "static.white" }}
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

          {/* 에러 - 인풋 아래 */}
          {emailApiError && (
            <Box
              sx={{
                display: "flex",
                height: "24px",
                padding: "0 12px",
                alignItems: "center",
                gap: "8px",
                alignSelf: "stretch",
              }}
            >
              <Typography
                sx={{
                  fontSize: "13px",
                  fontWeight: 400,
                  lineHeight: "22px",
                  letterSpacing: "-0.26px",
                  color: "label.normal",
                }}
              >
                {emailApiError}
              </Typography>
              <Typography
                onClick={handleLoginRedirect}
                sx={{
                  fontSize: "13px",
                  fontWeight: 400,
                  lineHeight: "22px",
                  letterSpacing: "-0.26px",
                  color: "label.normal",
                  textDecoration: "underline",
                  cursor: "pointer",
                }}
              >
                로그인하기
              </Typography>
            </Box>
          )}
          {!emailApiError && emailValue.length > 0 && !isEmailFormatValid && (
            <Box
              sx={{
                display: "flex",
                height: "24px",
                padding: "0 12px",
                alignItems: "center",
                gap: "10px",
                alignSelf: "stretch",
              }}
            >
              <Typography
                sx={{
                  fontSize: "13px",
                  fontWeight: 400,
                  lineHeight: "22px",
                  letterSpacing: "-0.26px",
                  color: "label.normal",
                }}
              >
                올바른 이메일 형식을 작성해주세요.
              </Typography>
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default SignupForm;
