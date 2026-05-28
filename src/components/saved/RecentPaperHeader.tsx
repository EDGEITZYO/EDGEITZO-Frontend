import { Box, Typography, IconButton, Select, MenuItem } from "@mui/material";
import { type SelectChangeEvent } from "@mui/material/Select";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import SearchIcon from "@mui/icons-material/Search";
import ViewListIcon from "@mui/icons-material/ViewList";
import ShowChartIcon from "@mui/icons-material/ShowChart";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { type SxProps, type Theme } from "@mui/material/styles";
import { type PeriodMode, type ViewMode } from "../../types/saved";
import { useState } from "react";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import CloseFullscreenIcon from "@mui/icons-material/CloseFullscreen";

interface RecentPaperHeaderProps {
  periodMode: PeriodMode;
  currentDate: Date;
  viewMode: ViewMode;
  variant?: "normal" | "fullscreen";
  onPeriodModeChange: (mode: PeriodMode) => void;
  onDatePrev: () => void;
  onDateNext: () => void;
  onDateSelect: (date: Date) => void;
  onViewModeChange: (mode: ViewMode) => void;
  onClose?: () => void;
}

const headerSx: SxProps<Theme> = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  flexShrink: 0,
};

const leftSx: SxProps<Theme> = {
  display: "flex",
  alignItems: "center",
  gap: "10px",
};

const periodSelectSx: SxProps<Theme> = {
  height: "40px",
  borderRadius: "12px",
  backgroundColor: "line.neutral",
  fontSize: "18px",
  fontWeight: 600,
  color: "static.black",
  "& .MuiOutlinedInput-notchedOutline": { border: "none" },
  "& .MuiSelect-select": { padding: "8px 14px" },
};

const dateNavSx: SxProps<Theme> = {
  display: "inline-flex",
  alignItems: "center",
  gap: "5px",
  padding: "0px 7px",
  borderRadius: "12px",
  backgroundColor: "line.neutral",
  height: "40px",
};

const dateTextSx: SxProps<Theme> = {
  fontSize: "18px",
  fontWeight: 600,
  color: "static.black",
  textAlign: "center",
};

const rightSx: SxProps<Theme> = {
  display: "inline-flex",
  alignItems: "center",
  padding: "3px",
  borderRadius: "12px",
  backgroundColor: "line.neutral",
};

const iconButtonSx = (isActive: boolean): SxProps<Theme> => ({
  width: 34,
  height: 34,
  borderRadius: "10px",
  backgroundColor: isActive ? "background.default" : "transparent",
  "&:hover": {
    backgroundColor: isActive ? "background.default" : "fill.normal",
  },
});

