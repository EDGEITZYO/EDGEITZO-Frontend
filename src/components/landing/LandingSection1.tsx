import { useRef, useEffect } from "react";
import {
  Box,
  Typography,
  CircularProgress,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { type SxProps, type Theme } from "@mui/material/styles";

interface LandingSection1Props {
  onGuestLogin: () => void;
  isLoading: boolean;
  registerRef: (el: HTMLElement | null) => void;
}

const sectionSx: SxProps<Theme> = {
  position: "relative",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  height: { xs: "469px", sm: "618px" },
  overflow: "hidden",
  background: "linear-gradient(180deg, #0A0A0D 0%, #071500 100%)",
};

const ellipseSx: SxProps<Theme> = {
  position: "absolute",
  width: "1146.342px",
  height: "619px",
  borderRadius: "1146.342px",
  background: "rgba(45, 189, 251, 0.05)",
  filter: "blur(91.3px)",
  bottom: { xs: "38px", sm: "187px" },
  right: { xs: "-320.34px", sm: "-116.34px", lg: "219.66px" },
  pointerEvents: "none",
};

const contentSx: SxProps<Theme> = {
  position: "relative",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  zIndex: 1,
};

const buttonSx: SxProps<Theme> = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  gap: "8px",
  borderRadius: "8px",
  backgroundColor: "#3BA502",
  cursor: "pointer",
  width: { xs: "328px", sm: "371px" },
  padding: "12px 0",
  "&:hover": {
    backgroundColor: "#2d8a01",
  },
};

const LandingSection1 = ({
  onGuestLogin,
  isLoading,
  registerRef,
}: LandingSection1Props) => {
  const contentRef = useRef<HTMLDivElement | null>(null);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    if (contentRef.current) {
      registerRef(contentRef.current);
    }
  }, [registerRef]);

  return (
    <Box sx={sectionSx}>
      <Box sx={ellipseSx} />
      <Box
        component="img"
        src={
          isMobile
            ? "/landing/landing_hero_illustration_mobile.svg"
            : "/landing/landing_hero_illustration_desktop.svg"
        }
        alt="히어로 일러스트"
        sx={{
          width: { xs: "518px", sm: "1036px" },
          height: { xs: "143px", sm: "286px" },
          mt: { xs: "48px", sm: "40px" },
          position: "relative",
          zIndex: 1,
        }}
      />
      <Box
        ref={contentRef}
        sx={{
          ...contentSx,
          mt: { xs: "20px", sm: "12px" },
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <Typography
            sx={{
              color: "#FAFAFC",
              textAlign: "center",
              fontSize: { xs: "28px", sm: "36px" },
              fontWeight: 700,
              lineHeight: { xs: "42px", sm: "144%" },
              letterSpacing: { xs: "-0.728px", sm: "-1.008px" },
              whiteSpace: isMobile ? "pre-line" : "normal",
            }}
          >
            {isMobile
              ? `생명공학 논문 탐색\n시작하기`
              : "생명공학 논문 탐색 시작하기"}
          </Typography>
          <Typography
            sx={{
              color: "#D8DAE5",
              textAlign: "center",
              fontSize: { xs: "16px", sm: "20px" },
              fontWeight: { xs: 400, sm: 500 },
              lineHeight: { xs: "24px", sm: "30px" },
              letterSpacing: { xs: "-0.336px", sm: "-0.46px" },
              whiteSpace: "pre-line",
            }}
          >
            {
              "살아 숨 쉬는 연구 생태계 속에서\n나에게 핏한 논문을 빠르게 탐색해 보세요."
            }
          </Typography>
        </Box>
        <Box
          sx={{ ...buttonSx, mt: { xs: "32px", sm: "40px" } }}
          onClick={onGuestLogin}
        >
          {isLoading ? (
            <CircularProgress size={20} sx={{ color: "#fff" }} />
          ) : (
            <Typography
              sx={{
                color: "#fff",
                fontSize: "18px",
                fontWeight: 500,
                lineHeight: "30px",
                letterSpacing: "-0.378px",
              }}
            >
              게스트 로그인으로 시작
            </Typography>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default LandingSection1;
