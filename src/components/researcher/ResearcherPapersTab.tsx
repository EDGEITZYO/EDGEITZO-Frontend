import { useState, type ReactNode } from "react";
import { Box, Typography, Menu, MenuItem } from "@mui/material";
import { type SxProps, type Theme } from "@mui/material/styles";
import CloseIcon from "@mui/icons-material/Close";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import {
  type ResearcherPaperItem,
  type ResearcherPaperSortType,
} from "../../types/researcher";
import ResearcherDetailPaperCard from "./ResearcherDetailPaperCard";

// ─── 타입 ─────────────────────────────────────────────────

type PaperTypeFilter = "학술 저널" | "박사학위 논문" | "석사학위 논문";

export interface PaperFilter {
  sort: ResearcherPaperSortType;
  year: number | null;
  paper_type: PaperTypeFilter | null;
  kci: boolean;
  sci: boolean;
}

export interface ResearcherPapersTabProps {
  papers: ResearcherPaperItem[];
  total: number;
  page: number;
  citationSortAvailable: boolean;
  onFilterChange: (filter: PaperFilter) => void;
  onPageChange: (page: number) => void;
  onPaperClick: (paper: ResearcherPaperItem) => void;
  onBookmarkToggle: (paper: ResearcherPaperItem) => void;
  toggleEl: ReactNode;
}

// ─── 필터 옵션 ────────────────────────────────────────────

const currentYear = new Date().getFullYear();

const YEAR_OPTIONS: { label: string; value: number }[] = Array.from(
  { length: 11 },
  (_, i) => {
    const year = currentYear - i;
    return { label: `${year}년`, value: year };
  },
);

const PAPER_TYPE_OPTIONS: { label: string; value: PaperTypeFilter }[] = [
  { label: "학술 저널", value: "학술 저널" },
  { label: "박사학위 논문", value: "박사학위 논문" },
  { label: "석사학위 논문", value: "석사학위 논문" },
];

// ─── 페이지네이션 유틸 ───────────────────────────────────

const getPaginationItems = (
  currentPage: number,
  totalPages: number,
): (number | "...")[] => {
  if (totalPages <= 5) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }
  const items: (number | "...")[] = [];
  if (currentPage <= 5) {
    for (let i = 1; i <= Math.min(5, totalPages); i++) items.push(i);
    if (totalPages > 5) {
      items.push("...");
      items.push(totalPages);
    }
  } else if (currentPage >= totalPages - 4) {
    items.push(1);
    items.push("...");
    for (let i = totalPages - 4; i <= totalPages; i++) items.push(i);
  } else {
    items.push(1);
    items.push("...");
    for (let i = currentPage - 1; i <= currentPage + 1; i++) items.push(i);
    items.push("...");
    items.push(totalPages);
  }
  return items;
};

// ─── DropdownFilter ───────────────────────────────────────

interface DropdownFilterProps {
  label: string;
  options: { label: string; value: string | number }[];
  selectedValue: string | number | null;
  onSelect: (value: string | number | "__clear__") => void;
  isMobile: boolean;
  clearable?: boolean;
  disabled?: boolean;
}

