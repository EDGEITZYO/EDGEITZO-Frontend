import { useEffect, useCallback, useState, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Box, Typography, useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { type SxProps, type Theme } from "@mui/material/styles";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
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

const formatDate = (date: Date, mode: PeriodMode): string => {
  if (mode === "day") {
    return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, "0")}.${String(date.getDate()).padStart(2, "0")}`;
  }
  const month = date.getMonth() + 1;
  const weekNumber = Math.ceil(date.getDate() / 7);
  return `${month}월 ${weekNumber}주`;
};

const periodOptions: { value: PeriodMode; label: string }[] = [
  { value: "day", label: "일" },
  { value: "week", label: "주" },
];

const RecentPaperContent = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isDesktop = useMediaQuery(theme.breakpoints.up("lg"));
  const [searchParams, setSearchParams] = useSearchParams();
  const [mobileDropdownOpen, setMobileDropdownOpen] = useState(false);
  const mobileDropdownRef = useRef<HTMLDivElement>(null);

  const modeParam = searchParams.get("mode");
  const viewParam = searchParams.get("view");

  const periodMode: PeriodMode = isPeriodMode(modeParam) ? modeParam : "day";
  const viewMode: ViewMode = isViewMode(viewParam) ? viewParam : "list";
  const currentDate: Date = parseDateParam(searchParams.get("date"));

  const isToday = new Date().toDateString() === currentDate.toDateString();
  const isFutureWeek =
    periodMode === "week" &&
    Math.ceil(currentDate.getDate() / 7) >=
      Math.ceil(new Date().getDate() / 7) &&
    currentDate.getMonth() >= new Date().getMonth() &&
    currentDate.getFullYear() >= new Date().getFullYear();
  const isNextDisabled = periodMode === "day" ? isToday : isFutureWeek;

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        mobileDropdownRef.current &&
        !mobileDropdownRef.current.contains(e.target as Node)
      ) {
        setMobileDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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

  const selectedLabel =
    periodOptions.find((o) => o.value === periodMode)?.label ?? "일";

  if (isMobile) {
    return (
      <Box sx={{ pb: "64px", display: "flex", flexDirection: "column" }}>
        {/* 모바일 필터 바 */}
        <Box
          sx={{
            display: "flex",
            padding: "0 16px",
            justifyContent: "space-between",
            alignItems: "center",
            alignSelf: "stretch",
          }}
        >
          {/* 좌측: 일/주 드롭다운 */}
          <Box ref={mobileDropdownRef} sx={{ position: "relative" }}>
            <Box
              onClick={() => setMobileDropdownOpen((prev) => !prev)}
              sx={{
                display: "flex",
                height: "36px",
                padding: "0 8px 0 16px",
                justifyContent: "center",
                alignItems: "center",
                gap: "4px",
                borderRadius: "216px",
                backgroundColor: "background.paper",
                cursor: "pointer",
              }}
            >
              <Typography
                sx={{
                  display: "-webkit-box",
                  WebkitBoxOrient: "vertical",
                  WebkitLineClamp: 1,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  color: "label.neutral",
                  fontSize: "13px",
                  fontWeight: 400,
                  lineHeight: "22px",
                  letterSpacing: "-0.26px",
                }}
              >
                {selectedLabel}
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  padding: "7px 8px 9px 8px",
                  justifyContent: "center",
                  alignItems: "center",
                  flex: "1 0 0",
                  alignSelf: "stretch",
                  borderRadius: "24px",
                }}
              >
                <KeyboardArrowDownIcon
                  sx={{
                    width: "20px",
                    height: "20px",
                    flexShrink: 0,
                    transition: "transform 0.2s",
                    transform: mobileDropdownOpen
                      ? "rotate(180deg)"
                      : "rotate(0deg)",
                  }}
                />
              </Box>
            </Box>

            {/* 드롭다운 메뉴 */}
            {mobileDropdownOpen && (
              <Box
                sx={{
                  position: "absolute",
                  top: "calc(100% + 4px)",
                  left: 0,
                  zIndex: 100,
                  display: "flex",
                  width: "76px",
                  padding: "4px",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "3px",
                  borderRadius: "20px",
                  border: "1px solid",
                  borderColor: "label.alternative",
                  backgroundColor: "background.default",
                }}
              >
                {periodOptions.map((option) => (
                  <Box
                    key={option.value}
                    onClick={() => {
                      handlePeriodModeChange(option.value);
                      setMobileDropdownOpen(false);
                    }}
                    sx={{
                      display: "flex",
                      height: "36px",
                      padding: "0 8px 0 16px",
                      alignItems: "center",
                      gap: "4px",
                      alignSelf: "stretch",
                      borderRadius: "216px",
                      backgroundColor:
                        periodMode === option.value
                          ? "background.paper"
                          : "transparent",
                      cursor: "pointer",
                      "&:hover": { backgroundColor: "background.paper" },
                    }}
                  >
                    <Typography
                      sx={{
                        color: "label.neutral",
                        fontSize: "13px",
                        fontWeight: 400,
                        lineHeight: "22px",
                        letterSpacing: "-0.26px",
                      }}
                    >
                      {option.label}
                    </Typography>
                  </Box>
                ))}
              </Box>
            )}
          </Box>

          {/* 우측: 날짜 네비게이션 */}
          <Box
            sx={{
              display: "flex",
              height: "36px",
              alignItems: "center",
              borderRadius: "216px",
              backgroundColor: "background.paper",
            }}
          >
            <Box
              onClick={handleDatePrev}
              sx={{
                display: "flex",
                padding: "7px 8px 9px 8px",
                justifyContent: "center",
                alignItems: "center",
                flex: "1 0 0",
                alignSelf: "stretch",
                borderRadius: "24px",
                cursor: "pointer",
              }}
            >
              <ChevronLeftIcon
                sx={{ width: "20px", height: "20px", flexShrink: 0 }}
              />
            </Box>
            <Typography
              sx={{
                display: "-webkit-box",
                WebkitBoxOrient: "vertical",
                WebkitLineClamp: 1,
                overflow: "hidden",
                textOverflow: "ellipsis",
                color: "label.neutral",
                fontSize: "13px",
                fontWeight: 400,
                lineHeight: "22px",
                letterSpacing: "-0.26px",
              }}
            >
              {formatDate(currentDate, periodMode)}
            </Typography>
            <Box
              onClick={() => !isNextDisabled && handleDateNext()}
              sx={{
                display: "flex",
                padding: "7px 8px 9px 8px",
                justifyContent: "center",
                alignItems: "center",
                flex: "1 0 0",
                alignSelf: "stretch",
                borderRadius: "24px",
                cursor: isNextDisabled ? "default" : "pointer",
              }}
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

        {/* 논문 목록 */}
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
