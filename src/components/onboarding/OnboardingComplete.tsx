import { Box, Typography } from "@mui/material";

interface OnboardingCompleteProps {
  onStart: () => void;
}

const OnboardingComplete = ({ onStart }: OnboardingCompleteProps) => {
  return (
    <Box
      sx={{
        display: "flex",
        width: { xs: "100%", sm: "440px" },
        flexDirection: "column",
        alignItems: "center",
        gap: "32px",
        minHeight: { xs: "100vh", sm: "auto" },
        backgroundColor: { xs: "background.default", sm: "transparent" },
        px: { xs: "16px", sm: 0 },
        justifyContent: { xs: "center", sm: "flex-start" },
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
        {/* 이미지 */}
        <Box
          component="img"
          src="/signup_complete.png"
          alt="온보딩 완료"
          sx={{
            height: "161px",
            alignSelf: "stretch",
            borderRadius: "12px",
            objectFit: "cover",
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
          width: { xs: "100%", sm: "440px" },
          height: "56px",
          padding: "8px 0",
          justifyContent: "center",
          alignItems: "center",
          borderRadius: "8px",
          backgroundColor: "label.normal",
          border: "none",
          cursor: "pointer",
        }}
      >
        <Typography
          sx={{
            fontSize: { xs: "16px", sm: "18px" },
            fontWeight: { xs: 400, sm: 600 },
            lineHeight: { xs: "24px", sm: "29px" },
            letterSpacing: { xs: "-0.336px", sm: "-0.378px" },
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
