import { Box, Typography } from "@mui/material";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import { type SxProps, type Theme } from "@mui/material/styles";
import ChartPaperCard from "../common/ChartPaperCard";
// TODO: [이슈 B] API 연동 시 MockRecentPaper → RecentPaper로 교체
import { type MockRecentPaper } from "./RecentPaperListView";
import { type ChartFilter } from "../../types/saved";

interface ChartRightPanelProps {
  papers: MockRecentPaper[];
  filter: ChartFilter;
  selectedPaperIds: string[] | null;
  onFilterChange: (filter: ChartFilter) => void;
  onBack: () => void;
  onPaperClick: (paperId: string) => void;
}

const panelSx: SxProps<Theme> = {
  width: "308px",
  flexShrink: 0,
  display: "flex",
  flexDirection: "column",
  borderRadius: "16px",
  border: "1px solid",
  borderColor: "line.normal",
  backgroundColor: "background.default",
  overflow: "hidden",
  minHeight: 0,
};

const filterSx: SxProps<Theme> = {
  display: "flex",
  flexDirection: "column",
  gap: "8px",
  padding: "16px 16px 0 16px",
  flexShrink: 0,
};

const filterRowSx: SxProps<Theme> = {
  display: "flex",
  alignItems: "center",
  gap: "8px",
};

const filterLabelSx: SxProps<Theme> = {
  fontSize: "16px",
  fontWeight: 400,
  color: "label.alternative",
  whiteSpace: "nowrap",
};

const filterChipSx = (isActive: boolean): SxProps<Theme> => ({
  display: "inline-flex",
  padding: "4px 12px",
  borderRadius: "6px",
  backgroundColor: isActive ? "static.black" : "background.paper",
  cursor: "pointer",
  "&:hover": { opacity: 0.8 },
});

const filterChipTextSx = (isActive: boolean): SxProps<Theme> => ({
  fontSize: "16px",
  fontWeight: isActive ? 600 : 400,
  color: isActive ? "static.white" : "label.normal",
});

const paperListSx: SxProps<Theme> = {
  flex: 1,
  minHeight: 0,
  overflowY: "auto",
  display: "flex",
  flexDirection: "column",
  gap: "12px",
  padding: "16px",
};

const backButtonSx: SxProps<Theme> = {
  display: "flex",
  alignItems: "center",
  gap: "4px",
  cursor: "pointer",
  padding: "8px 16px",
  flexShrink: 0,
  borderBottom: "1px solid",
  borderColor: "line.normal",
};

const ChartRightPanel = ({
  papers,
  filter,
  selectedPaperIds,
  onFilterChange,
  onBack,
  onPaperClick,
}: ChartRightPanelProps) => {
  const displayPapers = selectedPaperIds
    ? papers.filter((p) => selectedPaperIds.includes(p.id))
    : papers;

  const handlePublishFilter = (value: "old" | "recent") => {
    onFilterChange({
      ...filter,
      publish: filter.publish === value ? null : value,
    });
  };

  const handleCitationFilter = (value: "low" | "high") => {
    onFilterChange({
      ...filter,
      citation: filter.citation === value ? null : value,
    });
  };

  return (
    <Box sx={panelSx}>
      {/* 뒤로가기 — 점/클러스터 선택 시에만 표시 */}
      {selectedPaperIds && (
        <Box sx={backButtonSx} onClick={onBack}>
          <ChevronLeftIcon sx={{ fontSize: 20, color: "label.normal" }} />
          <Typography sx={{ fontSize: "14px", color: "label.normal" }}>
            뒤로 가기
          </Typography>
        </Box>
      )}

      {/* 필터 */}
      <Box sx={filterSx}>
        <Box sx={filterRowSx}>
          <Typography sx={filterLabelSx}>출판 시기</Typography>
          {(["old", "recent"] as const).map((val) => (
            <Box
              key={val}
              sx={filterChipSx(filter.publish === val)}
              onClick={() => handlePublishFilter(val)}
            >
              <Typography sx={filterChipTextSx(filter.publish === val)}>
                {val === "old" ? "오래된 논문" : "최신 논문"}
              </Typography>
            </Box>
          ))}
        </Box>
        <Box sx={filterRowSx}>
          <Typography sx={filterLabelSx}>인용 수</Typography>
          {(["low", "high"] as const).map((val) => (
            <Box
              key={val}
              sx={filterChipSx(filter.citation === val)}
              onClick={() => handleCitationFilter(val)}
            >
              <Typography sx={filterChipTextSx(filter.citation === val)}>
                {val === "low" ? "인용 낮음" : "인용 높음"}
              </Typography>
            </Box>
          ))}
        </Box>
      </Box>

      {/* 논문 리스트 */}
      <Box sx={paperListSx}>
        {displayPapers.length === 0 ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              flex: 1,
            }}
          >
            <Typography sx={{ fontSize: "14px", color: "label.assistive" }}>
              표시할 논문이 없어요
            </Typography>
          </Box>
        ) : (
          displayPapers.map((paper) => (
            <ChartPaperCard
              key={paper.id}
              paper={paper}
              onClick={onPaperClick}
            />
          ))
        )}
      </Box>
    </Box>
  );
};

export default ChartRightPanel;
