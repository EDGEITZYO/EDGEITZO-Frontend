import { Box, Typography } from "@mui/material";
import { type SxProps, type Theme } from "@mui/material/styles";
import AuthLayout from "../components/layout/AuthLayout";
import LoginForm from "../components/login/LoginForm";

const headlineSx: SxProps<Theme> = {
  width: 550,
  color: "static.black",
  fontSize: "36px",
  fontWeight: 500,
  lineHeight: "160%",
  letterSpacing: "-0.72px",
  textAlign: "center",
};

const cardSx: SxProps<Theme> = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  width: 451,
  minWidth: 451,
  borderRadius: "20px",
  backgroundColor: "background.default",
  px: "35px",
  py: "27px",
};

const LoginPage = () => {
  return (
    <AuthLayout>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          minHeight: "calc(100vh - 64px)",
          backgroundColor: "background.paper",
          gap: "43px",
          paddingTop: "calc(11.875 / 100 * (100vh - 64px))",
          paddingBottom: "calc(11.77 / 100 * (100vh - 64px))",
        }}
      >
        <Typography sx={headlineSx}>
          살아 숨쉬는 연구 생태계 속에서{"\n"}나에게 핏한 논문을 빠르게
          탐색해보세요
        </Typography>
        <Box sx={cardSx}>
          <LoginForm />
        </Box>
      </Box>
    </AuthLayout>
  );
};

export default LoginPage;
