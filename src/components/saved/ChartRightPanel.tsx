import { Box, Typography, useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { type SxProps, type Theme } from "@mui/material/styles";
import ChartPaperCard from "../common/ChartPaperCard";
import { type RecentPaperChartItem, type ChartFilter } from "../../types/saved";

interface ChartRightPanelProps {
  papers: RecentPaperChartItem[];
  filter: ChartFilter;
  selectedPaperIds: string[] | null;
  onFilterChange: (filter: ChartFilter) => void;
  onBack: () => void;
  onPaperClick: (paperId: string) => void;
}

const filterLabelSx: SxProps<Theme> = {
  color: "label.assistive",
  fontSize: "16px",
  fontWeight: 400,
  lineHeight: "27px",
  letterSpacing: "-0.336px",
};

const chipSx = (isActive: boolean): SxProps<Theme> => ({
  display: "flex",
  padding: "8px 13px",
  justifyContent: "center",
  alignItems: "center",
  borderRadius: "24px",
  cursor: "pointer",
  backgroundColor: isActive ? "primary.main" : "fill.normal",
  background: isActive
    ? "linear-gradient(0deg, rgba(0,0,0,0.20) 0%, rgba(0,0,0,0.20) 100%), #03C26C"
    : undefined,
  "&:hover": { opacity: 0.85 },
});

const chipTextSx = (isActive: boolean): SxProps<Theme> => ({
  display: "-webkit-box",
  WebkitBoxOrient: "vertical",
  WebkitLineClamp: 1,
  overflow: "hidden",
  textOverflow: "ellipsis",
  color: isActive ? "#FAFAFC" : "label.alternative",
  fontSize: "16px",
  fontWeight: 400,
  lineHeight: "24px",
  letterSpacing: "-0.336px",
});

const ChartRightPanel = ({
  papers,
  filter,
  selectedPaperIds,
  onFilterChange,
  onPaperClick,
}: ChartRightPanelProps) => {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("lg"));

  const displayPapers = (() => {
    const seen = new Set<string>();
    let result = (
      selectedPaperIds
        ? papers.filter((p) => selectedPaperIds.includes(p.paper_id))
        : [...papers]
    ).filter((p) => {
      if (seen.has(p.paper_id)) return false;
      seen.add(p.paper_id);
      return true;
    });

    if (!filter.publish && !filter.citation) {
      return result.sort(
        (a, b) =>
          new Date(b.viewed_at).getTime() - new Date(a.viewed_at).getTime(),
      );
    }

    if (filter.citation) {
      result = result.sort((a, b) =>
        filter.citation === "high"
          ? (b.citation_count ?? 0) - (a.citation_count ?? 0)
          : (a.citation_count ?? 0) - (b.citation_count ?? 0),
      );
      if (filter.publish) {
        result = result.sort((a, b) => {
          if ((a.citation_count ?? 0) !== (b.citation_count ?? 0)) return 0;
          const dateA = new Date(a.published_at ?? "").getTime();
          const dateB = new Date(b.published_at ?? "").getTime();
          return filter.publish === "recent" ? dateB - dateA : dateA - dateB;
        });
      }
      return result;
    }

    if (filter.publish) {
      return result.sort((a, b) => {
        const dateA = new Date(a.published_at ?? "").getTime();
        const dateB = new Date(b.published_at ?? "").getTime();
        return filter.publish === "recent" ? dateB - dateA : dateA - dateB;
      });
    }

    return result;
  })();

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
    <Box
      sx={{
        display: "flex",
        width: "100%",
        height: isDesktop ? "100%" : "auto",
        boxSizing: "border-box",
        padding: "16px 12px 12px 12px",
        flexDirection: "column",
        alignItems: "flex-start",
        gap: "16px",
        borderRadius: "8px",
        border: "1px solid",
        borderColor: "line.normal",
        flexShrink: 0,
        overflow: "hidden",
      }}
    >
      {/* 필터 */}
      <Box
        sx={{
          display: "flex",
          padding: "0 16px",
          flexDirection: "column",
          alignItems: "flex-start",
          gap: "8px",
          alignSelf: "stretch",
        }}
      >
        {/* 출판 시기 */}
        <Box sx={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <Typography sx={filterLabelSx}>출판 시기</Typography>
          <Box sx={{ display: "flex", alignItems: "center", gap: "8px" }}>
            {(["old", "recent"] as const).map((val) => (
              <Box
                key={val}
                sx={chipSx(filter.publish === val)}
                onClick={() => handlePublishFilter(val)}
              >
                <Typography sx={chipTextSx(filter.publish === val)}>
                  {val === "old" ? "오래된 논문" : "최신 논문"}
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>

        {/* 인용 수 */}
        <Box sx={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <Typography sx={filterLabelSx}>인용 수</Typography>
          <Box sx={{ display: "flex", alignItems: "center", gap: "8px" }}>
            {(["low", "high"] as const).map((val) => (
              <Box
                key={val}
                sx={chipSx(filter.citation === val)}
                onClick={() => handleCitationFilter(val)}
              >
                <Typography sx={chipTextSx(filter.citation === val)}>
                  {val === "low" ? "인용 낮음" : "인용 높음"}
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>
      </Box>

      {/* 논문 카드 목록 */}
      <Box
        sx={{
          display: "flex",
          flex: 1,
          minHeight: 0,
          width: "100%",
          padding: "8px",
          flexDirection: "column",
          alignItems: "stretch",
          gap: "8px",
          borderRadius: "8px",
          backgroundColor: "fill.normal",
          overflowY: "auto",
        }}
      >
        {displayPapers.length === 0 ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              width: "100%",
              height: "100%",
            }}
          >
            <Typography sx={{ fontSize: "14px", color: "label.assistive" }}>
              표시할 논문이 없어요
            </Typography>
          </Box>
        ) : (
          displayPapers.map((paper) => (
            <ChartPaperCard
              key={paper.paper_id}
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
