import { useState } from "react";
import { useNavigate, useSearchParams, useLocation } from "react-router-dom";
import { Box, Typography, IconButton, CircularProgress } from "@mui/material";
import { type SxProps, type Theme } from "@mui/material/styles";
import CloseFullscreenIcon from "@mui/icons-material/CloseFullscreen";
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
import ChartAxisOverlay from "../components/saved/ChartAxisOverlay";

const labelBoxSx: SxProps<Theme> = {
  display: "flex",
  padding: "8px 4px",
  justifyContent: "center",
  alignItems: "center",
  flex: "1 0 0",
  borderRadius: "16px",
  backgroundColor: "background.paper",
};

const labelTextSx: SxProps<Theme> = {
  color: "label.neutral",
  fontSize: "16px",
  fontWeight: 400,
  lineHeight: "24px",
  letterSpacing: "-0.336px",
};

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
    params.set("view", "chart");
    navigate(`/saved/recent?${params.toString()}`, { replace: true });
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
    <Box
      sx={{
        display: "flex",
        padding: "24px",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        gap: "10px",
        minHeight: "100vh",
        backgroundColor: "background.paper",
        boxSizing: "border-box",
      }}
    >
      {/* 콘텐츠 프레임 */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          alignItems: "center",
          gap: "24px",
          width: "100%",
        }}
      >
        {/* 상단: 일/주 선택 + 날짜 + 축소 버튼 */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            alignSelf: "stretch",
          }}
        >
          {/* 일/주 + 날짜 */}
          <RecentPaperHeader
            periodMode={periodMode}
            currentDate={currentDate}
            viewMode="chart"
            showViewToggle={false}
            onPeriodModeChange={handlePeriodModeChange}
            onDatePrev={handleDatePrev}
            onDateNext={handleDateNext}
            onDateSelect={handleDateSelect}
            onViewModeChange={() => {}}
          />

          {/* 축소 버튼 */}
          <IconButton
            onClick={handleClose}
            sx={{
              display: "flex",
              width: "36px",
              height: "36px",
              padding: "4px",
              justifyContent: "center",
              alignItems: "center",
              borderRadius: "8px",
              backgroundColor: "label.normal",
              flexShrink: 0,
              "&:hover": { backgroundColor: "label.strong" },
            }}
          >
            <CloseFullscreenIcon
              sx={{ width: "28px", height: "28px", color: "static.white" }}
            />
          </IconButton>
        </Box>

        {/* 상단 제외한 프레임 */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            alignSelf: "stretch",
          }}
        >
          {/* 상단 정보 (요약) */}
          <Box
            sx={{
              display: "flex",
              padding: "24px 24px 16px 24px",
              alignItems: "flex-end",
              alignContent: "flex-end",
              gap: "12px 32px",
              alignSelf: "stretch",
              flexWrap: "wrap",
              borderRadius: "8px 8px 0 0",
              backgroundColor: "background.default",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "flex-end", gap: "12px" }}>
              <Typography
                sx={{
                  color: "label.alternative",
                  fontSize: "16px",
                  fontWeight: 400,
                  lineHeight: "24px",
                  letterSpacing: "-0.336px",
                }}
              >
                총 탐색 논문
              </Typography>
              <Typography
                sx={{
                  color: "primary.dark",
                  fontSize: "28px",
                  fontWeight: 600,
                  lineHeight: "42px",
                  letterSpacing: "-0.784px",
                }}
              >
                {data.total_papers}건
              </Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "flex-end", gap: "12px" }}>
              <Typography
                sx={{
                  color: "label.alternative",
                  fontSize: "16px",
                  fontWeight: 400,
                  lineHeight: "24px",
                  letterSpacing: "-0.336px",
                }}
              >
                키워드 수
              </Typography>
              <Typography
                sx={{
                  color: "primary.dark",
                  fontSize: "28px",
                  fontWeight: 600,
                  lineHeight: "42px",
                  letterSpacing: "-0.784px",
                }}
              >
                {data.keyword_count}개
              </Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "flex-end", gap: "12px" }}>
              <Typography
                sx={{
                  color: "label.alternative",
                  fontSize: "16px",
                  fontWeight: 400,
                  lineHeight: "24px",
                  letterSpacing: "-0.336px",
                }}
              >
                가장 많이 탐색한 키워드
              </Typography>
              <Typography
                sx={{
                  color: "primary.dark",
                  fontSize: "28px",
                  fontWeight: 600,
                  lineHeight: "42px",
                  letterSpacing: "-0.784px",
                }}
              >
                {data.top_keyword}
              </Typography>
            </Box>
          </Box>

          {/* 하단 프레임: 차트 + 우측 패널 */}
          <Box
            sx={{
              display: "flex",
              padding: "16px",
              alignItems: "stretch",
              gap: "12px",
              alignSelf: "stretch",
              borderRadius: "0 0 12px 12px",
              backgroundColor: "static.white",
              backdropFilter: "blur(2.9px)",
            }}
          >
            {/* 좌측 차트 영역 */}
            <Box
              sx={{
                display: "flex",
                height: "794px",
                alignItems: "flex-start",
                gap: "8px",
                flex: "1 0 0",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  height: "794px",
                  flexDirection: "column",
                  alignItems: "flex-start",
                  gap: "8px",
                  flex: "1 0 0",
                }}
              >
                {/* 오래된 논문 / 최신 논문 라벨 */}
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "8px",
                    alignSelf: "stretch",
                  }}
                >
                  <Box sx={labelBoxSx}>
                    <Typography sx={labelTextSx}>오래된 논문</Typography>
                  </Box>
                  <Box sx={labelBoxSx}>
                    <Typography sx={labelTextSx}>최신 논문</Typography>
                  </Box>
                </Box>

                {/* 차트 */}
                <Box
                  sx={{
                    flex: 1,
                    alignSelf: "stretch",
                    borderRadius: "8px",
                    background:
                      "linear-gradient(180deg, #F7F8FA 0%, #E6F9F0 100%)",
                    position: "relative",
                    padding: "24px",
                    boxSizing: "border-box",
                    minHeight: 0,
                  }}
                >
                  <ChartAxisOverlay />
                  <Box
                    sx={{
                      position: "relative",
                      width: "100%",
                      height: "100%",
                      zIndex: 2,
                    }}
                  >
                    <BubbleChart
                      papers={chartData}
                      selectedPaperIds={selectedPaperIds}
                      onDotClick={setSelectedPaperIds}
                      onBackgroundClick={() => setSelectedPaperIds(null)}
                    />
                  </Box>
                </Box>
              </Box>

              {/* 세로 라벨 (인용 높음 / 인용 낮음) */}
              <Box
                sx={{
                  display: "flex",
                  width: "40px",
                  flexDirection: "column",
                  alignItems: "flex-start",
                  gap: "8px",
                  alignSelf: "stretch",
                  paddingTop: "40px",
                }}
              >
                <Box
                  sx={{
                    ...labelBoxSx,
                    flex: 1,
                    writingMode: "vertical-rl",
                    transform: "rotate(0deg)",
                  }}
                >
                  <Typography sx={labelTextSx}>인용 높음</Typography>
                </Box>
                <Box
                  sx={{
                    ...labelBoxSx,
                    flex: 1,
                    writingMode: "vertical-rl",
                    transform: "rotate(0deg)",
                  }}
                >
                  <Typography sx={labelTextSx}>인용 낮음</Typography>
                </Box>
              </Box>
            </Box>

            {/* 우측 패널 */}
            <Box
              sx={{
                width: "455px",
                position: "relative",
                flexShrink: 0,
                alignSelf: "stretch",
              }}
            >
              <Box
                sx={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                }}
              >
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
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default RecentPaperFullscreenPage;
