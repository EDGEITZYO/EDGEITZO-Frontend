import { Box, Typography, Button } from "@mui/material";
import { type SxProps, type Theme } from "@mui/material/styles";
import { useNavigate, useLocation } from "react-router-dom";
import AuthLayout from "../components/layout/AuthLayout";

type SignupCompleteState = { type: "email" } | { type: "social"; name: string };

const cardSx: SxProps<Theme> = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  width: "100%",
  maxWidth: 503,
  borderRadius: "20px",
  backgroundColor: "background.default",
  p: "27px",
  gap: "10px",
};

const SignupCompletePage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as SignupCompleteState | null;

  const isEmail = !state || state.type === "email";
  const name = !isEmail && state?.type === "social" ? state.name : "";

  return (
    <AuthLayout>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          minHeight: "calc(100vh - 64px)",
          backgroundColor: "background.paper",
          paddingTop: "calc(19.6875 / 100 * (100vh - 64px))",
          paddingBottom: "calc(27.1875 / 100 * (100vh - 64px))",
        }}
      >
        <Box sx={cardSx}>
          {/* 텍스트 영역 */}
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              width: "100%",
              pt: isEmail ? "76px" : "88px",
              pb: "127px",
              px: isEmail ? "35px" : "35px",
              gap: isEmail ? "32px" : "20px",
            }}
          >
            <Typography
              sx={{
                fontSize: "24px",
                fontWeight: 600,
                lineHeight: "36px",
                letterSpacing: "-0.528px",
                color: "primary.main",
                textAlign: "center",
              }}
            >
              {isEmail ? "인증이 완료되었어요" : `${name}님 환영해요!`}
            </Typography>
            <Typography
              sx={{
                fontSize: "20px",
                fontWeight: 500,
                lineHeight: "30px",
                letterSpacing: "-0.46px",
                color: "primary.main",
                textAlign: "center",
              }}
            >
              시작하기 전, 바이옴에게 몇가지 정보를{"\n"}
              알려주시면 더욱 최적화된 탐색을 진행할 수 있어요
            </Typography>
          </Box>

          {/* 시작하기 버튼 */}
          <Button
            onClick={() => navigate("/onboarding")}
            variant="contained"
            fullWidth
            disableElevation
            sx={{
              height: 51,
              borderRadius: "12px",
              backgroundColor: "static.black",
              color: "static.white",
              fontSize: "16px",
              fontWeight: 500,
              letterSpacing: "-0.32px",
              boxShadow: "none",
              "&:hover": {
                backgroundColor: "label.neutral",
                boxShadow: "none",
              },
            }}
          >
            시작하기
          </Button>
        </Box>
      </Box>
    </AuthLayout>
  );
};

export default SignupCompletePage;
