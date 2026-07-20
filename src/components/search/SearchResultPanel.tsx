import { useState } from "react";
import { Box, Typography, IconButton, Menu, MenuItem } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import {
  type ChatResponse,
  type FeedbackType,
  type SortOrder,
} from "../../types/search";
import { type PaperType } from "../../types/paper";
import SearchPaperCard from "./PaperListCard";

interface SearchResultPanelProps {
  chatResponse: ChatResponse | null;
  feedbacks: Record<string, FeedbackType>;
  sortOrder: SortOrder;
  onClose: () => void;
  onPaperClick: (paperId: string) => void;
  onFeedback: (paperId: string, feedback: FeedbackType) => void;
  onSortChange: (sort: SortOrder) => void;
  isDesktop: boolean;
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
}

const DropdownFilter = ({
  label,
  options,
  selectedValue,
  onSelect,
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
          height: "42px",
          padding: "8px 8px 8px 16px",
          alignItems: "center",
          gap: "16px",
          borderRadius: "216px",
          backgroundColor: "fill.normal",
          cursor: "pointer",
        }}
      >
        <Typography
          sx={{
            display: "-webkit-box",
            WebkitBoxOrient: "vertical",
            WebkitLineClamp: 1,
            overflow: "hidden",
            color: selectedValue ? "label.normal" : "label.alternative",
            fontSize: "16px",
            fontWeight: 400,
            lineHeight: "24px",
            letterSpacing: "-0.336px",
          }}
        >
          {selectedLabel}
        </Typography>
        <Box
          sx={{
            display: "flex",
            width: "40px",
            height: "40px",
            padding: "9px 10px 11px 10px",
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
              fontSize: "16px",
              fontWeight: 400,
              lineHeight: "24px",
              letterSpacing: "-0.336px",
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
}

const ToggleFilter = ({ label, active, onToggle }: ToggleFilterProps) => (
  <Box
    onClick={onToggle}
    sx={{
      display: "flex",
      padding: "8px 13px",
      justifyContent: "center",
      alignItems: "center",
      gap: "10px",
      borderRadius: "24px",
      backgroundColor: active ? "label.normal" : "fill.normal",
      cursor: "pointer",
    }}
  >
    <Typography
      sx={{
        display: "-webkit-box",
        WebkitBoxOrient: "vertical",
        WebkitLineClamp: 1,
        overflow: "hidden",
        color: active ? "#FAFAFC" : "label.alternative",
        fontSize: "16px",
        fontWeight: 400,
        lineHeight: "24px",
        letterSpacing: "-0.336px",
      }}
    >
      {label}
    </Typography>
  </Box>
);

// ─── SearchResultPanel ────────────────────────────────────

const SearchResultPanel = ({
  chatResponse,
  feedbacks,
  sortOrder,
  onClose,
  onPaperClick,
  onFeedback,
  onSortChange,
  isDesktop,
}: SearchResultPanelProps) => {
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [selectedPaperType, setSelectedPaperType] = useState<PaperType | null>(
    null,
  );
  const [kciActive, setKciActive] = useState(false);
  const [sciActive, setSciActive] = useState(false);
  const [bookmarks, setBookmarks] = useState<Record<string, boolean>>({});

  const papers = chatResponse?.result_items ?? [];
  const keywords = chatResponse?.filters.keywords ?? [];
  const keyword = keywords[0] ?? "";

  const handleBookmark = (paperId: string) => {
    setBookmarks((prev) => ({ ...prev, [paperId]: !prev[paperId] }));
  };

  return (
    <Box
      sx={{
        display: "flex",
        padding: "16px",
        flexDirection: "column",
        alignItems: "flex-start",
        gap: "12px",
        alignSelf: "stretch",
        borderRadius: "8px",
        backgroundColor: "background.default",
        overflowY: "auto",
        // 데스크탑: 기존 좌우 분할
        ...(isDesktop
          ? {
              minWidth: "640px",
              flex: "0 0 auto",
              width: "calc((100% - 12px) * 734 / (930 + 734))",
            }
          : {
              // 태블릿: 오버레이
              flex: 1,
              alignSelf: "stretch",
            }),
      }}
    >
      {/* 헤더 + 필터 */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          gap: "16px",
          alignSelf: "stretch",
        }}
      >
        {/* 제목 + 닫기 */}
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
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <CloseIcon sx={{ width: 20, height: 20 }} />
          </IconButton>
        </Box>

        {/* 필터 바 */}
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
          />
          <DropdownFilter
            label="발행연도"
            options={YEAR_OPTIONS}
            selectedValue={selectedYear}
            onSelect={(value) => setSelectedYear(value as number)}
          />
          <DropdownFilter
            label="논문 유형"
            options={PAPER_TYPE_OPTIONS}
            selectedValue={selectedPaperType}
            onSelect={(value) => setSelectedPaperType(value as PaperType)}
          />
          <ToggleFilter
            label="KCI 등재"
            active={kciActive}
            onToggle={() => setKciActive((prev) => !prev)}
          />
          <ToggleFilter
            label="SCI 등재"
            active={sciActive}
            onToggle={() => setSciActive((prev) => !prev)}
          />
        </Box>
      </Box>

      {/* 논문 리스트 */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          gap: "8px",
          flex: "1 0 0",
          alignSelf: "stretch",
          borderRadius: "8px",
          backgroundColor: "background.paper",
          overflowY: "auto",
        }}
      >
        {papers.map((paper) => (
          <SearchPaperCard
            key={paper.paper_id}
            paper={paper}
            isBookmarked={bookmarks[paper.paper_id] ?? false}
            feedback={feedbacks[paper.paper_id]}
            onClick={() => onPaperClick(paper.paper_id)}
            onBookmark={() => handleBookmark(paper.paper_id)}
            onFeedback={onFeedback}
          />
        ))}
      </Box>
    </Box>
  );
};

export default SearchResultPanel;
