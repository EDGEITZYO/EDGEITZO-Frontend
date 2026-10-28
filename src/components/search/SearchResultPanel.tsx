import { useState, useRef, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { useQueryClient } from "@tanstack/react-query";
import {
  Box,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  useMediaQuery,
  CircularProgress,
  Slider,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import CloseIcon from "@mui/icons-material/Close";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import {
  type FeedbackType,
  type SortOrder,
  type SearchFilters,
  type SearchPaper,
  type SelectionReasonState,
} from "../../types/search";
import { type PaperType } from "../../types/paper";
import PaperListCard from "./PaperListCard";
import PaperDetailContent from "../common/PaperDetailContent";
import { bookmarkApi } from "../../api/bookmark";
import BookmarkFolderSelectDialog from "../common/BookmarkFolderSelectDialog";
import { bookmarkKeys } from "../../queries/keys";

type ResultPanelView = "list" | "detail";

interface SearchResultPanelProps {
  panelData: {
    result_items: SearchPaper[];
    filters: SearchFilters;
    total_count: number;
  } | null;
  feedbacks: Record<string, FeedbackType>;
  sortOrder: SortOrder;
  onClose: () => void;
  onFeedback: (paperId: string, feedback: FeedbackType) => void;
  onSortChange: (sort: SortOrder) => void;
  isDesktop: boolean;
  onDetailOpen: () => void;
  onDetailClose: () => void;
  bookmarkMap: Record<string, boolean>;
  onBookmarkToggle: (paperId: string, isBookmarked: boolean) => void;
  filterYearStart: number | null;
  filterYearEnd: number | null;
  filterPaperType: string | null;
  filterKci: boolean;
  filterSci: boolean;
  onFilterChange: (filters: {
    yearStart: number | null;
    yearEnd: number | null;
    paperType: string | null;
    kci: boolean;
    sci: boolean;
  }) => void;
  isFilterLoading: boolean;
  selectionReasonMap: Record<string, SelectionReasonState>;
  onPaperVisible: (paperId: string) => void;
  sessionId: string | null;
  mobileBackRef?: React.MutableRefObject<(() => void) | null>;
}

const SORT_OPTIONS: { label: string; value: SortOrder }[] = [
  { label: "관련도순", value: "relevance" },
  { label: "최신순", value: "year_desc" },
  { label: "오래된순", value: "year_asc" },
  { label: "인용높은순", value: "citation_desc" },
];

const YEAR_MIN = 2016;
const YEAR_MAX = 2025;

const PAPER_TYPE_OPTIONS: { label: string; value: PaperType }[] = [
  { label: "학술 저널", value: "학술 저널" },
  { label: "박사학위 논문", value: "박사학위 논문" },
  { label: "석사학위 논문", value: "석사학위 논문" },
];

// ─── 드롭다운 필터 ────────────────────────────────────────

interface DropdownFilterProps {
  label: string;
  options: { label: string; value: string | number }[];
  selectedValue: string | number | null;
  onSelect: (value: string | number | "__clear__") => void;
  isMobile: boolean;
  clearable?: boolean;
}

const DropdownFilter = ({
  label,
  options,
  selectedValue,
  onSelect,
  isMobile,
  clearable = false,
}: DropdownFilterProps) => {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const isSelected = clearable && selectedValue !== null;
  const selectedLabel =
    options.find((o) => o.value === selectedValue)?.label ?? label;

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isSelected) return;
    setAnchorEl(e.currentTarget);
  };

  const handleClear = (e: React.MouseEvent<SVGSVGElement>) => {
    e.stopPropagation();
    onSelect("__clear__");
  };

  // 변경 후
  return (
    <>
      <Box
        onClick={handleClick}
        sx={{
          display: "flex",
          height: isMobile ? "36px" : "42px",
          padding: isMobile ? "0 8px 0 16px" : "8px 8px 8px 16px",
          alignItems: "center",
          gap: isMobile ? "4px" : "16px",
          borderRadius: "216px",
          backgroundColor: isSelected ? "#1E2026" : "fill.normal",
          cursor: isSelected ? "default" : "pointer",
          flexShrink: 0,
        }}
      >
        <Typography
          sx={{
            whiteSpace: "nowrap",
            flexShrink: 0,
            color: isSelected
              ? "#FFF"
              : isMobile
                ? "label.neutral"
                : "label.alternative",
            fontSize: isMobile ? "13px" : "16px",
            fontWeight: 400,
            lineHeight: isMobile ? "22px" : "24px",
            letterSpacing: isMobile ? "-0.26px" : "-0.336px",
          }}
        >
          {selectedLabel}
        </Typography>
        <Box
          sx={{
            display: "flex",
            padding: isMobile ? "7px 8px 9px 8px" : "9px 10px 11px 10px",
            justifyContent: "center",
            alignItems: "center",
            borderRadius: "24px",
          }}
        >
          {isSelected ? (
            <CloseIcon
              onClick={handleClear}
              sx={{ width: 20, height: 20, color: "#FFF", cursor: "pointer" }}
            />
          ) : (
            <KeyboardArrowDownIcon
              sx={{
                width: 20,
                height: 20,
                transform: anchorEl !== null ? "rotate(180deg)" : "none",
              }}
            />
          )}
        </Box>
      </Box>
      <Menu
        anchorEl={anchorEl}
        open={anchorEl !== null}
        onClose={() => setAnchorEl(null)}
        slotProps={{
          paper: {
            sx: {
              borderRadius: "28px",
              border: "1px solid",
              borderColor: "label.alternative",
              boxShadow: "none",
              padding: "8px",
            },
          },
        }}
      >
        {options.map((option) => (
          <MenuItem
            key={option.value}
            selected={option.value === selectedValue}
            onClick={() => {
              onSelect(option.value);
              setAnchorEl(null);
            }}
            sx={{
              borderRadius: "216px",
              fontSize: isMobile ? "13px" : "16px",
              fontWeight: 400,
              lineHeight: isMobile ? "22px" : "24px",
              letterSpacing: isMobile ? "-0.26px" : "-0.336px",
              color: "label.normal",
              justifyContent: "center",
              "&.Mui-selected": { backgroundColor: "background.paper" },
              "&:hover": { backgroundColor: "background.paper" },
            }}
          >
            {option.label}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};

// ─── 토글 필터 ────────────────────────────────────────────

interface ToggleFilterProps {
  label: string;
  active: boolean;
  onToggle: () => void;
  isMobile: boolean;
}

const ToggleFilter = ({
  label,
  active,
  onToggle,
  isMobile,
}: ToggleFilterProps) => (
  <Box
    onClick={onToggle}
    sx={{
      display: "flex",
      height: isMobile ? "36px" : "auto",
      padding: isMobile ? "0 16px" : "8px 13px",
      justifyContent: "center",
      alignItems: "center",
      gap: isMobile ? "4px" : "10px",
      borderRadius: isMobile ? "216px" : "24px",
      backgroundColor: active
        ? "label.normal"
        : isMobile
          ? "background.paper"
          : "fill.normal",
      cursor: "pointer",
      flexShrink: 0,
    }}
  >
    <Typography
      sx={{
        whiteSpace: "nowrap",
        flexShrink: 0,
        color: active
          ? "#FAFAFC"
          : isMobile
            ? "label.neutral"
            : "label.alternative",
        fontSize: isMobile ? "13px" : "16px",
        fontWeight: 400,
        lineHeight: isMobile ? "22px" : "24px",
        letterSpacing: isMobile ? "-0.26px" : "-0.336px",
      }}
    >
      {label}
    </Typography>
  </Box>
);

// ─── SearchResultPanel ────────────────────────────────────

const SearchResultPanel = ({
  panelData,
  feedbacks,
  sortOrder,
  bookmarkMap,
  filterYearStart,
  filterYearEnd,
  filterPaperType,
  filterKci,
  filterSci,
  onClose,
  onFeedback,
  onSortChange,
  onDetailClose,
  onDetailOpen,
  onBookmarkToggle,
  onFilterChange,
  isDesktop,
  isFilterLoading,
  selectionReasonMap,
  onPaperVisible,
  sessionId,
  mobileBackRef,
}: SearchResultPanelProps) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const queryClient = useQueryClient();

  const [resultPanelView, setResultPanelView] =
    useState<ResultPanelView>("list");
  const [yearOpen, setYearOpen] = useState(false);
  const [tempRange, setTempRange] = useState<[number, number]>([
    YEAR_MIN,
    YEAR_MAX,
  ]);
  const yearRef = useRef<HTMLDivElement>(null);
  const yearMobilePanelRef = useRef<HTMLDivElement>(null);
  const [mobilePanelPos, setMobilePanelPos] = useState<{
    top: number;
    left: number;
  } | null>(null);

  const isYearApplied = filterYearStart !== null && filterYearEnd !== null;
  const isApplyDisabled =
    tempRange[0] === YEAR_MIN && tempRange[1] === YEAR_MAX;

  const handleYearToggle = () => {
    if (!yearOpen) {
      setTempRange([filterYearStart ?? YEAR_MIN, filterYearEnd ?? YEAR_MAX]);
      if (isMobile) {
        const rect = yearRef.current?.getBoundingClientRect();
        if (rect && rect.width > 0) {
          const panelWidth = 204;
          const left =
            rect.left + panelWidth > window.innerWidth
              ? window.innerWidth - panelWidth - 8
              : rect.left;
          setMobilePanelPos({ top: rect.bottom + 4, left });
        }
      }
    }
    setYearOpen((prev) => !prev);
  };

  const handleYearClear = (e: React.MouseEvent<SVGSVGElement>) => {
    e.stopPropagation();
    setYearOpen(false);
    onFilterChange({
      yearStart: null,
      yearEnd: null,
      paperType: filterPaperType,
      kci: filterKci,
      sci: filterSci,
    });
  };

  const handleSliderChange = (_: Event, newValue: number | number[]) => {
    const [s, end] = newValue as [number, number];
    setTempRange([s, end]);
  };

  const handleYearApply = () => {
    onFilterChange({
      yearStart: tempRange[0],
      yearEnd: tempRange[1],
      paperType: filterPaperType,
      kci: filterKci,
      sci: filterSci,
    });
    setYearOpen(false);
  };
  const [paperStack, setPaperStack] = useState<string[]>([]);
  const selectedPaperId = paperStack[paperStack.length - 1] ?? null;
  const [bookmarkDialogPaperId, setBookmarkDialogPaperId] = useState<
    string | null
  >(null);

  const papers = panelData?.result_items ?? [];
  const keywords = panelData?.filters.keywords ?? [];
  const keyword = keywords[0] ?? "";

  const handleBookmark = (paperId: string) => {
    if (bookmarkMap[paperId]) {
      // 북마크 해제
      bookmarkApi
        .removeBookmark(paperId)
        .then(() => {
          onBookmarkToggle(paperId, false);
          queryClient.invalidateQueries({ queryKey: bookmarkKeys.savedList() });
          queryClient.invalidateQueries({
            queryKey: bookmarkKeys.savedFolders(),
          });
          queryClient.invalidateQueries({
            queryKey: bookmarkKeys.savedTotal(),
          });
          queryClient.invalidateQueries({ queryKey: bookmarkKeys.folders() });
        })
        .catch(() => {});
    } else {
      // 북마크 추가 — 다이얼로그 열기
      setBookmarkDialogPaperId(paperId);
    }
  };

  const handleBack = useCallback(() => {
    if (paperStack.length > 1) {
      setPaperStack((prev) => prev.slice(0, -1));
    } else {
      setPaperStack([]);
      setResultPanelView("list");
      onDetailClose();
    }
  }, [paperStack.length, onDetailClose]);

  const handleDetailClose = () => {
    setPaperStack([]);
    setResultPanelView("list");
    onDetailClose();
  };

  useEffect(() => {
    if (mobileBackRef) {
      mobileBackRef.current = resultPanelView === "detail" ? handleBack : null;
    }
  }, [resultPanelView, handleBack, mobileBackRef]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      const insideRef = yearRef.current?.contains(target) ?? false;
      const insidePortal =
        yearMobilePanelRef.current?.contains(target) ?? false;
      if (!insideRef && !insidePortal) {
        setYearOpen(false);
      }
    };
    if (yearOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [yearOpen]);

  useEffect(() => {
    if (!yearOpen || !isMobile) return;
    const updatePosition = () => {
      const rect = yearRef.current?.getBoundingClientRect();
      if (rect) {
        const panelWidth = 204;
        const left =
          rect.left + panelWidth > window.innerWidth
            ? window.innerWidth - panelWidth - 8
            : rect.left;
        setMobilePanelPos({ top: rect.bottom + 4, left });
      }
    };
    window.addEventListener("scroll", updatePosition, true);
    return () => window.removeEventListener("scroll", updatePosition, true);
  }, [yearOpen, isMobile]);

  const handlePaperClick = (paperId: string) => {
    setPaperStack([paperId]);
    setResultPanelView("detail");
    onDetailOpen();
  };

  const filterBar = (isMobileFilter: boolean) => (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: isMobileFilter ? "4px" : "8px",
        ...(isMobileFilter
          ? {
              padding: "0 16px",
              overflowX: "auto",
              alignSelf: "stretch",
              "&::-webkit-scrollbar": { display: "none" },
            }
          : { flexWrap: "wrap" }),
      }}
    >
      <DropdownFilter
        label="관련도순"
        options={SORT_OPTIONS}
        selectedValue={sortOrder}
        onSelect={(value) => {
          if (value === "__clear__") return;
          onSortChange(value as SortOrder);
        }}
        isMobile={isMobileFilter}
      />
      {/* 발행연도 */}
      <Box ref={yearRef} sx={{ position: "relative" }}>
        <Box
          onClick={handleYearToggle}
          sx={{
            display: "flex",
            height: isMobileFilter ? "36px" : "42px",
            padding: isMobileFilter ? "0 8px 0 16px" : "8px 8px 8px 16px",
            alignItems: "center",
            gap: isMobileFilter ? "4px" : "16px",
            borderRadius: "216px",
            backgroundColor: isYearApplied ? "#1E2026" : "fill.normal",
            cursor: "pointer",
            flexShrink: 0,
          }}
        >
          <Typography
            sx={{
              whiteSpace: "nowrap",
              flexShrink: 0,
              color: isYearApplied
                ? "#FFF"
                : isMobileFilter
                  ? "label.neutral"
                  : "label.alternative",
              fontSize: isMobileFilter ? "13px" : "16px",
              fontWeight: 400,
              lineHeight: isMobileFilter ? "22px" : "24px",
              letterSpacing: isMobileFilter ? "-0.26px" : "-0.336px",
            }}
          >
            {isYearApplied
              ? `${filterYearStart} ~ ${filterYearEnd}년`
              : "발행연도"}
          </Typography>
          <Box
            sx={{
              display: "flex",
              padding: isMobileFilter
                ? "7px 8px 9px 8px"
                : "9px 10px 11px 10px",
              justifyContent: "center",
              alignItems: "center",
              borderRadius: "24px",
            }}
          >
            {isYearApplied ? (
              <CloseIcon
                onClick={handleYearClear}
                sx={{ width: 20, height: 20, color: "#FFF", cursor: "pointer" }}
              />
            ) : (
              <KeyboardArrowDownIcon
                sx={{
                  width: 20,
                  height: 20,
                  transform: yearOpen ? "rotate(180deg)" : "none",
                }}
              />
            )}
          </Box>
        </Box>

        {yearOpen &&
          (!isMobileFilter ? (
            // 데스크탑: position absolute
            <Box
              sx={{
                position: "absolute",
                top: "calc(100% + 4px)",
                left: 0,
                zIndex: 100,
                display: "flex",
                width: "240px",
                padding: "16px 8px",
                flexDirection: "column",
                alignItems: "center",
                gap: "0px",
                borderRadius: "16px",
                border: "1px solid",
                borderColor: "label.alternative",
                backgroundColor: "background.default",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  padding: "0 8px 8px 8px",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: "16px",
                  alignSelf: "stretch",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-start",
                    gap: "3px",
                    flex: "1 0 0",
                  }}
                >
                  <Typography
                    sx={{
                      color: "label.normal",
                      fontSize: "16px",
                      fontWeight: 400,
                      lineHeight: "24px",
                      letterSpacing: "-0.336px",
                      alignSelf: "stretch",
                    }}
                  >
                    {tempRange[0]} ~ {tempRange[1]}년
                  </Typography>
                  <Slider
                    value={tempRange}
                    onChange={handleSliderChange}
                    min={YEAR_MIN}
                    max={YEAR_MAX}
                    step={1}
                    disableSwap
                    size="small"
                    sx={{
                      alignSelf: "stretch",
                      color: "#92E268",
                      "& .MuiSlider-rail": {
                        backgroundColor: "#E9EAF2",
                        opacity: 1,
                      },
                      "& .MuiSlider-thumb": {
                        border: "1px solid #73757F",
                        backgroundColor: "#F7F8FA",
                      },
                    }}
                  />
                </Box>
              </Box>
              <Box
                onClick={!isApplyDisabled ? handleYearApply : undefined}
                sx={{
                  display: "flex",
                  width: "208px",
                  padding: "8px 0",
                  justifyContent: "center",
                  alignItems: "center",
                  borderRadius: "8px",
                  backgroundColor: isApplyDisabled
                    ? "label.disable"
                    : "label.normal",
                  cursor: isApplyDisabled ? "default" : "pointer",
                  userSelect: "none",
                }}
              >
                <Typography
                  sx={{
                    color: "#FAFAFC",
                    fontSize: "16px",
                    fontWeight: 400,
                    lineHeight: "24px",
                    letterSpacing: "-0.336px",
                  }}
                >
                  적용
                </Typography>
              </Box>
            </Box>
          ) : mobilePanelPos ? (
            createPortal(
              <Box
                ref={yearMobilePanelRef}
                sx={{
                  position: "fixed",
                  top: mobilePanelPos.top,
                  left: mobilePanelPos.left,
                  zIndex: 1300,
                  display: "flex",
                  width: "204px",
                  padding: "12px 8px",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "0px",
                  borderRadius: "16px",
                  border: "1px solid",
                  borderColor: "label.alternative",
                  backgroundColor: "background.default",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    padding: "0 8px 8px 8px",
                    justifyContent: "center",
                    alignItems: "center",
                    gap: "16px",
                    alignSelf: "stretch",
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "flex-start",
                      gap: "3px",
                      flex: "1 0 0",
                    }}
                  >
                    <Typography
                      sx={{
                        color: "label.normal",
                        fontSize: "13px",
                        fontWeight: 400,
                        lineHeight: "22px",
                        letterSpacing: "-0.26px",
                        alignSelf: "stretch",
                      }}
                    >
                      {tempRange[0]} ~ {tempRange[1]}년
                    </Typography>
                    <Slider
                      value={tempRange}
                      onChange={handleSliderChange}
                      min={YEAR_MIN}
                      max={YEAR_MAX}
                      step={1}
                      disableSwap
                      size="small"
                      sx={{
                        "&&": { padding: "13px 0" },
                        alignSelf: "stretch",
                        color: "#92E268",
                        "& .MuiSlider-rail": {
                          backgroundColor: "#E9EAF2",
                          opacity: 1,
                        },
                        "& .MuiSlider-thumb": {
                          border: "1px solid #73757F",
                          backgroundColor: "#F7F8FA",
                        },
                      }}
                    />
                  </Box>
                </Box>
                <Box
                  onClick={!isApplyDisabled ? handleYearApply : undefined}
                  sx={{
                    display: "flex",
                    width: "184px",
                    padding: "8px 0",
                    justifyContent: "center",
                    alignItems: "center",
                    borderRadius: "8px",
                    backgroundColor: isApplyDisabled
                      ? "label.disable"
                      : "label.normal",
                    cursor: isApplyDisabled ? "default" : "pointer",
                    userSelect: "none",
                  }}
                >
                  <Typography
                    sx={{
                      color: "#FAFAFC",
                      fontSize: "13px",
                      fontWeight: 400,
                      lineHeight: "22px",
                      letterSpacing: "-0.26px",
                    }}
                  >
                    적용
                  </Typography>
                </Box>
              </Box>,
              document.body,
            )
          ) : null)}
      </Box>
      <DropdownFilter
        label="논문 유형"
        clearable
        options={PAPER_TYPE_OPTIONS}
        selectedValue={filterPaperType}
        onSelect={(value) => {
          onFilterChange({
            yearStart: filterYearStart,
            yearEnd: filterYearEnd,
            paperType: value === "__clear__" ? null : (value as string),
            kci: filterKci,
            sci: filterSci,
          });
        }}
        isMobile={isMobileFilter}
      />
      <ToggleFilter
        label="KCI 등재"
        active={filterKci}
        onToggle={() =>
          onFilterChange({
            yearStart: filterYearStart,
            yearEnd: filterYearEnd,
            paperType: filterPaperType,
            kci: !filterKci,
            sci: filterSci,
          })
        }
        isMobile={isMobileFilter}
      />
      <ToggleFilter
        label="SCI 등재"
        active={filterSci}
        onToggle={() =>
          onFilterChange({
            yearStart: filterYearStart,
            yearEnd: filterYearEnd,
            paperType: filterPaperType,
            kci: filterKci,
            sci: !filterSci,
          })
        }
        isMobile={isMobileFilter}
      />
    </Box>
  );

  const paperList = (isMobileList: boolean) => (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: isFilterLoading ? "center" : "flex-start",
        justifyContent: isFilterLoading ? "center" : "flex-start",
        gap: isMobileList ? "16px" : "8px",
        flex: "1 0 0",
        alignSelf: "stretch",
        borderRadius: "8px",
        backgroundColor: "background.default",
        overflowY: isMobileList ? "auto" : "auto",
        ...(isMobileList && {
          padding: "0 16px 16px 16px",
          borderRadius: "12px",
          backdropFilter: "blur(2.9px)",
        }),
      }}
    >
      {isFilterLoading ? (
        <CircularProgress />
      ) : papers.length === 0 ? (
        <Box
          sx={{
            display: "flex",
            flex: "1 0 0",
            justifyContent: "center",
            alignItems: "center",
            alignSelf: "stretch",
          }}
        >
          <Typography
            sx={{
              color: "label.alternative",
              fontSize: "16px",
              fontWeight: 400,
              lineHeight: "24px",
              letterSpacing: "-0.336px",
            }}
          >
            탐색 결과에 맞는 논문이 없어요.
          </Typography>
        </Box>
      ) : (
        papers.map((paper) => (
          <PaperListCard
            key={paper.paper_id}
            paper={paper}
            isBookmarked={bookmarkMap[paper.paper_id] ?? false}
            feedback={feedbacks[paper.paper_id]}
            selectionReason={selectionReasonMap[paper.paper_id]}
            onClick={() => handlePaperClick(paper.paper_id)}
            onBookmark={() => handleBookmark(paper.paper_id)}
            onFeedback={onFeedback}
            onVisible={onPaperVisible}
          />
        ))
      )}
    </Box>
  );

  return (
    <Box
      sx={{
        display: "flex",
        padding: isMobile
          ? resultPanelView === "detail"
            ? "16px"
            : "0"
          : resultPanelView === "detail"
            ? "32px"
            : "16px",
        flexDirection: "column",
        alignItems: "flex-start",
        gap: isMobile ? "16px" : "12px",
        alignSelf: "stretch",
        borderRadius: isMobile ? "0" : "8px",
        backgroundColor: "background.default",
        overflowY: isMobile ? "visible" : "auto",
        ...(isDesktop
          ? resultPanelView === "detail"
            ? { flex: 1 }
            : {
                minWidth: "640px",
                flex: "0 0 auto",
                width: "calc((100% - 12px) * 734 / (930 + 734))",
              }
          : {
              flex: 1,
              alignSelf: "stretch",
              minWidth: 0,
            }),
      }}
    >
      {/* 데스크탑/태블릿 list */}
      {!isMobile && resultPanelView === "list" && (
        <>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              gap: "16px",
              alignSelf: "stretch",
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                alignSelf: "stretch",
              }}
            >
              <Typography
                sx={{
                  display: "-webkit-box",
                  WebkitBoxOrient: "vertical",
                  WebkitLineClamp: 1,
                  overflow: "hidden",
                  fontSize: "24px",
                  fontWeight: 600,
                  lineHeight: "36px",
                  letterSpacing: "-0.528px",
                }}
              >
                <Box component="span" sx={{ color: "#03C26C" }}>
                  {keyword}
                </Box>
                <Box component="span" sx={{ color: "label.normal" }}>
                  {" "}
                  검색 결과
                </Box>
              </Typography>
              <IconButton
                onClick={onClose}
                sx={{
                  display: "flex",
                  width: "36px",
                  height: "36px",
                  padding: "8px",
                }}
              >
                <CloseIcon sx={{ width: 20, height: 20 }} />
              </IconButton>
            </Box>
            {filterBar(false)}
          </Box>
          {paperList(false)}
        </>
      )}

      {/* 모바일 필터 + 논문 리스트 */}
      {isMobile && resultPanelView === "list" && (
        <>
          {filterBar(true)}
          {paperList(true)}
        </>
      )}

      {/* detail */}
      {resultPanelView === "detail" && selectedPaperId && (
        <Box sx={{ flex: 1, overflow: "auto", alignSelf: "stretch" }}>
          <PaperDetailContent
            paperId={selectedPaperId}
            searchId={sessionId ?? undefined}
            onRelatedPaperClick={(paperId) =>
              setPaperStack((prev) => [...prev, paperId])
            }
            onClose={handleDetailClose}
            onBack={handleBack}
            isPanel
            onBookmarkChange={onBookmarkToggle}
          />
        </Box>
      )}

      <BookmarkFolderSelectDialog
        open={bookmarkDialogPaperId !== null}
        onClose={() => setBookmarkDialogPaperId(null)}
        paperId={bookmarkDialogPaperId ?? ""}
        onBookmarkAdded={() => {
          if (bookmarkDialogPaperId) {
            onBookmarkToggle(bookmarkDialogPaperId, true);
          }
          queryClient.invalidateQueries({ queryKey: bookmarkKeys.savedList() });
          queryClient.invalidateQueries({
            queryKey: bookmarkKeys.savedFolders(),
          });
          queryClient.invalidateQueries({
            queryKey: bookmarkKeys.savedTotal(),
          });
          queryClient.invalidateQueries({ queryKey: bookmarkKeys.folders() });
          setBookmarkDialogPaperId(null);
        }}
      />
    </Box>
  );
};

export default SearchResultPanel;
