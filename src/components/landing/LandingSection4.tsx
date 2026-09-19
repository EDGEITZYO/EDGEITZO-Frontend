import { useRef, useEffect } from "react";
import { Box, Typography, useTheme, useMediaQuery } from "@mui/material";
import { type SxProps, type Theme } from "@mui/material/styles";

interface LandingSection4Props {
  registerRef: (el: HTMLElement | null) => void;
}

const sectionSx: SxProps<Theme> = {
  position: "relative",
  display: "flex",
  flexDirection: { xs: "column", lg: "row" },
  justifyContent: "space-between",
  alignItems: "flex-start",
  padding: {
    xs: "60px 0 60px 16px",
    sm: "120px 0 120px 120px",
    lg: "120px 0 120px 120px",
  },
  gap: { xs: "20px", sm: "44px" },
  backgroundColor: "#0A0A0D",
  overflow: "hidden",
  minHeight: { lg: "749px" },
};

const LandingSection4 = ({ registerRef }: LandingSection4Props) => {
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

  const citationImg = isDesktop
    ? "/landing/landing_section4_citation_graph_desktop.svg"
    : isTablet
      ? "/landing/landing_section4_citation_graph_tablet.svg"
      : "/landing/landing_section4_citation_graph_mobile.svg";

  const imgHeight = isDesktop ? "auto" : isTablet ? "441px" : "270px";

  return (
    <Box ref={sectionRef} sx={sectionSx}>
      {/* 글자 묶음 */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          gap: "10px",
          flexShrink: 0,
        }}
      >
        <Typography
          sx={{
            color: "#FAFAFC",
            fontSize: { xs: "28px", sm: "44px" },
            fontWeight: 700,
            lineHeight: { xs: "42px", sm: "144%" },
            letterSpacing: { xs: "-0.728px", sm: "-1.232px" },
            whiteSpace: "pre-line",
          }}
        >
          {"논문 인용 관계를\n그래프로 한눈에 확인해요"}
        </Typography>
        <Typography
          sx={{
            color: "#FAFAFC",
            fontSize: { xs: "16px", sm: "24px" },
            fontWeight: 400,
            lineHeight: { xs: "27px", sm: "36px" },
            letterSpacing: { xs: "-0.336px", sm: "-0.576px" },
            whiteSpace: "pre-line",
          }}
        >
          {
            "읽고 있던 논문의 인용 관계를 확인하고\n연관된 논문을 추가로 불러올 수 있어요"
          }
        </Typography>
      </Box>

      {/* 이미지 */}
      <Box
        component="img"
        src={citationImg}
        alt="논문 인용 관계 그래프"
        sx={{
          position: { xs: "relative", lg: "absolute" },
          left: { lg: `calc(120px + 544px)` },
          top: { lg: "120px" },
          height: imgHeight,
          width: "auto",
        }}
      />
    </Box>
  );
};

export default LandingSection4;
