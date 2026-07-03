import { Box, Typography } from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import AuthLayout from "../components/layout/AuthLayout";
import { authApi } from "../api/auth";
import { useAuthStore } from "../stores/authStore";

const SignupCompletePage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as
    | { type: "email"; email: string; password: string; name: string }
    | { type: "social"; name: string }
    | null;
  const { accessToken, setAccessToken } = useAuthStore();
  const hasRegistered = useRef(false);
  const [isRegistering, setIsRegistering] = useState(
    state?.type === "email" && !accessToken,
  );

  const name = state?.name ?? "";

  useEffect(() => {
    if (!state || state.type !== "email") return;
    if (useAuthStore.getState().accessToken) {
      return;
    }
    if (!state.email || !state.password) {
      navigate("/signup", { replace: true });
      return;
    }
    if (hasRegistered.current) return;
    hasRegistered.current = true;
    const run = async () => {
      try {
        const { data } = await authApi.register({
          email: state.email,
          password: state.password,
          confirm_password: state.password,
        });
        setAccessToken(data.data.access_token);
      } catch {
        // 이미 가입된 계정일 수 있음 → 로그인 시도
        try {
          const { data } = await authApi.login({
            email: state.email,
            password: state.password,
          });
          setAccessToken(data.data.access_token);
        } catch {
          navigate("/signup", { replace: true });
        }
      } finally {
        setIsRegistering(false);
      }
    };

    run();
  }, []);

  return (
    <AuthLayout>
      <Box
        sx={{
          minHeight: "100vh",
          backgroundColor: "#ffffff",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          py: "240px",
          "@media (max-width: 599px)": {
            py: "40px",
            alignItems: "stretch",
          },
        }}
      >
        {/* 콘텐츠 영역 */}
        <Box
          sx={{
            display: "flex",
            width: "940px",
            justifyContent: "center",
            alignItems: "center",
            "@media (min-width: 600px) and (max-width: 1199px)": {
              width: "480px",
            },
            "@media (max-width: 599px)": {
              width: "100%",
              maxWidth: "599px",
              px: "16px",
            },
          }}
        >
          {/* 카드 */}
          <Box
            sx={{
              display: "flex",
              width: "480px",
              padding: "24px 20px 32px 20px",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "flex-start",
              gap: "32px",
              flexShrink: 0,
              borderRadius: "12px",
              "@media (max-width: 599px)": {
                width: "100%",
                border: "none",
                borderRadius: 0,
              },
            }}
          >
            {/* 내부 영역 */}
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "flex-start",
                gap: "32px",
                alignSelf: "stretch",
              }}
            >
              {/* 이미지 + 글자 */}
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "flex-start",
                  gap: "32px",
                  alignSelf: "stretch",
                }}
              >
                {/* 이미지 플레이스홀더 */}
                <Box
                  sx={{
                    height: "161px",
                    alignSelf: "stretch",
                    backgroundColor: "fill.strong",
                    borderRadius: "12px",
                  }}
                />

                {/* 글자 영역 */}
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "flex-start",
                    gap: "16px",
                    alignSelf: "stretch",
                    // 태블릿/모바일
                    "@media (max-width: 1199px)": {
                      alignItems: "center",
                    },
                  }}
                >
                  {/* 이름 + 환영 */}
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      alignItems: "flex-start",
                      gap: "4px",
                      // 태블릿/모바일
                      "@media (max-width: 1199px)": {
                        alignItems: "center",
                      },
                    }}
                  >
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <Typography
                        sx={{
                          fontSize: "20px",
                          fontWeight: 600,
                          lineHeight: "30px",
                          letterSpacing: "-0.42px",
                          color: "primary.dark",
                        }}
                      >
                        {name}
                      </Typography>
                      <Typography
                        sx={{
                          fontSize: "20px",
                          fontWeight: 600,
                          lineHeight: "30px",
                          letterSpacing: "-0.42px",
                          color: "label.normal",
                        }}
                      >
                        님, 환영해요!
                      </Typography>
                    </Box>

                    {/* 설명 */}
                    <Typography
                      sx={{
                        fontSize: "16px",
                        fontWeight: 400,
                        lineHeight: "24px",
                        letterSpacing: "-0.336px",
                        color: "label.alternative",
                        // 태블릿/모바일
                        "@media (max-width: 1199px)": {
                          textAlign: "center",
                        },
                      }}
                    >
                      시작하기 전, 바이옴에게 몇가지 정보를
                      <br />
                      알려주시면 더욱 최적화된 탐색을 진행할 수 있어요
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Box>

            {/* 시작하기 버튼 */}
            <Box
              component="button"
              onClick={() => {
                if (isRegistering) return;
                navigate("/onboarding");
              }}
              sx={{
                display: "flex",
                width: "440px",
                height: "56px",
                padding: "8px 0",
                justifyContent: "center",
                alignItems: "center",
                borderRadius: "8px",
                backgroundColor: "#1E2026",
                border: "none",
                cursor: isRegistering ? "default" : "pointer",
                opacity: isRegistering ? 0.5 : 1,
                // 모바일
                "@media (max-width: 599px)": {
                  width: "100%",
                },
              }}
            >
              <Typography
                sx={{
                  fontSize: "18px",
                  fontWeight: 600,
                  lineHeight: "29px",
                  letterSpacing: "-0.378px",
                  color: "#FAFAFC",
                  // 모바일
                  "@media (max-width: 599px)": {
                    fontSize: "16px",
                    fontWeight: 400,
                    lineHeight: "24px",
                    letterSpacing: "-0.336px",
                  },
                }}
              >
                시작하기
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>
    </AuthLayout>
  );
};

export default SignupCompletePage;
