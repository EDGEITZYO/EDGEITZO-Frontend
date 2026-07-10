import { useEffect, useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Box, Typography, useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { type SxProps, type Theme } from "@mui/material/styles";
import RecentPaperHeader from "./RecentPaperHeader";
import RecentPaperListView from "./RecentPaperListView";
import RecentPaperChartView from "./RecentPaperChartView";
import {
  type PeriodMode,
  type ViewMode,
  type ChartFilter,
} from "../../types/saved";
import {
  parseDateParam,
  formatDateParam,
  isPeriodMode,
  isViewMode,
} from "../../utils/savedUtils";

const titleSx: SxProps<Theme> = {
  display: "-webkit-box",
  WebkitBoxOrient: "vertical",
  WebkitLineClamp: 1,
  overflow: "hidden",
  color: "label.normal",
  textOverflow: "ellipsis",
  fontSize: "24px",
  fontWeight: 600,
  lineHeight: "36px",
  letterSpacing: "-0.528px",
};

const RecentPaperContent = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isDesktop = useMediaQuery(theme.breakpoints.up("lg"));
  const [searchParams, setSearchParams] = useSearchParams();

  const modeParam = searchParams.get("mode");
  const viewParam = searchParams.get("view");

  const periodMode: PeriodMode = isPeriodMode(modeParam) ? modeParam : "day";
  const viewMode: ViewMode = isViewMode(viewParam) ? viewParam : "list";
  const currentDate: Date = parseDateParam(searchParams.get("date"));

  const updateParams = useCallback(
    (updates: Record<string, string | null>) => {
      const next = new URLSearchParams(searchParams);
      Object.entries(updates).forEach(([key, value]) => {
        if (value === null || value === "") next.delete(key);
        else next.set(key, value);
      });
      setSearchParams(next, { replace: true });
    },
    [searchParams, setSearchParams],
  );

  useEffect(() => {
    if (isMobile && viewMode === "chart") {
      updateParams({ view: "list" });
    }
  }, [isMobile, viewMode, updateParams]);

  const handlePeriodModeChange = (mode: PeriodMode) => {
    updateParams({ view: viewMode, mode, date: formatDateParam(new Date()) });
  };

  const handleDatePrev = () => {
    const next = new Date(currentDate);
    if (periodMode === "day") next.setDate(next.getDate() - 1);
    else next.setDate(next.getDate() - 7);
    updateParams({
      view: viewMode,
      mode: periodMode,
      date: formatDateParam(next),
    });
  };

  const handleDateNext = () => {
    const next = new Date(currentDate);
    if (periodMode === "day") next.setDate(next.getDate() + 1);
    else next.setDate(next.getDate() + 7);
    updateParams({
      view: viewMode,
      mode: periodMode,
      date: formatDateParam(next),
    });
  };

  const handleDateSelect = (date: Date) => {
    updateParams({
      view: viewMode,
      mode: periodMode,
      date: formatDateParam(date),
    });
  };

  const handleViewModeChange = (mode: ViewMode) => {
    updateParams({
      view: mode,
      mode: periodMode,
      date: formatDateParam(currentDate),
    });
  };

  const handleFilterChange = (filter: ChartFilter) => {
    updateParams({
      view: viewMode,
      mode: periodMode,
      date: formatDateParam(currentDate),
      publish: filter.publish ?? null,
      citation: filter.citation ?? null,
    });
  };

  const handlePaperClick = (paperId: string) => {
    const returnTo = `/saved/recent?${searchParams.toString()}`;
    navigate(`/papers/${paperId}?returnTo=${encodeURIComponent(returnTo)}`);
  };

  // 모바일: 헤더/필터 없이 논문 목록만
  if (isMobile) {
    return (
      <Box
        sx={{
          pb: "64px",
          display: "flex",
          flexDirection: "column",
          gap: "24px",
        }}
      >
        <Box
          sx={{
            display: "flex",
            padding: "16px",
            flexDirection: "column",
            alignItems: "flex-start",
            gap: "16px",
            backgroundColor: "static.white",
          }}
        >
          <RecentPaperListView
            periodMode={periodMode}
            currentDate={currentDate}
            onPaperClick={handlePaperClick}
          />
        </Box>
      </Box>
    );
  }

  const paddingTop = isDesktop ? "170px" : "0px";

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start",
        alignItems: isDesktop ? "center" : "stretch",
        gap: "24px",
        pt: paddingTop,
        pb: "64px",
        boxSizing: "border-box",
        width: "100%",
        maxWidth: isDesktop ? "1200px" : "none",
      }}
    >
      {/* 최근 읽은 논문 타이틀 + 헤더 묶음 */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "flex-start",
          gap: "16px",
          alignSelf: "stretch",
        }}
      >
        {/* 타이틀 */}
        <Box
          sx={{
            display: "flex",
            padding: "0 4px",
            alignItems: "center",
            gap: "8px",
            alignSelf: "stretch",
          }}
        >
          <Typography sx={titleSx}>최근 읽은 논문</Typography>
        </Box>

        {/* 헤더 (일/주 선택 + 날짜 + 뷰모드 토글) */}
        <RecentPaperHeader
          periodMode={periodMode}
          currentDate={currentDate}
          viewMode={viewMode}
          onPeriodModeChange={handlePeriodModeChange}
          onDatePrev={handleDatePrev}
          onDateNext={handleDateNext}
          onDateSelect={handleDateSelect}
          onViewModeChange={handleViewModeChange}
        />
      </Box>

      {/* 뷰 콘텐츠 */}
      <Box
        sx={{
          width: "100%",
        }}
      >
        {viewMode === "list" && (
          <Box
            sx={{
              display: "flex",
              padding: "16px",
              alignItems: "flex-start",
              alignContent: "flex-start",
              gap: "8px",
              flexWrap: "wrap",
              borderRadius: "12px",
              border: "1px solid #FAFAFC",
              backgroundColor: "static.white",
              backdropFilter: "blur(2.9px)",
              boxSizing: "border-box",
              width: "100%",
            }}
          >
            <RecentPaperListView
              periodMode={periodMode}
              currentDate={currentDate}
              onPaperClick={handlePaperClick}
            />
          </Box>
        )}
        {viewMode === "chart" && (
          <Box
            sx={{
              display: "flex",
              padding: "16px",
              alignItems: isDesktop ? "flex-start" : "stretch",
              gap: "8px",
              width: "100%",
              boxSizing: "border-box",
              alignSelf: "stretch",
              borderRadius: "12px",
              backgroundColor: "static.white",
              backdropFilter: "blur(2.9px)",
            }}
          >
            <RecentPaperChartView
              periodMode={periodMode}
              currentDate={currentDate}
              onPaperClick={handlePaperClick}
              onFilterChange={handleFilterChange}
            />
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default RecentPaperContent;
