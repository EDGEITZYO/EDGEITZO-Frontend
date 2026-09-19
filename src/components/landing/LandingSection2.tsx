import { useRef, useEffect } from "react";
import { Box, Typography, useTheme, useMediaQuery } from "@mui/material";
import { type SxProps, type Theme } from "@mui/material/styles";

interface LandingSection2Props {
  registerRef: (el: HTMLElement | null) => void;
}

const sectionSx: SxProps<Theme> = {
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-start",
  gap: { xs: "20px", sm: "32px", lg: "60px" },
  padding: {
    xs: "60px 16px",
    sm: "112px 120px 136px 120px",
    lg: "112px 120px 136px 120px",
  },
  backgroundColor: "#0A0A0D",
};

const topFrameSx: SxProps<Theme> = {
  display: "flex",
  flexDirection: { xs: "column", lg: "row" },
  justifyContent: { xs: "flex-start", lg: "space-between" },
  alignItems: { xs: "flex-start", lg: "flex-end" },
  gap: { xs: "44px", lg: "0" },
  alignSelf: "stretch",
};

const cardSx: SxProps<Theme> = {
  display: "flex",
  padding: "32px 36px",
  flexDirection: "column",
  alignItems: "flex-start",
  gap: "10px",
  alignSelf: "stretch",
  borderRadius: "12px",
  backgroundColor: "#131419",
};

const LandingSection2 = ({ registerRef }: LandingSection2Props) => {
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

  const aiSearchImg = isDesktop
    ? "/landing/landing_section2_ai_search_desktop.svg"
    : isTablet
      ? "/landing/landing_section2_ai_search_tablet.svg"
      : "/landing/landing_section2_ai_search_mobile.svg";

  const keywordSearchImg = isDesktop
    ? "/landing/landing_section2_keyword_search_desktop.svg"
    : isTablet
      ? "/landing/landing_section2_keyword_search_tablet.svg"
      : "/landing/landing_section2_keyword_search_mobile.svg";

  const cards = [
    {
      title: "막막한 논문 탐색은 바이옴 AI와 함께",
      description:
        "어떤 논문을 찾아야 할지 막막할 때는\n바이옴에게 질문하며 탐색하기",
      img: aiSearchImg,
      imgAlt: "AI 검색 화면",
    },
    {
      title: "연구 분야 키워드 찾기는 키워드 검색",
      description:
        "잘 모르는 연구 분야는 키워드 탐색으로\n딱 맞는 검색 키워드 찾고 관련 논문까지 한 번에",
      img: keywordSearchImg,
      imgAlt: "키워드 검색 화면",
    },
  ];

  return (
    <Box ref={sectionRef} sx={sectionSx}>
      <Box sx={topFrameSx}>
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
          {"효율적인 논문 탐색을\n바이옴이 도와드려요"}
        </Typography>
        <Box
          sx={{
            display: "flex",
            width: { xs: "100%", sm: "338px" },
            flexDirection: "column",
            alignItems: "flex-start",
            gap: "11px",
          }}
        >
          <Box
            sx={{
              width: "32px",
              height: "32px",
              borderRadius: "4.141px",
              backgroundColor: "#163E01",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Box
              component="img"
              src="/landing/landing_star_icon.svg"
              alt="별 아이콘"
              sx={{ width: "22.1px", height: "22.1px" }}
            />
          </Box>
          <Typography
            sx={{
              alignSelf: "stretch",
              color: "#FAFAFC",
              fontSize: { xs: "20px", sm: "24px" },
              fontWeight: { xs: 600, sm: 500 },
              lineHeight: { xs: "30px", sm: "36px" },
              letterSpacing: { xs: "-0.42px", sm: "-0.576px" },
              whiteSpace: "pre-line",
            }}
          >
            {"논문 탐색 목적에 따라\n2가지 검색 방식을 유연하게 사용하기"}
          </Typography>
        </Box>
      </Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", lg: "row" },
          alignItems: "center",
          gap: "24px",
          alignSelf: "stretch",
        }}
      >
        {cards.map((card) => (
          <Box
            key={card.title}
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              gap: { xs: "16px", sm: "24px" },
              flex: { xs: "none", lg: "1 0 0" },
              alignSelf: { xs: "stretch", lg: "stretch" },
            }}
          >
            <Box sx={cardSx}>
              <Typography
                sx={{
                  alignSelf: "stretch",
                  color: "#FAFAFC",
                  fontSize: { xs: "24px", sm: "28px" },
                  fontWeight: { xs: 600, sm: 700 },
                  lineHeight: { xs: "36px", sm: "42px" },
                  letterSpacing: { xs: "-0.528px", sm: "-0.728px" },
                }}
              >
                {card.title}
              </Typography>
              <Typography
                sx={{
                  alignSelf: "stretch",
                  color: "#D8DAE5",
                  fontSize: { xs: "16px", sm: "20px" },
                  fontWeight: { xs: 400, sm: 500 },
                  lineHeight: { xs: "27px", sm: "30px" },
                  letterSpacing: { xs: "-0.336px", sm: "-0.46px" },
                  whiteSpace: "pre-line",
                }}
              >
                {card.description}
              </Typography>
            </Box>
            <Box
              component="img"
              src={card.img}
              alt={card.imgAlt}
              sx={{
                width: "100%",
                height: "auto",
                borderRadius: "12px",
              }}
            />
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default LandingSection2;
