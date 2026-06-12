import { useState } from "react";
import { useNavigate, useSearchParams, useLocation } from "react-router-dom";
import { Box, Typography, CircularProgress } from "@mui/material";
import { type SxProps, type Theme } from "@mui/material/styles";
import { useQuery } from "@tanstack/react-query";
import RecentPaperHeader from "../components/saved/RecentPaperHeader";
import BubbleChart from "../components/saved/BubbleChart";
import ChartRightPanel from "../components/saved/ChartRightPanel";
import { type ChartFilter, type PeriodMode } from "../types/saved";
import { savedApi } from "../api/saved";
import {
  parseDateParam,
  formatDateParam,
  isPeriodMode,
} from "../utils/savedUtils";

// ─── 스타일 ───────────────────────────────────────────────

const pageWrapperSx: SxProps<Theme> = {
  display: "flex",
  flexDirection: "column",
  height: "100vh",
  backgroundColor: "background.default",
  overflow: "hidden",
  padding: "24px 40px",
  gap: "13px",
};

const summarySx: SxProps<Theme> = {
  display: "flex",
  alignItems: "center",
  padding: "16px 40px",
  borderRadius: "16px",
  border: "1px solid",
  borderColor: "line.normal",
  flexShrink: 0,
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

const axisLabelSx: SxProps<Theme> = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: "#5D6279",
  borderRadius: "16px",
  padding: "6px 16px 6px 16px",
};

const axisLabelTextSx: SxProps<Theme> = {
  fontSize: "18px",
  fontWeight: 600,
  color: "#FFFFFF",
  whiteSpace: "nowrap",
};

const chartWrapperSx: SxProps<Theme> = {
  flex: 1,
  borderRadius: "16px",
  backgroundColor: "background.paper",
  overflow: "hidden",
  minHeight: 0,
};

// ─── 컴포넌트 ─────────────────────────────────────────────

const RecentPaperFullscreenPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedPaperIds, setSelectedPaperIds] = useState<string[] | null>(
    null,
  );

  const periodMode: PeriodMode = isPeriodMode(searchParams.get("mode"))
    ? (searchParams.get("mode") as PeriodMode)
    : "day";

  const currentDate = parseDateParam(searchParams.get("date"));
  const dateParam = formatDateParam(currentDate);

  const filter: ChartFilter = {
    publish: (searchParams.get("publish") as ChartFilter["publish"]) || null,
    citation: (searchParams.get("citation") as ChartFilter["citation"]) || null,
  };

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

  const updateParams = (updates: Record<string, string | null>) => {
    const next = new URLSearchParams(searchParams);
    Object.entries(updates).forEach(([key, value]) => {
      if (value === null || value === "") next.delete(key);
      else next.set(key, value);
    });
    setSearchParams(next, { replace: true });
  };

  const handlePeriodModeChange = (mode: PeriodMode) => {
    updateParams({ mode, date: formatDateParam(new Date()) });
  };

  const handleDatePrev = () => {
    const next = new Date(currentDate);
    if (periodMode === "day") next.setDate(next.getDate() - 1);
    else next.setDate(next.getDate() - 7);
    updateParams({ date: formatDateParam(next) });
  };

  const handleDateNext = () => {
    const next = new Date(currentDate);
    if (periodMode === "day") next.setDate(next.getDate() + 1);
    else next.setDate(next.getDate() + 7);
    updateParams({ date: formatDateParam(next) });
  };

  const handleDateSelect = (date: Date) => {
    updateParams({ date: formatDateParam(date) });
  };

  const handleFilterChange = (nextFilter: ChartFilter) => {
    updateParams({
      publish: nextFilter.publish ?? null,
      citation: nextFilter.citation ?? null,
    });
  };

  const handleClose = () => {
    const params = new URLSearchParams(searchParams);
    params.set("tab", "recent");
    params.set("view", "chart");
    navigate(`/saved?${params.toString()}`, { replace: true });
  };

  const handlePaperClick = (paperId: string) => {
    const returnTo = `${location.pathname}${location.search}`;
    navigate(`/papers/${paperId}?returnTo=${encodeURIComponent(returnTo)}`);
  };

  if (isPending) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
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
          height: "100vh",
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
    <Box sx={pageWrapperSx}>
      <RecentPaperHeader
        variant="fullscreen"
        periodMode={periodMode}
        currentDate={currentDate}
        viewMode="chart"
        onPeriodModeChange={handlePeriodModeChange}
        onDatePrev={handleDatePrev}
        onDateNext={handleDateNext}
        onDateSelect={handleDateSelect}
        onViewModeChange={() => {}}
        onClose={handleClose}
      />

      {/* 요약카드 */}
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
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            flex: 1,
            minHeight: 0,
            gap: "5px",
          }}
        >
          <Box sx={{ display: "flex", flex: 1, minHeight: 0, gap: "10px" }}>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                flex: 1,
                minHeight: 0,
                gap: "10px",
              }}
            >
              <Box sx={{ display: "flex", gap: "5px", flexShrink: 0 }}>
                <Box sx={{ ...axisLabelSx, flex: 1 }}>
                  <Typography sx={axisLabelTextSx}>오래된 논문</Typography>
                </Box>
                <Box sx={{ ...axisLabelSx, flex: 1 }}>
                  <Typography sx={axisLabelTextSx}>최신 논문</Typography>
                </Box>
              </Box>
              <Box sx={chartWrapperSx}>
                <BubbleChart
                  variant="fullscreen"
                  papers={chartData}
                  selectedPaperIds={selectedPaperIds}
                  onDotClick={setSelectedPaperIds}
                  onBackgroundClick={() => setSelectedPaperIds(null)}
                />
              </Box>
            </Box>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: "5px",
                flexShrink: 0,
              }}
            >
              <Box sx={{ height: "40px", flexShrink: 0 }} />
              <Box
                sx={{
                  ...axisLabelSx,
                  writingMode: "vertical-rl",
                  transform: "rotate(0deg)",
                  padding: "16px 6px",
                  flex: 1,
                }}
              >
                <Typography sx={axisLabelTextSx}>인용 높음</Typography>
              </Box>
              <Box
                sx={{
                  ...axisLabelSx,
                  writingMode: "vertical-rl",
                  transform: "rotate(0deg)",
                  padding: "16px 6px",
                  flex: 1,
                }}
              >
                <Typography sx={axisLabelTextSx}>인용 낮음</Typography>
              </Box>
            </Box>
          </Box>
        </Box>
        <ChartRightPanel
          papers={chartData}
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
