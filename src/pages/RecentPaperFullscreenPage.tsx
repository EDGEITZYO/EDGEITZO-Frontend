import { useState } from "react";
import { useNavigate, useSearchParams, useLocation } from "react-router-dom";
import { Box, IconButton } from "@mui/material";
import CloseFullscreenIcon from "@mui/icons-material/CloseFullscreen";
import { type SxProps, type Theme } from "@mui/material/styles";
import BubbleChart from "../components/saved/BubbleChart";
import ChartRightPanel from "../components/saved/ChartRightPanel";
import { type ChartFilter, type PeriodMode } from "../types/saved";
import { MOCK_RECENT_PAPERS } from "../components/saved/RecentPaperListView";
import { isPeriodMode } from "../utils/savedUtils";

const pageWrapperSx: SxProps<Theme> = {
  display: "flex",
  flexDirection: "column",
  height: "100vh",
  backgroundColor: "background.default",
  overflow: "hidden",
};

const headerSx: SxProps<Theme> = {
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: "8px 16px",
  flexShrink: 0,
};

const contentSx: SxProps<Theme> = {
  display: "flex",
  flex: 1,
  gap: "15px",
  padding: "0 16px 16px 16px",
  overflow: "hidden",
};

const chartWrapperSx: SxProps<Theme> = {
  flex: 1,
  borderRadius: "16px",
  backgroundColor: "background.paper",
  overflow: "hidden",
};

const RecentPaperFullscreenPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const [filter, setFilter] = useState<ChartFilter>({
    publish: (searchParams.get("publish") as ChartFilter["publish"]) || null,
    citation: (searchParams.get("citation") as ChartFilter["citation"]) || null,
  });
  const [selectedPaperIds, setSelectedPaperIds] = useState<string[] | null>(
    null,
  );

  // TODO: API 연동 시 searchParams로 데이터 fetch
  const papers = MOCK_RECENT_PAPERS;
  const periodMode: PeriodMode = isPeriodMode(searchParams.get("mode"))
    ? (searchParams.get("mode") as PeriodMode)
    : "day";

  const handleBack = () => {
    const params = new URLSearchParams(searchParams);
    params.set("tab", "recent");
    params.set("view", "chart");
    if (filter.publish) params.set("publish", filter.publish);
    else params.delete("publish");
    if (filter.citation) params.set("citation", filter.citation);
    else params.delete("citation");
    navigate(`/saved?${params.toString()}`, { replace: true });
  };

  const handleFilterChange = (nextFilter: ChartFilter) => {
    setFilter(nextFilter);
    const next = new URLSearchParams(searchParams);
    if (nextFilter.publish) next.set("publish", nextFilter.publish);
    else next.delete("publish");
    if (nextFilter.citation) next.set("citation", nextFilter.citation);
    else next.delete("citation");
    navigate(`${location.pathname}?${next.toString()}`, { replace: true });
  };

  const handlePaperClick = (paperId: string) => {
    const returnTo = `${location.pathname}${location.search}`;
    navigate(`/papers/${paperId}?returnTo=${encodeURIComponent(returnTo)}`);
  };

  return (
    <Box sx={pageWrapperSx}>
      <Box sx={headerSx}>
        <IconButton onClick={handleBack}>
          <CloseFullscreenIcon
            sx={{ fontSize: 24, color: "label.alternative" }}
          />
        </IconButton>
      </Box>
      <Box sx={contentSx}>
        <Box sx={chartWrapperSx}>
          <BubbleChart
            variant="fullscreen"
            papers={papers}
            selectedPaperIds={selectedPaperIds}
            onDotClick={setSelectedPaperIds}
            onBackgroundClick={() => setSelectedPaperIds(null)}
          />
        </Box>
        <ChartRightPanel
          papers={papers}
          filter={filter}
          selectedPaperIds={selectedPaperIds}
          onFilterChange={handleFilterChange}
          onBack={() => setSelectedPaperIds(null)}
          onPaperClick={handlePaperClick}
        />
      </Box>
    </Box>
  );
};

export default RecentPaperFullscreenPage;
