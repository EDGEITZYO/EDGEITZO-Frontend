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
  CircularProgress,
} from "@mui/material";
import { type SxProps, type Theme } from "@mui/material/styles";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { useNavigate } from "react-router-dom";
import { authApi } from "../../api/auth";
import axios from "axios";

const emailSchema = z.object({
  email: z
    .string()
    .min(1, "이메일을 입력해주세요")
    .check(z.email({ error: "올바른 이메일 형식을 작성해주세요." })),
});

type EmailFormValues = z.infer<typeof emailSchema>;
type EmailApiError = "not_registered" | "social_account" | null;

const pillInputSx: SxProps<Theme> = {
  "& .MuiOutlinedInput-root": {
    borderRadius: "216px",
    backgroundColor: "background.default",
    fontSize: "16px",
    fontWeight: 400,
    lineHeight: "24px",
    letterSpacing: "-0.336px",
    paddingRight: "8px",
    "& fieldset": { borderColor: "line.normal", borderWidth: "1px" },
    "&:hover fieldset": { borderColor: "line.normal" },
    "&.Mui-focused fieldset": {
      borderColor: "line.normal",
      borderWidth: "1px",
    },
  },
  "& input": { padding: "16px 24px" },
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
    "& fieldset": { borderColor: "status.negative", borderWidth: "1px" },
    "&:hover fieldset": { borderColor: "status.negative" },
    "&.Mui-focused fieldset": {
      borderColor: "status.negative",
      borderWidth: "1px",
    },
  },
  "& input": { padding: "16px 24px" },
};

interface ForgotPasswordEmailFormProps {
  onNext: (email: string) => void;
}

const ForgotPasswordEmailForm = ({ onNext }: ForgotPasswordEmailFormProps) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState<EmailApiError>(null);

  const { register, control } = useForm<EmailFormValues>({
    resolver: zodResolver(emailSchema),
    defaultValues: { email: "" },
    mode: "onChange",
  });

  const emailValue = useWatch({ control, name: "email" });
  const isEmailFormatValid = z.email().safeParse(emailValue).success;

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    register("email").onChange(e);
    setApiError(null);
  };

  const handleSendCode = async () => {
    if (!isEmailFormatValid || isLoading) return;
    setApiError(null);
    setIsLoading(true);
    try {
      await authApi.passwordResetSendCode({ email: emailValue });
      onNext(emailValue);
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response?.status === 400) {
        const errorCode = error.response.data?.error_code ?? "";
        if (errorCode === "SOCIAL_ACCOUNT") {
          setApiError("social_account");
        } else {
          setApiError("not_registered");
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box
      sx={{
        width: { xs: "100%", sm: "480px" },
        minWidth: { xs: "unset", sm: "480px" },
        height: { xs: "auto", sm: "608px" },
        minHeight: { xs: "100vh", sm: "unset" },
        pt: { xs: "16px", sm: "24px" },
        pb: "32px",
        px: { xs: "16px", sm: "20px" },
        borderRadius: { xs: 0, sm: "12px" },
        border: { xs: "none", sm: "1px solid #FAFAFC" },
        backgroundColor: "fill.normal",
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        gap: { xs: "24px", sm: "54px" },
        flexShrink: 0,
      }}
    >
      {/* 헤더 */}
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
            fontSize: { xs: "18px", sm: "24px" },
            fontWeight: 600,
            lineHeight: { xs: "29px", sm: "36px" },
            letterSpacing: { xs: "-0.378px", sm: "-0.528px" },
            color: "label.normal",
          }}
        >
          비밀번호 찾기
        </Typography>
      </Box>

      {/* 인풋 영역 */}
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
          sx={apiError !== null ? errorPillInputSx : pillInputSx}
          slotProps={{
            input: {
              endAdornment: (
                <InputAdornment position="end" sx={{ gap: "4px" }}>
                  <IconButton
                    onClick={handleSendCode}
                    disabled={isLoading}
                    sx={{
                      width: "42px",
                      height: "40px",
                      padding: "8px 9px",
                      borderRadius: "24px",
                      backgroundColor: isEmailFormatValid
                        ? "label.normal"
                        : "label.disable",
                      "&:hover": {
                        backgroundColor: isEmailFormatValid
                          ? "label.neutral"
                          : "label.disable",
                      },
                      "&.Mui-disabled": {
                        backgroundColor: isEmailFormatValid
                          ? "label.normal"
                          : "label.disable",
                      },
                    }}
                  >
                    {isLoading ? (
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

        {/* API 에러 */}
        {apiError !== null && (
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
              {apiError === "social_account"
                ? "소셜 계정으로 가입된 이메일이에요."
                : "가입되지 않은 이메일이에요."}
            </Typography>
            {apiError === "not_registered" && (
              <Typography
                onClick={() => navigate("/signup")}
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
                가입하기
              </Typography>
            )}
            {apiError === "social_account" && (
              <Typography
                onClick={() => navigate("/login")}
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
            )}
          </Box>
        )}

        {/* 이메일 형식 오류 */}
        {apiError === null && emailValue.length > 0 && !isEmailFormatValid && (
          <Box
            sx={{
              display: "flex",
              height: "24px",
              padding: "0 12px",
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
                color: "label.normal",
              }}
            >
              올바른 이메일 형식을 작성해주세요.
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default ForgotPasswordEmailForm;
