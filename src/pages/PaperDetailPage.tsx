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
  source: "한국정보통신학회 2021년도 춘계학술대회",
  date: "2021.04.03",
  title: "한글 토크나이징 라이브러리 모듈 분석",
  authors: ["홍길동", "김철수", "이영희", "박민준"],
  keywords: [
    "논문 키워드",
    "논문 키워드",
    "논문 키워드",
    "논문 키워드",
    "논문 키워드",
    "논문 키워드",
  ],
  kciType: "KCI O",
  citationCount: 0,
  isBookmarked: false,
  abstract:
    "현재 자연어 처리(NLP)에 대한 연구는 급속히 발전하고 있다. 자연어 처리는 인간이 일상생활에서 사용하는 언어의 의미를 분석하여 컴퓨터가 처리할 수 있도록 하는 기술로 음성인식, 맞춤법 검사, 텍스트 분류 등 여러 분야에 사용하고 있다.",
  relatedPapers: [
    {
      id: "r1",
      source: "2024한국정보과학회 논문지",
      date: "2024.10.16",
      title: "1지식 그래프와 검색증강생성을 결합한 학술 논문 탐색 시스템",
      authors: ["홍길동", "김철수", "이영희", "박민준"],
      keywords: ["논문 키워드", "논문 키워드"],
      kciType: "KCI O",
      citationCount: 0,
      isBookmarked: false,
    },
    {
      id: "r2",
      source: "2024한국정보과학회 논문지",
      date: "2024.10.16",
      title: "1지식 그래프와 검색증강생성을 결합한 학술 논문 탐색 시스템",
      authors: ["홍길동", "김철수", "이영희", "박민준"],
      keywords: ["논문 키워드", "논문 키워드"],
      kciType: "KCI O",
      citationCount: 0,
      isBookmarked: false,
    },
    {
      id: "r3",
      source: "2024한국정보과학회 논문지",
      date: "2024.10.16",
      title: "1지식 그래프와 검색증강생성을 결합한 학술 논문 탐색 시스템",
      authors: ["홍길동", "김철수", "이영희", "박민준"],
      keywords: ["논문 키워드", "논문 키워드"],
      kciType: "KCI O",
      citationCount: 0,
      isBookmarked: false,
    },
    {
      id: "r4",
      source: "2024한국정보과학회 논문지",
      date: "2024.10.16",
      title: "1지식 그래프와 검색증강생성을 결합한 학술 논문 탐색 시스템",
      authors: ["홍길동", "김철수", "이영희", "박민준"],
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
