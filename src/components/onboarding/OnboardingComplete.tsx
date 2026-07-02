import { Box, Typography, useTheme, useMediaQuery } from "@mui/material";

interface OnboardingCompleteProps {
  onStart: () => void;
}

const OnboardingComplete = ({ onStart }: OnboardingCompleteProps) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Box
      sx={{
        display: "flex",
        width: "440px",
        flexDirection: "column",
        alignItems: "center",
        gap: "32px",
        "@media (max-width: 599px)": {
          width: "100%",
        },
      }}
    >
      {/* 이미지 + 글자 */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
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

        {/* 글자 */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            gap: "16px",
            alignSelf: "stretch",
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
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
                textAlign: "center",
              }}
            >
              탐색을 위한 모든 준비가 끝났어요
              <br />
              이제 본격적으로 시작해볼까요?
            </Typography>
            <Typography
              sx={{
                fontSize: "16px",
                fontWeight: 400,
                lineHeight: "27px",
                letterSpacing: "-0.336px",
                color: "label.alternative",
                textAlign: "center",
              }}
            >
              입력하신 정보는 마이페이지에서 언제든 수정할 수 있어요
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* 시작하기 버튼 */}
      <Box
        component="button"
        onClick={onStart}
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
          cursor: "pointer",
          "@media (max-width: 599px)": {
            width: "100%",
          },
        }}
      >
        <Typography
          sx={{
            fontSize: isMobile ? "16px" : "18px",
            fontWeight: isMobile ? 400 : 600,
            lineHeight: isMobile ? "24px" : "29px",
            letterSpacing: isMobile ? "-0.336px" : "-0.378px",
            color: "#FAFAFC",
          }}
        >
          시작하기
        </Typography>
      </Box>
    </Box>
  );
};

export default OnboardingComplete;
