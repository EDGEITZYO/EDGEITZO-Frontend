import { useState, useEffect, useRef } from "react";
import {
  Box,
  Typography,
  IconButton,
  InputAdornment,
  TextField,
} from "@mui/material";
import { type SxProps, type Theme } from "@mui/material/styles";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import { useNavigate } from "react-router-dom";
import { authApi } from "../../api/auth";
import axios from "axios";

const RESEND_COOLDOWN = 30;

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

interface SignupVerifyFormProps {
  email: string;
  state: { email: string; password: string; name: string };
}

const SignupVerifyForm = ({ email, state }: SignupVerifyFormProps) => {
  const navigate = useNavigate();
  const [code, setCode] = useState("");
  const [verifyError, setVerifyError] = useState<
    "wrong_code" | "expired" | null
  >(null);
  const [cooldown, setCooldown] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const hasSentCode = useRef(false);

  useEffect(() => {
    if (hasSentCode.current) return;
    hasSentCode.current = true;
    authApi.sendCode({ email }).catch(() => {});
  }, []);

  useEffect(() => {
    if (cooldown <= 0) return;
    timerRef.current = setInterval(() => {
      setCooldown((prev) => {
        if (prev <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [cooldown]);

  const handleVerify = async () => {
    if (!code) return;
    try {
      await authApi.verifyCode({ email, code });
      navigate("/signup/complete", { state: { type: "email", ...state } });
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response?.status === 400) {
        const message = error.response.data?.message ?? "";
        if (message.includes("만료")) {
          setVerifyError("expired");
        } else {
          setVerifyError("wrong_code");
        }
      }
    }
  };

  const handleResend = async () => {
    if (cooldown > 0) return;
    setCooldown(RESEND_COOLDOWN);
    setVerifyError(null);
    try {
      await authApi.sendCode({ email });
    } catch {
      // 재발송 실패 시 별도 처리 없음
    }
  };

  return (
    <Box
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
        alignItems: "flex-start",
        gap: { xs: "32px", sm: "54px" },
        flexShrink: 0,
      }}
    >
      {/* 헤더 */}
      <Box sx={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <IconButton
          onClick={() => navigate("/signup")}
          size="small"
          sx={{ p: 0 }}
          aria-label="뒤로가기"
        >
          <ChevronLeftIcon sx={{ fontSize: 24, color: "label.normal" }} />
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
          이메일 인증
        </Typography>
      </Box>

      {/* 하단 컨텐츠 */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          alignItems: "center",
          alignSelf: "stretch",
          flexShrink: 0,
          flexGrow: 1,
        }}
      >
        {/* 중간 영역 */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            gap: "24px",
            alignSelf: "stretch",
          }}
        >
          {/* 이메일 뱃지 + 설명 + 이미지 */}
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              gap: "16px",
              alignSelf: "stretch",
            }}
          >
            {/* 이메일 뱃지 + 설명 */}
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                gap: "16px",
                alignSelf: "stretch",
              }}
            >
              {/* 이메일 뱃지 */}
              <Box
                sx={{
                  display: "flex",
                  padding: "8px 24px 8px 20px",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: "10px",
                  borderRadius: "98px",
                  background:
                    "linear-gradient(0deg, rgba(0, 0, 0, 0.20) 0%, rgba(0, 0, 0, 0.20) 100%), #03C26C",
                }}
              >
                <EmailOutlinedIcon
                  sx={{ width: 24, height: 24, color: "#FAFAFC" }}
                />
                <Typography
                  sx={{
                    fontSize: "18px",
                    fontWeight: 600,
                    lineHeight: "29px",
                    letterSpacing: "-0.378px",
                    color: "#FAFAFC",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {email}
                </Typography>
              </Box>

              {/* 설명 */}
              <Box
                sx={{
                  display: "flex",
                  height: "52px",
                  paddingLeft: "8px",
                  flexDirection: "column",
                  alignItems: "flex-start",
                  gap: "4px",
                }}
              >
                <Typography
                  sx={{
                    fontSize: "16px",
                    fontWeight: 400,
                    lineHeight: "24px",
                    letterSpacing: "-0.336px",
                    color: "label.normal",
                  }}
                >
                  위의 주소로 전송된 인증코드를 입력해주세요.
                </Typography>
                <Typography
                  sx={{
                    fontSize: "16px",
                    fontWeight: 400,
                    lineHeight: "24px",
                    letterSpacing: "-0.336px",
                    color: "label.alternative",
                  }}
                >
                  인증코드는 15분간 유효해요.
                </Typography>
              </Box>
            </Box>
          </Box>

          {/* 인증코드 입력 영역 */}
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              gap: "12px",
              alignSelf: "stretch",
            }}
          >
            {/* 인증코드 인풋 */}
            <TextField
              value={code}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setCode(e.target.value);
                setVerifyError(null);
              }}
              placeholder="인증 코드 입력"
              fullWidth
              sx={verifyError ? errorPillInputSx : pillInputSx}
              slotProps={{
                input: {
                  endAdornment: (
                    <InputAdornment position="end" sx={{ gap: "4px" }}>
                      <IconButton
                        onClick={handleVerify}
                        sx={{
                          width: "42px",
                          height: "40px",
                          padding: "8px 9px",
                          borderRadius: "24px",
                          backgroundColor:
                            code.length > 0 ? "label.normal" : "label.disable",
                          "&:hover": {
                            backgroundColor:
                              code.length > 0
                                ? "label.neutral"
                                : "label.disable",
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

            {/* 에러 */}
            {verifyError !== null && (
              <Box
                sx={{
                  display: "flex",
                  height: "24px",
                  padding: "0 8px 0 12px",
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
                  {verifyError === "expired"
                    ? "인증코드가 만료되었어요."
                    : "올바른 인증 코드를 입력해주세요."}
                </Typography>
                {verifyError === "expired" ? (
                  <Typography
                    onClick={handleResend}
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
                    다시 전송하기
                  </Typography>
                ) : (
                  <Typography
                    onClick={() => navigate("/signup")}
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
                    이메일 변경하기
                  </Typography>
                )}
              </Box>
            )}
          </Box>
        </Box>

        {/* 최하단 */}
        <Box
          sx={{
            display: "flex",
            padding: "0 8px",
            justifyContent: "flex-end",
            alignItems: "center",
            gap: "8px",
            alignSelf: "stretch",
          }}
        >
          <Typography
            sx={{
              fontSize: "16px",
              fontWeight: 400,
              lineHeight: "24px",
              letterSpacing: "-0.336px",
              color: "label.strong",
            }}
          >
            코드를 받지 못하셨나요?
          </Typography>
          <Typography
            onClick={handleResend}
            sx={{
              fontSize: "16px",
              fontWeight: 400,
              lineHeight: "24px",
              letterSpacing: "-0.336px",
              color: "label.strong",
              textDecoration: "underline",
              cursor: cooldown > 0 ? "default" : "pointer",
              opacity: cooldown > 0 ? 0.4 : 1,
            }}
          >
            다시 전송하기{cooldown > 0 ? ` (${cooldown}s)` : ""}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default SignupVerifyForm;
