import { Box, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import AuthLayout from "../components/layout/AuthLayout";

const ForgotPasswordCompletePage = () => {
  const navigate = useNavigate();

  return (
    <AuthLayout>
      <Box
        sx={{
          minHeight: "100vh",
          backgroundColor: "background.default",
          backgroundImage: { sm: "url('/login_bg.svg')" },
          backgroundSize: { sm: "cover" },
          backgroundPosition: { sm: "center" },
          display: "flex",
          alignItems: { xs: "stretch", sm: "center" },
          justifyContent: "center",
          py: { xs: "40px", sm: "64px" },
        }}
      >
        {/* 콘텐츠 영역 */}
        <Box
          sx={{
            display: "flex",
            width: { xs: "100%", sm: "480px", lg: "940px" },
            maxWidth: { xs: "599px", sm: "none" },
            px: { xs: "16px", sm: 0 },
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {/* 카드 */}
          <Box
            sx={{
              display: "flex",
              width: { xs: "100%", sm: "480px" },
              pt: "24px",
              pb: "32px",
              px: { xs: 0, sm: "20px" },
              flexDirection: "column",
              justifyContent: "center",
              alignItems: { xs: "center", sm: "flex-start" },
              gap: "32px",
              flexShrink: 0,
              borderRadius: "12px",
              backgroundColor: "background.default",
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
                {/* 이미지 */}
                <Box
                  component="img"
                  src="/signup_complete.png"
                  alt="비밀번호 변경 완료"
                  sx={{
                    height: "161px",
                    alignSelf: "stretch",
                    borderRadius: "12px",
                    objectFit: "cover",
                  }}
                />

                {/* 글자 영역 */}
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: { xs: "center", lg: "flex-start" },
                    gap: "16px",
                    alignSelf: "stretch",
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      alignItems: { xs: "center", lg: "flex-start" },
                      gap: "4px",
                    }}
                  >
                    <Typography
                      sx={{
                        fontSize: "20px",
                        fontWeight: 600,
                        lineHeight: "30px",
                        letterSpacing: "-0.42px",
                        color: "label.normal",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        display: "-webkit-box",
                        WebkitBoxOrient: "vertical",
                        WebkitLineClamp: 1,
                      }}
                    >
                      비밀번호가 변경되었어요.
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: "16px",
                        fontWeight: 400,
                        lineHeight: "24px",
                        letterSpacing: "-0.336px",
                        color: "label.alternative",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        display: "-webkit-box",
                        WebkitBoxOrient: "vertical",
                        WebkitLineClamp: 2,
                      }}
                    >
                      다시 로그인하세요.
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Box>

            {/* 로그인 버튼 */}
            <Box
              component="button"
              onClick={() => navigate("/login")}
              sx={{
                display: "flex",
                width: { xs: "100%", sm: "440px" },
                height: "56px",
                padding: "8px 0",
                justifyContent: "space-between",
                alignItems: "center",
                borderRadius: "8px",
                backgroundColor: "label.normal",
                border: "none",
                cursor: "pointer",
              }}
            >
              <Typography
                sx={{
                  fontSize: "18px",
                  fontWeight: 600,
                  lineHeight: "29px",
                  letterSpacing: "-0.378px",
                  color: "#FAFAFC",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  display: "-webkit-box",
                  WebkitBoxOrient: "vertical",
                  WebkitLineClamp: 1,
                  flex: 1,
                  textAlign: "center",
                }}
              >
                로그인
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>
    </AuthLayout>
  );
};

export default ForgotPasswordCompletePage;
