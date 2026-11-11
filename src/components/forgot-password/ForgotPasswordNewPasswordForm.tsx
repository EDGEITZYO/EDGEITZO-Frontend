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
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
import { useNavigate } from "react-router-dom";
import { authApi } from "../../api/auth";
import axios from "axios";

const passwordSchema = z.object({
  password: z
    .string()
    .min(8, "")
    .max(20, "")
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*])/, ""),
});

type PasswordFormValues = z.infer<typeof passwordSchema>;

const checkLength = (v: string) => v.length >= 8 && v.length <= 20;
const checkComplexity = (v: string) =>
  /[a-z]/.test(v) && /[A-Z]/.test(v) && /[!@#$%^&*]/.test(v);

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

interface ForgotPasswordNewPasswordFormProps {
  email: string;
}

const ForgotPasswordNewPasswordForm = ({
  email,
}: ForgotPasswordNewPasswordFormProps) => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const { register, control } = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema),
    defaultValues: { password: "" },
    mode: "onChange",
  });

  const passwordValue = useWatch({ control, name: "password" });
  const isLengthOk = checkLength(passwordValue);
  const isComplexityOk = checkComplexity(passwordValue);
  const isPasswordValid = isLengthOk && isComplexityOk;

  const handleSubmit = async () => {
    if (!isPasswordValid || isLoading) return;
    setApiError(null);
    setIsLoading(true);
    try {
      await authApi.passwordResetConfirm({
        email,
        new_password: passwordValue,
      });
      navigate("/forgot-password/complete", { replace: true });
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        setApiError("비밀번호 변경에 실패했어요. 다시 시도해주세요.");
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
        gap: { xs: "24px", sm: "32px" },
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
          비밀번호 변경
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
          {...register("password")}
          placeholder="새 비밀번호를 입력해주세요."
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
                    onClick={handleSubmit}
                    disabled={isLoading}
                    sx={{
                      width: "42px",
                      height: "40px",
                      padding: "8px 9px",
                      borderRadius: "24px",
                      backgroundColor: isPasswordValid
                        ? "label.normal"
                        : "label.disable",
                      "&:hover": {
                        backgroundColor: isPasswordValid
                          ? "label.neutral"
                          : "label.disable",
                      },
                      "&.Mui-disabled": {
                        backgroundColor: isPasswordValid
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

        {/* 체크리스트 */}
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            alignItems: { xs: "flex-start", sm: "center" },
            gap: { xs: 0, sm: "8px" },
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
                color: isComplexityOk ? "primary.dark" : "label.alternative",
              }}
            >
              대문자·소문자·특수문자를 모두 포함
            </Typography>
          </Box>
        </Box>

        {/* API 에러 */}
        {apiError !== null && (
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
                color: "#D0220B",
              }}
            >
              {apiError}
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default ForgotPasswordNewPasswordForm;
