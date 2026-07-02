import { Box } from "@mui/material";
import LoginForm from "../components/login/LoginForm";

const LoginPage = () => {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: "#ffffff",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        py: "189px",
        // 태블릿
        "@media (min-width: 600px) and (max-width: 1199px)": {
          py: "208px",
        },
        // 모바일
        "@media (max-width: 599px)": {
          py: 0,
          alignItems: "stretch",
        },
      }}
    >
      <Box
        sx={{
          display: "flex",
          width: "940px",
          // 태블릿
          "@media (min-width: 600px) and (max-width: 1199px)": {
            width: "480px",
          },
          // 모바일
          "@media (max-width: 599px)": {
            width: "100%",
            maxWidth: "599px",
          },
        }}
      >
        {/* 왼쪽 이미지 영역 - 데스크탑만 */}
        <Box
          sx={{
            display: { xs: "none", sm: "none", lg: "flex" },
            flex: 1,
            minHeight: "608px",
            borderRadius: "12px 0 0 12px",
          }}
        />

        {/* 오른쪽 카드 */}
        <LoginForm />
      </Box>
    </Box>
  );
};

export default LoginPage;