const DropdownFilter = ({
  label,
  options,
  selectedValue,
  onSelect,
  isMobile,
  clearable = false,
  disabled = false,
}: DropdownFilterProps) => {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const isSelected = clearable && selectedValue !== null;
  const selectedLabel =
    options.find((o) => o.value === selectedValue)?.label ?? label;

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isSelected || disabled) return;
    setAnchorEl(e.currentTarget);
  };

  const handleClear = (e: React.MouseEvent<SVGSVGElement>) => {
    e.stopPropagation();
    onSelect("__clear__");
  };

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
          backgroundColor: disabled
            ? "fill.normal"
            : isSelected
              ? "#1E2026"
              : "fill.normal",
          cursor: disabled ? "not-allowed" : isSelected ? "default" : "pointer",
          flexShrink: 0,
          opacity: disabled ? 0.4 : 1,
        }}
      >
        <Typography
          sx={{
            display: "-webkit-box",
            WebkitBoxOrient: "vertical",
            WebkitLineClamp: 1,
            overflow: "hidden",
            color: isSelected ? "#FFF" : "label.alternative",
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

// ─── ToggleFilter ─────────────────────────────────────────

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
        color: active ? "#FAFAFC" : "label.alternative",
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

// ─── 스타일 ───────────────────────────────────────────────

const filterBarSx = (isMobile: boolean): SxProps<Theme> => ({
  display: "flex",
  alignItems: "center",
  gap: isMobile ? "4px" : "8px",
  ...(isMobile
    ? {
        overflowX: "auto",
        "&::-webkit-scrollbar": { display: "none" },
      }
    : { flexWrap: "wrap" }),
});

const listSx: SxProps<Theme> = {
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-start",
  gap: "8px",
  alignSelf: "stretch",
};

const paginationSx: SxProps<Theme> = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "2px",
  alignSelf: "stretch",
};

const pageNumSx = (isActive: boolean): SxProps<Theme> => ({
  display: "flex",
  width: "24px",
  height: "24px",
  flexDirection: "column",
  justifyContent: "center",
  color: isActive ? "primary.light" : "label.alternative",
  textAlign: "center",
  fontSize: "13px",
  fontWeight: 400,
  lineHeight: "22px",
  letterSpacing: "-0.26px",
  cursor: "pointer",
});

const pageArrowSx = (enabled: boolean): SxProps<Theme> => ({
  display: "flex",
  width: "24px",
  height: "24px",
  padding: "4px 6px",
  justifyContent: "center",
  alignItems: "center",
  cursor: enabled ? "pointer" : "default",
  color: enabled ? "label.alternative" : "line.normal",
});

// ─── 컴포넌트 ─────────────────────────────────────────────

const PAGE_SIZE = 10;

const ResearcherPapersTab = ({
  papers,
  total,
  page,
  citationSortAvailable,
  onFilterChange,
  onPageChange,
  onPaperClick,
  onBookmarkToggle,
  toggleEl,
}: ResearcherPapersTabProps) => {
  const [filter, setFilter] = useState<PaperFilter>({
    sort: "recent",
    year: null,
    paper_type: null,
    kci: false,
    sci: false,
  });

  const updateFilter = (partial: Partial<PaperFilter>) => {
    const next = { ...filter, ...partial };
    setFilter(next);
    onFilterChange(next);
  };

  const SORT_OPTIONS: { label: string; value: ResearcherPaperSortType }[] = [
    { label: "최신순", value: "recent" },
    ...(citationSortAvailable
      ? [{ label: "피인용순", value: "citations" as ResearcherPaperSortType }]
      : []),
  ];

  const totalPages = Math.ceil(total / PAGE_SIZE);
  const paginationItems = getPaginationItems(page, totalPages);

  const filterBar = (
    <>
      {/* 데스크탑/태블릿: 필터 좌측 + 토글 우측 */}
      <Box
        sx={{
          display: { xs: "none", sm: "flex" },
          justifyContent: "space-between",
          alignItems: "center",
          alignSelf: "stretch",
        }}
      >
        <Box sx={filterBarSx(false)}>
          <DropdownFilter
            label="최신순"
            options={SORT_OPTIONS}
            selectedValue={filter.sort}
            onSelect={(value) => {
              if (value === "__clear__") return;
              updateFilter({ sort: value as ResearcherPaperSortType });
            }}
            isMobile={false}
          />
          <DropdownFilter
            label="발행연도"
            clearable
            options={YEAR_OPTIONS}
            selectedValue={filter.year}
            onSelect={(value) => {
              if (value === "__clear__") {
                updateFilter({ year: null });
                return;
              }
              updateFilter({ year: value as number });
            }}
            isMobile={false}
          />
          <DropdownFilter
            label="논문 유형"
            clearable
            options={PAPER_TYPE_OPTIONS}
            selectedValue={filter.paper_type}
            onSelect={(value) => {
              if (value === "__clear__") {
                updateFilter({ paper_type: null });
                return;
              }
              updateFilter({ paper_type: value as PaperTypeFilter });
            }}
            isMobile={false}
          />
          <ToggleFilter
            label="KCI 등재"
            active={filter.kci}
            onToggle={() => updateFilter({ kci: !filter.kci })}
            isMobile={false}
          />
          <ToggleFilter
            label="SCI 등재"
            active={filter.sci}
            onToggle={() => updateFilter({ sci: !filter.sci })}
            isMobile={false}
          />
        </Box>
        {toggleEl}
      </Box>

      {/* 모바일: 필터만 (토글은 제목 박스에 있음) */}
      <Box
        sx={{
          display: { xs: "flex", sm: "none" },
          alignItems: "center",
          gap: "4px",
          overflowX: "auto",
          "&::-webkit-scrollbar": { display: "none" },
        }}
      >
        <DropdownFilter
          label="최신순"
          options={SORT_OPTIONS}
          selectedValue={filter.sort}
          onSelect={(value) => {
            if (value === "__clear__") return;
            updateFilter({ sort: value as ResearcherPaperSortType });
          }}
          isMobile={true}
        />
        <DropdownFilter
          label="발행연도"
          clearable
          options={YEAR_OPTIONS}
          selectedValue={filter.year}
          onSelect={(value) => {
            if (value === "__clear__") {
              updateFilter({ year: null });
              return;
            }
            updateFilter({ year: value as number });
          }}
          isMobile={true}
        />
        <DropdownFilter
          label="논문 유형"
          clearable
          options={PAPER_TYPE_OPTIONS}
          selectedValue={filter.paper_type}
          onSelect={(value) => {
            if (value === "__clear__") {
              updateFilter({ paper_type: null });
              return;
            }
            updateFilter({ paper_type: value as PaperTypeFilter });
          }}
          isMobile={true}
        />
        <ToggleFilter
          label="KCI 등재"
          active={filter.kci}
          onToggle={() => updateFilter({ kci: !filter.kci })}
          isMobile={true}
        />
        <ToggleFilter
          label="SCI 등재"
          active={filter.sci}
          onToggle={() => updateFilter({ sci: !filter.sci })}
          isMobile={true}
        />
      </Box>
    </>
  );

  const pagination = totalPages > 1 && (
    <Box sx={paginationSx}>
      <Box
        sx={pageArrowSx(page > 1)}
        onClick={() => {
          if (page > 1) onPageChange(page - 1);
        }}
      >
        <ChevronLeftIcon sx={{ fontSize: 16 }} />
      </Box>
      <Box sx={{ display: "flex", alignItems: "center", gap: "4px" }}>
        {paginationItems.map((item, i) =>
          item === "..." ? (
            <Typography key={`ellipsis-${i}`} sx={pageNumSx(false)}>
              ...
            </Typography>
          ) : (
            <Typography
              key={item}
              sx={pageNumSx(page === item)}
              onClick={() => onPageChange(item as number)}
            >
              {item}
            </Typography>
          ),
        )}
      </Box>
      <Box
        sx={pageArrowSx(page < totalPages)}
        onClick={() => {
          if (page < totalPages) onPageChange(page + 1);
        }}
      >
        <ChevronRightIcon sx={{ fontSize: 16 }} />
      </Box>
    </Box>
  );

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        gap: "16px",
        alignSelf: "stretch",
      }}
    >
      {filterBar}

      {papers.length === 0 ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: "80px 0",
            width: "100%",
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
            조건에 맞는 논문이 없어요.
          </Typography>
        </Box>
      ) : (
        <Box sx={listSx}>
          {papers.map((paper) => (
            <ResearcherDetailPaperCard
              key={paper.paper_id ?? paper.external_id}
              paper={paper}
              onClick={() => onPaperClick(paper)}
              onBookmarkToggle={() => onBookmarkToggle(paper)}
            />
          ))}
        </Box>
      )}

      {pagination}
    </Box>
  );
};

export default ResearcherPapersTab;
