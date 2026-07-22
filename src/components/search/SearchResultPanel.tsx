import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  Box,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  useMediaQuery,
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
  { label: "학위논문", value: "학위논문" },
];

// ─── 드롭다운 필터 ────────────────────────────────────────

interface DropdownFilterProps {
  label: string;
  options: { label: string; value: string | number }[];
  selectedValue: string | number | null;
  onSelect: (value: string | number) => void;
  isMobile: boolean;
}

const DropdownFilter = ({
  label,
  options,
  selectedValue,
  onSelect,
  isMobile,
}: DropdownFilterProps) => {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const selectedLabel =
    options.find((o) => o.value === selectedValue)?.label ?? label;

  return (
    <>
      <Box
        onClick={(e: React.MouseEvent<HTMLDivElement>) =>
          setAnchorEl(e.currentTarget)
        }
        sx={{
          display: "flex",
          height: isMobile ? "36px" : "42px",
          padding: isMobile ? "0 8px 0 16px" : "8px 8px 8px 16px",
          alignItems: "center",
          gap: isMobile ? "4px" : "16px",
          borderRadius: "216px",
          backgroundColor: "fill.normal",
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
            color: selectedValue
              ? "label.normal"
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
          <KeyboardArrowDownIcon sx={{ width: 20, height: 20 }} />
        </Box>
      </Box>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
        slotProps={{
          paper: {
            sx: {
              borderRadius: "8px",
              border: "1px solid",
              borderColor: "line.normal",
              boxShadow: "none",
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
              fontSize: isMobile ? "13px" : "16px",
              fontWeight: 400,
              lineHeight: isMobile ? "22px" : "24px",
              letterSpacing: isMobile ? "-0.26px" : "-0.336px",
              color: "label.normal",
            }}
          >
            {option.label}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};

// ─── 토글 필터 (KCI, SCI) ────────────────────────────────

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
  onClose,
  onFeedback,
  onSortChange,
  onDetailClose,
  onDetailOpen,
  onBookmarkToggle,
  isDesktop,
}: SearchResultPanelProps) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const queryClient = useQueryClient();

  const [resultPanelView, setResultPanelView] =
    useState<ResultPanelView>("list");
  const [selectedPaperId, setSelectedPaperId] = useState<string | null>(null);
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [selectedPaperType, setSelectedPaperType] = useState<PaperType | null>(
    null,
  );
  const [kciActive, setKciActive] = useState(false);
  const [sciActive, setSciActive] = useState(false);
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
          queryClient.invalidateQueries({ queryKey: ["saved-bookmarks"] });
          queryClient.invalidateQueries({
            queryKey: ["saved-bookmark-folders"],
          });
          queryClient.invalidateQueries({
            queryKey: ["saved-bookmarks-total"],
          });
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
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                alignContent: "center",
                gap: "8px",
                alignSelf: "stretch",
                flexWrap: "wrap",
              }}
            >
              <DropdownFilter
                label="관련도순"
                options={SORT_OPTIONS}
                selectedValue={sortOrder}
                onSelect={(value) => onSortChange(value as SortOrder)}
                isMobile={false}
              />
              <DropdownFilter
                label="발행연도"
                options={YEAR_OPTIONS}
                selectedValue={selectedYear}
                onSelect={(value) => setSelectedYear(value as number)}
                isMobile={false}
              />
              <DropdownFilter
                label="논문 유형"
                options={PAPER_TYPE_OPTIONS}
                selectedValue={selectedPaperType}
                onSelect={(value) => setSelectedPaperType(value as PaperType)}
                isMobile={false}
              />
              <ToggleFilter
                label="KCI 등재"
                active={kciActive}
                onToggle={() => setKciActive((prev) => !prev)}
                isMobile={false}
              />
              <ToggleFilter
                label="SCI 등재"
                active={sciActive}
                onToggle={() => setSciActive((prev) => !prev)}
                isMobile={false}
              />
            </Box>
          </Box>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              gap: "8px",
              flex: "1 0 0",
              alignSelf: "stretch",
              borderRadius: "8px",
              backgroundColor: "background.default",
              overflowY: "auto",
            }}
          >
            {papers.map((paper) => (
              <PaperListCard
                key={paper.paper_id}
                paper={paper}
                isBookmarked={bookmarkMap[paper.paper_id] ?? false}
                feedback={feedbacks[paper.paper_id]}
                onClick={() => handlePaperClick(paper.paper_id)}
                onBookmark={() => handleBookmark(paper.paper_id)}
                onFeedback={onFeedback}
              />
            ))}
          </Box>
        </>
      )}

      {/* 모바일 필터 */}
      {isMobile && resultPanelView === "list" && (
        <Box
          sx={{
            display: "flex",
            padding: "0 16px",
            alignItems: "center",
            gap: "4px",
            alignSelf: "stretch",
            overflowX: "auto",
            "&::-webkit-scrollbar": { display: "none" },
          }}
        >
          <DropdownFilter
            label="관련도순"
            options={SORT_OPTIONS}
            selectedValue={sortOrder}
            onSelect={(value) => onSortChange(value as SortOrder)}
            isMobile={true}
          />
          <DropdownFilter
            label="발행연도"
            options={YEAR_OPTIONS}
            selectedValue={selectedYear}
            onSelect={(value) => setSelectedYear(value as number)}
            isMobile={true}
          />
          <DropdownFilter
            label="논문 유형"
            options={PAPER_TYPE_OPTIONS}
            selectedValue={selectedPaperType}
            onSelect={(value) => setSelectedPaperType(value as PaperType)}
            isMobile={true}
          />
          <ToggleFilter
            label="KCI 등재"
            active={kciActive}
            onToggle={() => setKciActive((prev) => !prev)}
            isMobile={true}
          />
          <ToggleFilter
            label="SCI 등재"
            active={sciActive}
            onToggle={() => setSciActive((prev) => !prev)}
            isMobile={true}
          />
        </Box>
      )}

      {/* 모바일 논문 리스트 */}
      {isMobile && resultPanelView === "list" && (
        <Box
          sx={{
            display: "flex",
            padding: "0 16px 16px 16px",
            flexDirection: "column",
            alignItems: "flex-start",
            gap: "16px",
            flex: "1 0 0",
            alignSelf: "stretch",
            borderRadius: "12px",
            backgroundColor: "background.default",
            overflowY: "auto",
            backdropFilter: "blur(2.9px)",
          }}
        >
          {papers.map((paper) => (
            <PaperListCard
              key={paper.paper_id}
              paper={paper}
              isBookmarked={bookmarkMap[paper.paper_id] ?? false}
              feedback={feedbacks[paper.paper_id]}
              onClick={() => handlePaperClick(paper.paper_id)}
              onBookmark={() => handleBookmark(paper.paper_id)}
              onFeedback={onFeedback}
            />
          ))}
        </Box>
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
          />
        </Box>
      )}

      <BookmarkFolderSelectDialog
        open={bookmarkDialogPaperId !== null}
        onClose={() => setBookmarkDialogPaperId(null)}
        paperId={bookmarkDialogPaperId ?? ""}
        onBookmarkAdded={() => {
          if (bookmarkDialogPaperId)
            onBookmarkToggle(bookmarkDialogPaperId, true);
          setBookmarkDialogPaperId(null);
        }}
      />
    </Box>
  );
};

export default SearchResultPanel;
