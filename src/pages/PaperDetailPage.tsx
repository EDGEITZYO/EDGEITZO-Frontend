import { useNavigate, useSearchParams } from "react-router-dom";
import { Box, Typography, IconButton } from "@mui/material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import { type SxProps, type Theme } from "@mui/material/styles";
import Header from "../components/layout/Header";
import PaperDetailContent from "../components/common/PaperDetailContent";
import { type PaperDetail } from "../types/paper";

// TODO: API 연동 시 useParams로 id 받아서 fetch
const MOCK_PAPER_DETAIL: PaperDetail = {
  id: "1",
  source: "한국분자세포생물학회 2024년도 춘계학술대회",
  date: "2024.03.12",
  title: "미토콘드리아 막전위 손실이 세포 노화 유도에 미치는 영향 분석",
  authors: ["김수진", "김철수", "이영희", "박민준"],
  keywords: [
    "세포 노화",
    "미토콘드리아",
    "막전위",
    "ROS",
    "SASP",
    "p53 경로",
  ],
  kciType: "KCI O",
  citationCount: 12,
  isBookmarked: false,
  paperType: '학위논문',
  abstract:
    "세포 노화(cellular senescence)는 비가역적 세포 주기 정지 상태로, 미토콘드리아 기능 저하와 밀접하게 연관되어 있다. 본 연구는 미토콘드리아 막전위 손실이 ROS 축적을 통해 p53-p21 경로를 활성화하고 노화를 유도하는 기전을 규명하였다.",
  relatedPapers: [
    {
      id: "r1",
      source: "2024한국분자세포생물학회 논문지",
      date: "2024.03.12",
      title: "미토콘드리아 기능 저하와 세포 노화 신호 전달 경로 연구",
      authors: ["김수진", "김철수", "이영희", "박민준"],
      keywords: ["논문 키워드", "논문 키워드"],
      kciType: "KCI O",
      citationCount: 0,
      isBookmarked: false,
    },
    {
      id: "r2",
      source: "2023생화학분자생물학회",
      date: "2023.09.20",
      title: "SASP 구성 인자 분석을 통한 노화 세포 마커 발굴",
      authors: ["박지현", "김철수", "이영희", "박민준"],
      keywords: ["논문 키워드", "논문 키워드"],
      kciType: "KCI O",
      citationCount: 0,
      isBookmarked: false,
    },
    {
      id: "r3",
      source: "2023한국노화학회지",
      date: "2023.06.15",
      title: "노화 유도 조건에서 미토콘드리아 생합성 억제 기전",
      authors: ["이민재", "김철수", "이영희", "박민준"],
      keywords: ["논문 키워드", "논문 키워드"],
      kciType: "KCI O",
      citationCount: 0,
      isBookmarked: false,
    },
    {
      id: "r4",
      source: "2022분자생물학회보",
      date: "2022.12.01",
      title: "세포 노화와 자가포식(autophagy) 간 상호작용 연구",
      authors: ["정유나", "김철수", "이영희", "박민준"],
      keywords: ["논문 키워드", "논문 키워드"],
      kciType: "KCI O",
      citationCount: 0,
      isBookmarked: false,
    },
  ],
  originalUrl: "https://example.com",
};

const containerSx: SxProps<Theme> = {
  display: "flex",
  flexDirection: "column",
  minHeight: "100vh",
  backgroundColor: "background.paper",
};

const PaperDetailPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const handleBack = () => {
    const returnTo = searchParams.get("returnTo");
    if (returnTo?.startsWith("/")) {
      navigate(returnTo);
      return;
    }
    navigate("/saved");
  };

  const handleRelatedPaperClick = (paperId: string) => {
    navigate(`/papers/${paperId}`);
  };

  // TODO: API 연동 시 useParams id로 fetch
  const paper = MOCK_PAPER_DETAIL;

  return (
    <Box sx={containerSx}>
      <Header isLoggedIn />
      <Box sx={{ padding: "29px 63px 0 63px" }}>
        {/* 뒤로가기 헤더 */}
        <Box
          sx={{ display: "flex", alignItems: "center", gap: "5px", pb: "30px" }}
        >
          <IconButton onClick={handleBack} sx={{ width: 32, height: 32, p: 0 }}>
            <ArrowBackIosNewIcon sx={{ fontSize: 16, color: "static.black" }} />
          </IconButton>
          <Typography
            sx={{ fontSize: "24px", fontWeight: 600, color: "static.black" }}
          >
            논문 상세보기
          </Typography>
        </Box>
      </Box>

      {/* 콘텐츠 */}
      <Box sx={{ padding: "0 63px 80px 63px" }}>
        <PaperDetailContent
          paper={paper}
          onRelatedPaperClick={handleRelatedPaperClick}
        />
      </Box>
    </Box>
  );
};

export default PaperDetailPage;
