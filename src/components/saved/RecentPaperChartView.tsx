import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Box, Typography, IconButton, CircularProgress } from "@mui/material";
import FullscreenIcon from "@mui/icons-material/Fullscreen";
import { type SxProps, type Theme } from "@mui/material/styles";
import { useQuery } from "@tanstack/react-query";
import BubbleChart from "./BubbleChart";
import ChartRightPanel from "./ChartRightPanel";
import { type ChartFilter, type PeriodMode } from "../../types/saved";
import { savedApi } from "../../api/saved";
import { formatDateParam } from "../../utils/savedUtils";

// ─── 스타일 ───────────────────────────────────────────────

const containerSx: SxProps<Theme> = {
  display: "flex",
  flexDirection: "column",
  flex: 1,
  gap: "15px",
  minHeight: 0,
  overflow: "hidden",
};

const summarySx: SxProps<Theme> = {
  display: "flex",
  alignItems: "center",
  padding: "16px 40px",
  borderRadius: "16px",
  border: "1px solid",
  borderColor: "line.normal",
  justifyContent: "flex-start",
};

const summaryItemSx: SxProps<Theme> = {
  display: "flex",
  flexDirection: "column",
  gap: "4px",
};

const summaryDividerSx: SxProps<Theme> = {
  width: "1px",
  height: "44px",
  backgroundColor: "line.normal",
  ml: "45px",
  mr: "30px",
  flexShrink: 0,
};

const summaryLabelSx: SxProps<Theme> = {
  fontSize: "14px",
  fontWeight: 400,
  color: "label.alternative",
};

const summaryValueSx: SxProps<Theme> = {
  fontSize: "20px",
  fontWeight: 700,
  color: "static.black",
};

const chartAreaSx: SxProps<Theme> = {
  display: "flex",
  gap: "15px",
  flex: 1,
  minHeight: 0,
  overflow: "hidden",
};

const chartWrapperSx: SxProps<Theme> = {
  flex: 1,
  borderRadius: "16px",
  backgroundColor: "background.paper",
  position: "relative",
  minHeight: 0,
  overflow: "hidden",
};

const fullscreenButtonSx: SxProps<Theme> = {
  position: "absolute",
  top: "12px",
  right: "12px",
  zIndex: 10,
  backgroundColor: "background.default",
  borderRadius: "8px",
  "&:hover": { backgroundColor: "fill.normal" },
};

// ─── 컴포넌트 ─────────────────────────────────────────────

interface RecentPaperChartViewProps {
  periodMode: PeriodMode;
  currentDate: Date;
  onPaperClick: (paperId: string) => void;
  onFilterChange: (filter: ChartFilter) => void;
}

const RecentPaperChartView = ({
  periodMode,
  currentDate,
  onPaperClick,
  onFilterChange,
}: RecentPaperChartViewProps) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [selectedPaperIds, setSelectedPaperIds] = useState<string[] | null>(
    null,
  );

  const dateParam = formatDateParam(currentDate);

  const { data, isPending, isError } = useQuery({
    queryKey: ["recent-paper-stats", periodMode, dateParam],
    queryFn: async () => {
      const res = await savedApi.getRecentPaperStats({
        period: periodMode,
        date: dateParam,
      });
      return res.data.data;
    },
    staleTime: 1000 * 60 * 5,
  });

  const filter: ChartFilter = {
    publish: (searchParams.get("publish") as ChartFilter["publish"]) || null,
    citation: (searchParams.get("citation") as ChartFilter["citation"]) || null,
  };

  const handleFullscreen = () => {
    const params = new URLSearchParams({
      mode: periodMode,
      date: dateParam,
      publish: filter.publish ?? "",
      citation: filter.citation ?? "",
    });
    navigate(`/saved/recent/fullscreen?${params.toString()}`);
  };

  if (isPending) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flex: 1,
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (isError || !data) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flex: 1,
        }}
      >
        <Typography sx={{ fontSize: "16px", color: "label.alternative" }}>
          데이터를 불러오지 못했어요. 다시 시도해주세요.
        </Typography>
      </Box>
    );
  }

  const chartData = data.chart_data;

  return (
    <Box sx={containerSx}>
      {/* 요약 카드 */}
      <Box sx={summarySx}>
        <Box sx={summaryItemSx}>
          <Typography sx={summaryLabelSx}>총 탐색 논문</Typography>
          <Typography sx={summaryValueSx}>{data.total_papers}건</Typography>
        </Box>
        <Box sx={summaryDividerSx} />
        <Box sx={summaryItemSx}>
          <Typography sx={summaryLabelSx}>키워드 수</Typography>
          <Typography sx={summaryValueSx}>{data.keyword_count}개</Typography>
        </Box>
        <Box sx={summaryDividerSx} />
        <Box sx={summaryItemSx}>
          <Typography sx={summaryLabelSx}>가장 많이 탐색한 키워드</Typography>
          <Typography sx={summaryValueSx}>{data.top_keyword}</Typography>
        </Box>
      </Box>

      {/* 차트 영역 */}
      <Box sx={chartAreaSx}>
        <Box sx={chartWrapperSx}>
          <IconButton sx={fullscreenButtonSx} onClick={handleFullscreen}>
            <FullscreenIcon sx={{ fontSize: 24, color: "label.alternative" }} />
          </IconButton>
          <BubbleChart
            variant="normal"
            papers={chartData}
            selectedPaperIds={selectedPaperIds}
            onDotClick={setSelectedPaperIds}
            onBackgroundClick={() => setSelectedPaperIds(null)}
          />
        </Box>
        <ChartRightPanel
          papers={chartData}
          filter={filter}
          selectedPaperIds={selectedPaperIds}
          onFilterChange={onFilterChange}
          onBack={() => setSelectedPaperIds(null)}
          onPaperClick={onPaperClick}
        />
      </Box>
    </Box>
  );
};

export default RecentPaperChartView;
