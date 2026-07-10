import { useState } from "react";
import { Box, Typography, IconButton, Select, MenuItem } from "@mui/material";
import { type SelectChangeEvent } from "@mui/material/Select";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import ViewListIcon from "@mui/icons-material/ViewList";
import ShowChartIcon from "@mui/icons-material/ShowChart";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { type PeriodMode, type ViewMode } from "../../types/saved";

interface RecentPaperHeaderProps {
  periodMode: PeriodMode;
  currentDate: Date;
  viewMode: ViewMode;
  showViewToggle?: boolean;
  onPeriodModeChange: (mode: PeriodMode) => void;
  onDatePrev: () => void;
  onDateNext: () => void;
  onDateSelect: (date: Date) => void;
  onViewModeChange: (mode: ViewMode) => void;
}

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
  showViewToggle = true,
  onPeriodModeChange,
  onDatePrev,
  onDateNext,
  onDateSelect,
  onViewModeChange,
}: RecentPaperHeaderProps) => {
  const [calendarOpen, setCalendarOpen] = useState(false);

  const isToday = new Date().toDateString() === currentDate.toDateString();
  const isFutureWeek =
    periodMode === "week" &&
    Math.ceil(currentDate.getDate() / 7) >=
      Math.ceil(new Date().getDate() / 7) &&
    currentDate.getMonth() >= new Date().getMonth() &&
    currentDate.getFullYear() >= new Date().getFullYear();

  const isNextDisabled = periodMode === "day" ? isToday : isFutureWeek;

  const handlePeriodChange = (e: SelectChangeEvent) => {
    onPeriodModeChange(e.target.value as PeriodMode);
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
        alignSelf: "stretch",
      }}
    >
      {/* 좌측: 일/주 선택 + 날짜 선택 */}
      <Box sx={{ display: "flex", alignItems: "center", gap: "12px" }}>
        {/* 일/주 선택 */}
        <Select
          value={periodMode}
          onChange={handlePeriodChange}
          IconComponent={KeyboardArrowDownIcon}
          sx={{
            width: "164px",
            height: "42px",
            borderRadius: "216px",
            backgroundColor: "background.default",
            fontSize: "16px",
            fontWeight: 400,
            color: "label.neutral",
            letterSpacing: "-0.336px",
            "& .MuiOutlinedInput-notchedOutline": { border: "none" },
            "& .MuiSelect-select": { padding: "8px 8px 8px 16px" },
            "& .MuiSelect-icon": {
              width: "20px",
              height: "20px",
              top: "50%",
              transform: "translateY(-50%)",
              right: "10px",
            },
          }}
        >
          <MenuItem value="day">일</MenuItem>
          <MenuItem value="week">주</MenuItem>
        </Select>

        {/* 날짜 선택 */}
        <Box
          data-date-nav
          sx={{
            display: "flex",
            width: "164px",
            height: "42px",
            padding: "8px 0",
            justifyContent: "space-between",
            alignItems: "center",
            borderRadius: "216px",
            backgroundColor: "background.default",
          }}
        >
          <Box
            sx={{
              display: "flex",
              width: "40px",
              height: "40px",
              padding: "9px 10px 11px 10px",
              justifyContent: "center",
              alignItems: "center",
              cursor: "pointer",
            }}
            onClick={onDatePrev}
          >
            <ChevronLeftIcon
              sx={{ width: "20px", height: "20px", flexShrink: 0 }}
            />
          </Box>

          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              open={calendarOpen}
              onOpen={() => setCalendarOpen(true)}
              onClose={() => setCalendarOpen(false)}
              value={dayjs(currentDate)}
              onChange={(newValue) => {
                if (newValue) onDateSelect(newValue.toDate());
                setCalendarOpen(false);
              }}
              maxDate={dayjs()}
              slots={{
                field: () => (
                  <Typography
                    onClick={() => setCalendarOpen(true)}
                    sx={{
                      fontSize: "16px",
                      fontWeight: 400,
                      color: "label.neutral",
                      letterSpacing: "-0.336px",
                      lineHeight: "24px",
                      cursor: "pointer",
                      userSelect: "none",
                      whiteSpace: "nowrap",
                    }}
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

          <Box
            sx={{
              display: "flex",
              width: "40px",
              height: "40px",
              padding: "9px 10px 11px 10px",
              justifyContent: "center",
              alignItems: "center",
              cursor: isNextDisabled ? "default" : "pointer",
            }}
            onClick={() => !isNextDisabled && onDateNext()}
          >
            <ChevronRightIcon
              sx={{
                width: "20px",
                height: "20px",
                flexShrink: 0,
                color: isNextDisabled ? "label.disable" : "inherit",
              }}
            />
          </Box>
        </Box>
      </Box>

      {/* 우측: 리스트/차트 토글 */}
      {showViewToggle && (
        <Box
          sx={{
            display: "flex",
            height: "44px",
            padding: "4px",
            alignItems: "center",
            borderRadius: "34px",
            backgroundColor: "fill.strong",
          }}
        >
          <IconButton
            onClick={() => onViewModeChange("list")}
            sx={{
              display: "flex",
              width: "44px",
              height: "36px",
              padding: "8px 13px",
              justifyContent: "center",
              alignItems: "center",
              borderRadius: "24px",
              backgroundColor:
                viewMode === "list" ? "label.normal" : "transparent",
              "&:hover": {
                backgroundColor:
                  viewMode === "list" ? "label.normal" : "fill.normal",
              },
            }}
          >
            <ViewListIcon
              sx={{
                width: "24px",
                height: "24px",
                flexShrink: 0,
                color:
                  viewMode === "list" ? "static.white" : "label.alternative",
              }}
            />
          </IconButton>
          <IconButton
            onClick={() => onViewModeChange("chart")}
            sx={{
              display: "flex",
              width: "44px",
              height: "36px",
              padding: "8px 12px",
              justifyContent: "center",
              alignItems: "center",
              borderRadius: "24px",
              backgroundColor:
                viewMode === "chart" ? "label.normal" : "transparent",
              "&:hover": {
                backgroundColor:
                  viewMode === "chart" ? "label.normal" : "fill.normal",
              },
            }}
          >
            <ShowChartIcon
              sx={{
                width: "24px",
                height: "24px",
                flexShrink: 0,
                color:
                  viewMode === "chart" ? "static.white" : "label.alternative",
              }}
            />
          </IconButton>
        </Box>
      )}
    </Box>
  );
};

export default RecentPaperHeader;
