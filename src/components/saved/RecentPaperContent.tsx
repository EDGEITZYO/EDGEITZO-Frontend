import { useState } from "react";
import { Box, Typography } from "@mui/material";
import { type SxProps, type Theme } from "@mui/material/styles";
import RecentPaperHeader from "./RecentPaperHeader";
import RecentPaperListView from "./RecentPaperListView";
import RecentPaperChartView from "./RecentPaperChartView";
import { type PeriodMode, type ViewMode } from "../../types/saved";

const titleSx: SxProps<Theme> = {
  fontSize: "24px",
  fontWeight: 600,
  color: "static.black",
  mb: "16px",
};

const baseContainerSx: SxProps<Theme> = {
  display: "flex",
  flexDirection: "column",
  flex: 1,
  padding: "24px 40px",
};

const listContainerSx: SxProps<Theme> = {
  ...baseContainerSx,
  overflow: "visible",
};

const chartContainerSx: SxProps<Theme> = {
  ...baseContainerSx,
  height: "calc(100vh - 65px)", // Header 높이에 맞게 조정
  minHeight: 0,
  overflow: "hidden",
};

const chartViewWrapperSx: SxProps<Theme> = {
  flex: 1,
  minHeight: 0,
  overflow: "hidden",
  display: "flex",
  flexDirection: "column",
};

const RecentPaperContent = () => {
  const [periodMode, setPeriodMode] = useState<PeriodMode>("day");
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [viewMode, setViewMode] = useState<ViewMode>("list");

  const handleDatePrev = () => {
    setCurrentDate((prev) => {
      const next = new Date(prev);
      if (periodMode === "day") {
        next.setDate(next.getDate() - 1);
      } else {
        next.setDate(next.getDate() - 7);
      }
      return next;
    });
  };

  const handleDateNext = () => {
    setCurrentDate((prev) => {
      const next = new Date(prev);
      if (periodMode === "day") {
        next.setDate(next.getDate() + 1);
      } else {
        next.setDate(next.getDate() + 7);
      }
      return next;
    });
  };

  const handlePeriodModeChange = (mode: PeriodMode) => {
    setPeriodMode(mode);
    setCurrentDate(new Date());
  };

  const handleDateSelect = (date: Date) => {
    setCurrentDate(date);
  };

  return (
  <Box sx={viewMode === "chart" ? chartContainerSx : listContainerSx}>
    <Typography sx={titleSx}>최근 읽은 논문</Typography>

    <RecentPaperHeader
      periodMode={periodMode}
      currentDate={currentDate}
      viewMode={viewMode}
      onPeriodModeChange={handlePeriodModeChange}
      onDatePrev={handleDatePrev}
      onDateNext={handleDateNext}
      onDateSelect={handleDateSelect}
      onViewModeChange={setViewMode}
    />

    {viewMode === "list" && (
      <RecentPaperListView
        periodMode={periodMode}
        currentDate={currentDate}
      />
    )}

    {viewMode === "chart" && (
      <Box sx={chartViewWrapperSx}>
        <RecentPaperChartView
          periodMode={periodMode}
          currentDate={currentDate}
        />
      </Box>
    )}
  </Box>
);
};

export default RecentPaperContent;
