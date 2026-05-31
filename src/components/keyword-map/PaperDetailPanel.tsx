import { Box, Typography, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import {
  useKeywordMapActions,
  useSelectedPaperId,
} from "../../stores/keywordMapStore";
import { type PaperDetail } from "../../types/paper";
import PaperDetailContent from "../common/PaperDetailContent";

// TODO: API 연동 시 백엔드 응답으로 교체
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
  paperType: '학술저널',
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

interface PaperDetailPanelProps {
  onClose: () => void;
}

const PaperDetailPanel = ({ onClose }: PaperDetailPanelProps) => {
  const selectedPaperId = useSelectedPaperId();
  const { selectPaper } = useKeywordMapActions();

  if (!selectedPaperId) return null;

  // TODO: API 연동 시 selectedPaperId로 논문 상세 데이터 fetch
  const paper = MOCK_PAPER_DETAIL;

  const handleClose = () => {
    selectPaper(null);
    onClose();
  };

  const handleRelatedPaperClick = (paperId: string) => {
    selectPaper(paperId);
  };

  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        position: "absolute",
        right: 0,
        top: 0,
        display: "flex",
        flexDirection: "column",
        backgroundColor: "background.paper",
        borderRadius: "11px 0 0 11px",
        boxShadow: "0 0 9px 0 rgba(0, 0, 0, 0.29)",
        zIndex: 11,
        overflowY: "auto",
      }}
    >
      {/* 패널 헤더 */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "10px 10px 10px 25px",
          borderBottom: "1px solid",
          borderColor: "line.normal",
          backgroundColor: "background.paper",
          flexShrink: 0,
          position: "sticky",
          top: 0,
          zIndex: 1,
        }}
      >
        <Typography
          sx={{
            fontSize: "17px",
            fontWeight: 600,
            color: "label.strong",
            letterSpacing: "-0.34px",
          }}
        >
          {/* TODO: API 연동 시 검색 키워드로 교체 */}
          검색 결과
        </Typography>
        <IconButton onClick={handleClose} size="small">
          <CloseIcon sx={{ fontSize: "24px", color: "label.strong" }} />
        </IconButton>
      </Box>

      {/* 콘텐츠 */}
      <Box sx={{ padding: "0 31px 40px 31px" }}>
        <PaperDetailContent
          paper={paper}
          onRelatedPaperClick={handleRelatedPaperClick}
        />
      </Box>
    </Box>
  );
};

export default PaperDetailPanel;
