import { useRef, useEffect } from "react";
import { Box, Typography, useTheme, useMediaQuery } from "@mui/material";
import { type SxProps, type Theme } from "@mui/material/styles";

interface LandingSection3Props {
  registerRef: (el: HTMLElement | null) => void;
}

const sectionSx: SxProps<Theme> = {
  position: "relative",
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-end",
  gap: { xs: "40px", sm: "60px" },
  padding: { xs: "80px 0", sm: "80px 0" },
  backgroundColor: "#3BA502",
  overflow: "hidden",
};

const LandingSection3 = ({ registerRef }: LandingSection3Props) => {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("lg"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "lg"));
  const sectionRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (sectionRef.current) {
      sectionRef.current.classList.add("fade-in-target");
      registerRef(sectionRef.current);
    }
  }, [registerRef]);

  const chartViewImg = isDesktop
    ? "/landing/landing_section3_chart_view_desktop.svg"
    : isTablet
      ? "/landing/landing_section3_chart_view_tablet.svg"
      : "/landing/landing_section3_chart_view_mobile.svg";

  const listViewImg = isDesktop
    ? "/landing/landing_section3_list_view_desktop.svg"
    : isTablet
      ? "/landing/landing_section3_list_view_tablet.svg"
      : "/landing/landing_section3_list_view_mobile.svg";

  return (
    <Box ref={sectionRef} sx={sectionSx}>
      {/* 배경 SVG */}
      <Box
        component="img"
        src="/landing/landing_section3_bg_shape.svg"
        alt=""
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          pointerEvents: "none",
        }}
      />

      {/* 글자 묶음 */}
      <Box
        sx={{
          display: "flex",
          padding: { xs: "0 16px", sm: "0 15.6%", lg: "0 120px" },
          flexDirection: "column",
          alignItems: "center",
          gap: "10px",
          alignSelf: "stretch",
          position: "relative",
          zIndex: 1,
        }}
      >
        <Typography
          sx={{
            alignSelf: "stretch",
            color: "#FAFAFC",
            textAlign: "center",
            fontSize: { xs: "28px", sm: "44px" },
            fontWeight: 700,
            lineHeight: { xs: "42px", sm: "144%" },
            letterSpacing: { xs: "-0.728px", sm: "-1.232px" },
            whiteSpace: isDesktop ? "normal" : "pre-line",
          }}
        >
          {isDesktop
            ? "논문 탐색하다 길을 잃을 걱정 NO!"
            : "논문 탐색하다 길을 잃을 걱정\nNO!"}
        </Typography>
        <Typography
          sx={{
            alignSelf: "stretch",
            color: "#FAFAFC",
            textAlign: "center",
            fontSize: { xs: "16px", sm: "24px" },
            fontWeight: 400,
            lineHeight: { xs: "24px", sm: "36px" },
            letterSpacing: { xs: "-0.336px", sm: "-0.576px" },
            whiteSpace: "pre-line",
          }}
        >
          {"바이옴은 사용자가 탐색한 경로를\n꼬박꼬박 저장하고 분석해요"}
        </Typography>
      </Box>

      {/* 이미지 묶음 */}
      <Box
        sx={{
          display: "flex",
          padding: { xs: "0 16px", sm: "0 120px", lg: "0 120px" },
          flexDirection: { xs: "column", sm: "column", lg: "row" },
          justifyContent: "center",
          alignItems: { xs: "center", sm: "center", lg: "flex-start" },
          gap: "30px",
          alignSelf: "stretch",
          position: "relative",
          zIndex: 1,
        }}
      >
        <Box
          component="img"
          src={chartViewImg}
          alt="키워드맵 그래프뷰"
          sx={{
            width: { xs: "328px", sm: "528px", lg: "auto" },
            height: { xs: "229px", sm: "369px", lg: "auto" },
            flex: { lg: "1 0 0" },
            borderRadius: "12px",
          }}
        />
        <Box
          component="img"
          src={listViewImg}
          alt="최근 읽은 논문 리스트뷰"
          sx={{
            width: { xs: "328px", sm: "528px", lg: "auto" },
            height: { xs: "229px", sm: "369px", lg: "auto" },
            flex: { lg: "1 0 0" },
            borderRadius: "12px",
          }}
        />
      </Box>
    </Box>
  );
};

export default LandingSection3;