const formatDate = (date: Date, mode: PeriodMode): string => {
  if (mode === "day") {
    return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, "0")}.${String(date.getDate()).padStart(2, "0")}`;
  }
  const month = date.getMonth() + 1;
  const weekNumber = Math.ceil(date.getDate() / 7);
  return `${month}월 ${weekNumber}주`;
};

const RecentPaperHeader = ({
  periodMode,
  currentDate,
  viewMode,
  variant = "normal",
  onPeriodModeChange,
  onDatePrev,
  onDateNext,
  onDateSelect,
  onViewModeChange,
  onClose,
}: RecentPaperHeaderProps) => {
  const isToday = new Date().toDateString() === currentDate.toDateString();
  const isFutureWeek =
    periodMode === "week" &&
    Math.ceil(currentDate.getDate() / 7) >=
      Math.ceil(new Date().getDate() / 7) &&
    currentDate.getMonth() >= new Date().getMonth() &&
    currentDate.getFullYear() >= new Date().getFullYear();

  const handlePeriodChange = (e: SelectChangeEvent) => {
    onPeriodModeChange(e.target.value as PeriodMode);
  };

  const [calendarOpen, setCalendarOpen] = useState(false);

  return (
    <Box sx={headerSx}>
      <Box sx={leftSx}>
        {/* 일/주 드롭다운 */}
        <Select
          value={periodMode}
          onChange={handlePeriodChange}
          sx={periodSelectSx}
          IconComponent={KeyboardArrowDownIcon}
        >
          <MenuItem value="day">일</MenuItem>
          <MenuItem value="week">주</MenuItem>
        </Select>

        {/* 날짜 네비게이션 */}
        <Box sx={dateNavSx} data-date-nav>
          <IconButton size="small" sx={{ p: "4px" }} onClick={onDatePrev}>
            <ChevronLeftIcon sx={{ fontSize: 24, color: "static.black" }} />
          </IconButton>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              open={calendarOpen}
              onOpen={() => setCalendarOpen(true)}
              onClose={() => setCalendarOpen(false)}
              value={dayjs(currentDate)}
              onChange={(newValue) => {
                if (newValue) {
                  onDateSelect(newValue.toDate());
                }
                setCalendarOpen(false);
              }}
              maxDate={dayjs()}
              slots={{
                field: () => (
                  <Typography
                    sx={{ ...dateTextSx, cursor: "pointer" }}
                    onClick={() => setCalendarOpen(true)}
                  >
                    {formatDate(currentDate, periodMode)}
                  </Typography>
                ),
              }}
              slotProps={{
                popper: {
                  anchorEl: () =>
                    document.querySelector("[data-date-nav]") as Element,
                  placement: "bottom-start",
                },
              }}
            />
          </LocalizationProvider>
          <IconButton
            size="small"
            sx={{ p: "4px" }}
            onClick={onDateNext}
            disabled={periodMode === "day" ? isToday : isFutureWeek}
          >
            <ChevronRightIcon
              sx={{
                fontSize: 24,
                color: (periodMode === "day" ? isToday : isFutureWeek)
                  ? "label.disable"
                  : "static.black",
              }}
            />
          </IconButton>
        </Box>
      </Box>

      {/* 우측 아이콘 */}
      <Box sx={{ display: "flex", alignItems: "center", gap: "8px" }}>
        {/* 돋보기 - normal에서만 표시 */}
        {variant === "normal" && (
          <IconButton
            size="small"
            sx={{
              width: 40,
              height: 40,
              padding: "8px",
              borderRadius: "12px",
              border: "1px solid",
              borderColor: "line.normal",
              backgroundColor: "background.default",
              "&:hover": { backgroundColor: "fill.normal" },
            }}
          >
            <SearchIcon sx={{ fontSize: 24, color: "label.assistive" }} />
          </IconButton>
        )}

        {/* normal: 리스트/차트 토글, fullscreen: 축소 버튼 */}
        {variant === "normal" ? (
          <Box sx={rightSx}>
            <IconButton
              size="small"
              sx={iconButtonSx(viewMode === "list")}
              onClick={() => onViewModeChange("list")}
            >
              <ViewListIcon
                sx={{
                  fontSize: 24,
                  color:
                    viewMode === "list" ? "static.black" : "label.assistive",
                }}
              />
            </IconButton>
            <IconButton
              size="small"
              sx={iconButtonSx(viewMode === "chart")}
              onClick={() => onViewModeChange("chart")}
            >
              <ShowChartIcon
                sx={{
                  fontSize: 24,
                  color:
                    viewMode === "chart" ? "static.black" : "label.assistive",
                }}
              />
            </IconButton>
          </Box>
        ) : (
          <IconButton
            size="small"
            sx={{
              width: 34,
              height: 34,
              borderRadius: "10px",
              backgroundColor: "background.default",
              "&:hover": { backgroundColor: "fill.normal" },
            }}
            onClick={onClose}
          >
            <CloseFullscreenIcon
              sx={{ fontSize: 24, color: "label.alternative" }}
            />
          </IconButton>
        )}
      </Box>
    </Box>
  );
};

export default RecentPaperHeader;
