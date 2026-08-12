import { useState, useRef, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  Box,
  Typography,
  IconButton,
  useMediaQuery,
  CircularProgress,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import CloseIcon from "@mui/icons-material/Close";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import {
  type FeedbackType,
  type SortOrder,
  type SearchFilters,
  type SearchPaper,
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
  filterYear: number | null;
  filterPaperType: string | null;
  filterKci: boolean;
  filterSci: boolean;
  onFilterChange: (filters: {
    year: number | null;
    paperType: string | null;
    kci: boolean;
    sci: boolean;
  }) => void;
  isFilterLoading: boolean;
}

const SORT_OPTIONS: { label: string; value: SortOrder }[] = [
  { label: "관련도순", value: "relevance" },
  { label: "최신순", value: "year_desc" },
  { label: "오래된순", value: "year_asc" },
  { label: "인용높은순", value: "citation_desc" },
];

const YEAR_OPTIONS: { label: string; value: number }[] = Array.from(
  { length: 11 },
  (_, i) => {
    const year = 2026 - i;
    return { label: `${year}년`, value: year };
  },
);

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
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const isSelected = clearable && selectedValue !== null;
  const selectedLabel =
    options.find((o) => o.value === selectedValue)?.label ?? label;

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  const handleClick = () => {
    if (isSelected) return;
    setOpen((prev) => !prev);
  };

  const handleClear = (e: React.MouseEvent<SVGSVGElement>) => {
    e.stopPropagation();
    onSelect("__clear__");
  };

  return (
    <Box ref={containerRef} sx={{ position: "relative" }}>
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
            display: "-webkit-box",
            WebkitBoxOrient: "vertical",
            WebkitLineClamp: 1,
            overflow: "hidden",
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
                transform: open ? "rotate(180deg)" : "none",
              }}
            />
          )}
        </Box>
      </Box>
      {open && (
        <Box
          sx={{
            position: "absolute",
            top: "calc(100% + 4px)",
            left: 0,
            zIndex: 100,
            display: "flex",
            padding: "8px",
            flexDirection: "column",
            alignItems: "center",
            width: "100%",
            borderRadius: "28px",
            border: "1px solid",
            borderColor: "label.alternative",
            backgroundColor: "background.default",
          }}
        >
          {options.map((option) => (
            <Box
              key={option.value}
              onClick={() => {
                onSelect(option.value);
                setOpen(false);
              }}
              sx={{
                display: "flex",
                height: "42px",
                padding: "8px",
                alignItems: "center",
                alignSelf: "stretch",
                borderRadius: "216px",
                backgroundColor:
                  option.value === selectedValue
                    ? "background.paper"
                    : "background.default",
                cursor: "pointer",
                "&:hover": { backgroundColor: "background.paper" },
              }}
            >
              <Typography
                sx={{
                  color: "label.normal",
                  fontSize: isMobile ? "13px" : "16px",
                  fontWeight: 400,
                  lineHeight: isMobile ? "22px" : "24px",
                  letterSpacing: isMobile ? "-0.26px" : "-0.336px",
                }}
              >
                {option.label}
              </Typography>
            </Box>
          ))}
        </Box>
      )}
    </Box>
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
        display: "-webkit-box",
        WebkitBoxOrient: "vertical",
        WebkitLineClamp: 1,
        overflow: "hidden",
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
  filterYear,
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
}: SearchResultPanelProps) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const queryClient = useQueryClient();

  const [resultPanelView, setResultPanelView] =
    useState<ResultPanelView>("list");
  const [selectedPaperId, setSelectedPaperId] = useState<string | null>(null);
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

  const handlePaperClick = (paperId: string) => {
    setSelectedPaperId(paperId);
    setResultPanelView("detail");
    onDetailOpen();
  };

  const handleClose = () => {
    if (resultPanelView === "detail") {
      setResultPanelView("list");
      setSelectedPaperId(null);
      onDetailClose();
    } else {
      onClose();
    }
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
      <DropdownFilter
        label="발행연도"
        clearable
        options={YEAR_OPTIONS}
        selectedValue={filterYear}
        onSelect={(value) => {
          onFilterChange({
            year: value === "__clear__" ? null : (value as number),
            paperType: filterPaperType,
            kci: filterKci,
            sci: filterSci,
          });
        }}
        isMobile={isMobileFilter}
      />
      <DropdownFilter
        label="논문 유형"
        clearable
        options={PAPER_TYPE_OPTIONS}
        selectedValue={filterPaperType}
        onSelect={(value) => {
          onFilterChange({
            year: filterYear,
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
            year: filterYear,
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
            year: filterYear,
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
            onClick={() => handlePaperClick(paper.paper_id)}
            onBookmark={() => handleBookmark(paper.paper_id)}
            onFeedback={onFeedback}
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
                onClick={handleClose}
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
            onRelatedPaperClick={(paperId) => setSelectedPaperId(paperId)}
            onClose={() => {
              setResultPanelView("list");
              setSelectedPaperId(null);
              onDetailClose();
            }}
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
