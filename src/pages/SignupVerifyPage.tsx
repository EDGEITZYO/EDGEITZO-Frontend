import { Box, Typography } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import AuthLayout from "../components/layout/AuthLayout";
import SignupVerifyForm from "../components/signup/SignupVerifyForm";

const SignupVerifyPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as {
    email?: string;
    password?: string;
    name?: string;
  } | null;

  if (!state?.email) {
    navigate("/signup", { replace: true });
    return null;
  }

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
          py: { xs: 0, sm: "64px" }
        }}
      >
        <Box
          sx={{
            display: "flex",
            width: { xs: "100%", sm: "480px", lg: "940px" },
            maxWidth: { xs: "599px", sm: "none" },
          }}
        >
          {/* 왼쪽 텍스트 영역 - 데스크탑만 */}
          <Box
            sx={{
              display: { xs: "none", sm: "none", lg: "flex" },
              flex: 1,
              minHeight: "608px",
              borderRadius: "12px 0 0 12px",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "flex-start",
              gap: "24px",
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: "12.208px",
                alignSelf: "stretch",
              }}
            >
              <Box
                component="img"
                src="/login_biome_text.svg"
                alt="BIOME"
                sx={{
                  width: "253.065px",
                  height: "60.988px",
                  flexShrink: 0,
                }}
              />
            </Box>
            <Typography
              sx={{
                color: "#FAFFF8",
                fontSize: "18px",
                fontWeight: 500,
                lineHeight: "30px",
                letterSpacing: "-0.378px",
              }}
            >
              살아 숨쉬는 연구 생태계 속에서
              <br />
              나에게 핏한 논문을 빠르게 탐색해보세요.
            </Typography>
          </Box>

          {/* 오른쪽 카드 */}
          <SignupVerifyForm
            email={state.email}
            state={{
              email: state.email,
              password: state.password ?? "",
              name: state.name ?? "",
            }}
          />
        </Box>
      </Box>
    </AuthLayout>
  );
};

export default SignupVerifyPage;
