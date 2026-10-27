import { Box, Typography } from "@mui/material";
import SignupForm from "../components/signup/SignupForm";

const SignupPage = () => {
  return (
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
        py: { xs: 0, sm: "208px", lg: "189px" },
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
          {/* BIOME 벡터 텍스트 */}
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

          {/* 소개 멘트 */}
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
        <SignupForm />
      </Box>
    </Box>
  );
};

export default SignupPage;
