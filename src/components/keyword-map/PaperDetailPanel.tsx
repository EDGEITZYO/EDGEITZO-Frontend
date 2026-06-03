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
