import { Box, Typography } from "@mui/material";
import { type SxProps, type Theme } from "@mui/material/styles";
import FilterBar from "./FilterBar";
import PaperListCard from "../common/PaperListCard";
import { type PaperListItem } from "../../types/search";

interface PaperListPanelProps {
  papers: PaperListItem[];
  totalCount: number;
  onResetCondition: () => void;
  onBookmark: (paperId: string) => void;
  onPaperClick: (paperId: string) => void;
}

const containerSx: SxProps<Theme> = {
  display: "flex",
  flexDirection: "column",
  height: "100%",
  px: "94.5px",
  py: "27px",
  gap: "16px",
  overflow: "hidden",
};

const headerSx: SxProps<Theme> = {
  display: "flex",
  flexDirection: "column",
  gap: "16px",
  flexShrink: 0,
};

const totalCountSx: SxProps<Theme> = {
  fontSize: "24px",
  fontWeight: 600,
  color: "#000",
  lineHeight: "150%",
};

const paperListSx: SxProps<Theme> = {
  flex: 1,
  overflowY: "auto",
  display: "flex",
  flexDirection: "column",
  gap: "17px",
  pb: "20px",
};

// TODO: API 연동 시 실제 데이터로 교체
const MOCK_PAPERS: PaperListItem[] = [
  {
    id: "1",
    source: "한국분자세포생물학회 2024년도 춘계학술대회",
    date: "2024.10.16",
    title: "미토콘드리아 막전위 손실이 세포 노화 유도에 미치는 영향 분석",
    authors: ["박민수", "김철수", "이영희", "홍길동"],
    abstract:
      "세포 노화(cellular senescence)는 비가역적 세포 주기 정지 상태로, 미토콘드리아 기능 저하와 밀접하게 연관되어 있다. 본 연구는 미토콘드리아 막전위 손실이 ROS 축적을 통해 p53-p21 경로를 활성화하고 노화를 유도하는 기전을 규명하였다.",
    keywords: ["세포 노화", "미토콘드리아"],
    kciType: "KCI O",
    citationCount: 0,
    readAt: "2024.10.16.00:00",
    isBookmarked: false,
    paperType: '학위논문',
  },
  {
    id: "2",
    source: "한국분자세포생물학회 2024년도 춘계학술대회",
    date: "2024.10.16",
    title: "미토콘드리아 막전위 손실이 세포 노화 유도에 미치는 영향 분석",
    authors: ["박민수", "김철수", "이영희", "홍길동"],
    abstract:
      "세포 노화(cellular senescence)는 비가역적 세포 주기 정지 상태로, 미토콘드리아 기능 저하와 밀접하게 연관되어 있다. 본 연구는 미토콘드리아 막전위 손실이 ROS 축적을 통해 p53-p21 경로를 활성화하고 노화를 유도하는 기전을 규명하였다.",
    keywords: ["세포 노화", "미토콘드리아"],
    kciType: "KCI O",
    citationCount: 0,
    readAt: "2024.10.16.00:00",
    isBookmarked: false,
    paperType: '학술저널',
  },
  {
    id: "3",
    source: "한국분자세포생물학회 2024년도 춘계학술대회",
    date: "2024.10.16",
    title: "미토콘드리아 막전위 손실이 세포 노화 유도에 미치는 영향 분석",
    authors: ["박민수", "김철수", "이영희", "홍길동"],
    abstract:
      "세포 노화(cellular senescence)는 비가역적 세포 주기 정지 상태로, 미토콘드리아 기능 저하와 밀접하게 연관되어 있다. 본 연구는 미토콘드리아 막전위 손실이 ROS 축적을 통해 p53-p21 경로를 활성화하고 노화를 유도하는 기전을 규명하였다.",
    keywords: ["세포 노화", "미토콘드리아"],
    kciType: "KCI O",
    citationCount: 0,
    readAt: "2024.10.16.00:00",
    isBookmarked: false,
    paperType: '학위논문',
  },
];

const PaperListPanel = ({
  papers,
  totalCount,
  onResetCondition,
  onBookmark,
  onPaperClick,
}: PaperListPanelProps) => {
  return (
    <Box sx={containerSx}>
      <Box sx={headerSx}>
        <Typography sx={totalCountSx}>검색 결과 {totalCount}건</Typography>
        <FilterBar onResetCondition={onResetCondition} />
      </Box>
      <Box sx={paperListSx}>
        {papers.map((paper) => (
          <PaperListCard
            key={paper.id}
            paper={paper}
            onBookmark={onBookmark}
            onClick={onPaperClick}
          />
        ))}
      </Box>
    </Box>
  );
};

export { MOCK_PAPERS };
export default PaperListPanel;
