import { useState } from "react";
import { useNavigate, useSearchParams, useLocation } from "react-router-dom";
import { Box, Typography } from "@mui/material";
import { type SxProps, type Theme } from "@mui/material/styles";
import RecentPaperHeader from "../components/saved/RecentPaperHeader";
import BubbleChart from "../components/saved/BubbleChart";
import ChartRightPanel from "../components/saved/ChartRightPanel";
import { type ChartFilter, type PeriodMode } from "../types/saved";
import { MOCK_RECENT_PAPERS } from "../components/saved/RecentPaperListView";
import {
  parseDateParam,
  formatDateParam,
  isPeriodMode,
} from "../utils/savedUtils";

// ─── 목 데이터 ────────────────────────────────────────────
// TODO: API 연동 시 교체
const MOCK_SUMMARY = {
  totalCount: 16,
  keywordCount: 12,
  mostSearchedKeyword: "IBS",
};

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

  const papers = MOCK_RECENT_PAPERS;

  const periodMode: PeriodMode = isPeriodMode(searchParams.get("mode"))
    ? (searchParams.get("mode") as PeriodMode)
    : "day";

  const currentDate = parseDateParam(searchParams.get("date"));

  const filter: ChartFilter = {
    publish: (searchParams.get("publish") as ChartFilter["publish"]) || null,
    citation: (searchParams.get("citation") as ChartFilter["citation"]) || null,
  };

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

  return (
    <Box sx={pageWrapperSx}>
      {/* 날짜/필터 헤더 */}
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
          <Typography sx={summaryValueSx}>
            {MOCK_SUMMARY.totalCount}건
          </Typography>
        </Box>
        <Box sx={summaryDividerSx} />
        <Box sx={summaryItemSx}>
          <Typography sx={summaryLabelSx}>키워드 수</Typography>
          <Typography sx={summaryValueSx}>
            {MOCK_SUMMARY.keywordCount}개
          </Typography>
        </Box>
        <Box sx={summaryDividerSx} />
        <Box sx={summaryItemSx}>
          <Typography sx={summaryLabelSx}>가장 많이 탐색한 키워드</Typography>
          <Typography sx={summaryValueSx}>
            {MOCK_SUMMARY.mostSearchedKeyword}
          </Typography>
        </Box>
      </Box>

      {/* 차트 영역 */}
      <Box sx={chartAreaSx}>
        {/* 차트 + 라벨 전체 묶음 */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            flex: 1,
            minHeight: 0,
            gap: "5px",
          }}
        >
          {/* 차트 + 우측 라벨 묶음 */}
          <Box sx={{ display: "flex", flex: 1, minHeight: 0, gap: "10px" }}>
            {/* 차트 + 상단 라벨 묶음 */}
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                flex: 1,
                minHeight: 0,
                gap: "10px",
              }}
            >
              {/* 상단 라벨 */}
              <Box sx={{ display: "flex", gap: "5px", flexShrink: 0 }}>
                <Box sx={{ ...axisLabelSx, flex: 1 }}>
                  <Typography sx={axisLabelTextSx}>오래된 논문</Typography>
                </Box>
                <Box sx={{ ...axisLabelSx, flex: 1 }}>
                  <Typography sx={axisLabelTextSx}>최신 논문</Typography>
                </Box>
              </Box>
              {/* 차트 */}
              <Box sx={chartWrapperSx}>
                <BubbleChart
                  variant="fullscreen"
                  papers={papers}
                  selectedPaperIds={selectedPaperIds}
                  onDotClick={setSelectedPaperIds}
                  onBackgroundClick={() => setSelectedPaperIds(null)}
                />
              </Box>
            </Box>
            {/* 우측 라벨 */}
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: "5px",
                flexShrink: 0,
              }}
            >
              {/* 상단 라벨 높이만큼 spacer */}
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
        {/* 우측 패널 */}
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
