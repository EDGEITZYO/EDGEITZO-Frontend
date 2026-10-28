import { useState, useRef, useEffect, type ReactNode } from "react";
import { Box, Typography, Menu, MenuItem, Slider } from "@mui/material";
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
  year_start: number | null;
  year_end: number | null;
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

const YEAR_MIN = 2016;
const YEAR_MAX = 2025;

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

  if (totalPages === 6) {
    if (currentPage <= 3) {
      return [1, 2, 3, 4, "...", 6];
    } else {
      return [1, "...", 3, 4, 5, 6];
    }
  }

  // 7페이지 이상
  if (currentPage <= 3) {
    return [1, 2, 3, 4, "...", totalPages];
  } else if (currentPage >= totalPages - 2) {
    return [
      1,
      "...",
      totalPages - 3,
      totalPages - 2,
      totalPages - 1,
      totalPages,
    ];
  } else {
    return [
      1,
      "...",
      currentPage - 1,
      currentPage,
      currentPage + 1,
      "...",
      totalPages,
    ];
  }
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

const PAGE_SIZE = 6;

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
    year_start: null,
    year_end: null,
    paper_type: null,
    kci: false,
    sci: false,
  });

  const [yearOpen, setYearOpen] = useState(false);
  const [tempRange, setTempRange] = useState<[number, number]>([
    YEAR_MIN,
    YEAR_MAX,
  ]);
  const yearRefDesktop = useRef<HTMLDivElement>(null);
  const yearRefMobile = useRef<HTMLDivElement>(null);
  const yearMobileTriggerRef = useRef<HTMLDivElement>(null);
  const [mobilePanelPos, setMobilePanelPos] = useState<{
    top: number;
    left: number;
  } | null>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      const insideDesktop = yearRefDesktop.current?.contains(target) ?? false;
      const insideMobile = yearRefMobile.current?.contains(target) ?? false;
      if (!insideDesktop && !insideMobile) {
        setYearOpen(false);
      }
    };
    if (yearOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [yearOpen]);

  useEffect(() => {
    if (!yearOpen) return;

    const updatePosition = () => {
      const rect = yearMobileTriggerRef.current?.getBoundingClientRect();
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
  }, [yearOpen]);

  useEffect(() => {
    if (yearOpen) {
      const scrollbarWidth =
        window.innerWidth - document.documentElement.clientWidth;
      document.body.style.overflow = "hidden";
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    } else {
      document.body.style.overflow = "";
      document.body.style.paddingRight = "";
    }
    return () => {
      document.body.style.overflow = "";
      document.body.style.paddingRight = "";
    };
  }, [yearOpen]);

  const isYearApplied = filter.year_start !== null && filter.year_end !== null;
  const isApplyDisabled =
    tempRange[0] === YEAR_MIN && tempRange[1] === YEAR_MAX;

  const handleYearToggle = () => {
    if (!yearOpen) {
      setTempRange([
        filter.year_start ?? YEAR_MIN,
        filter.year_end ?? YEAR_MAX,
      ]);
      const mobileRect = yearMobileTriggerRef.current?.getBoundingClientRect();
      if (mobileRect && mobileRect.width > 0) {
        const panelWidth = 204;
        const left =
          mobileRect.left + panelWidth > window.innerWidth
            ? window.innerWidth - panelWidth - 8
            : mobileRect.left;
        setMobilePanelPos({ top: mobileRect.bottom + 4, left });
      }
    }
    setYearOpen((prev) => !prev);
  };

  const handleYearClear = (e: React.MouseEvent<SVGSVGElement>) => {
    e.stopPropagation();
    setYearOpen(false);
    updateFilter({ year_start: null, year_end: null });
  };

  const handleSliderChange = (_: Event, newValue: number | number[]) => {
    const [s, end] = newValue as [number, number];
    setTempRange([s, end]);
  };

  const handleYearApply = () => {
    updateFilter({ year_start: tempRange[0], year_end: tempRange[1] });
    setYearOpen(false);
  };

  const updateFilter = (partial: Partial<PaperFilter>) => {
    const next = { ...filter, ...partial };
    const effectiveNext = {
      ...next,
      sort: citationSortAvailable ? next.sort : "recent",
    };
    setFilter(effectiveNext);
    onFilterChange(effectiveNext);
  };

  const SORT_OPTIONS: { label: string; value: ResearcherPaperSortType }[] = [
    { label: "최신순", value: "recent" },
    ...(citationSortAvailable
      ? [{ label: "피인용순", value: "citations" as ResearcherPaperSortType }]
      : []),
  ];

  const effectiveSort: ResearcherPaperSortType = citationSortAvailable
    ? filter.sort
    : "recent";

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
            selectedValue={effectiveSort}
            onSelect={(value) => {
              if (value === "__clear__") return;
              updateFilter({ sort: value as ResearcherPaperSortType });
            }}
            isMobile={false}
          />
          {/* 발행연도 */}
          <Box ref={yearRefDesktop} sx={{ position: "relative" }}>
            <Box
              onClick={handleYearToggle}
              sx={{
                display: "flex",
                height: "42px",
                padding: "8px 8px 8px 16px",
                alignItems: "center",
                gap: "16px",
                borderRadius: "216px",
                backgroundColor: isYearApplied ? "#1E2026" : "fill.normal",
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
                  color: isYearApplied ? "#FFF" : "label.alternative",
                  fontSize: "16px",
                  fontWeight: 400,
                  lineHeight: "24px",
                  letterSpacing: "-0.336px",
                }}
              >
                {isYearApplied
                  ? `${filter.year_start} ~ ${filter.year_end}년`
                  : "발행연도"}
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  padding: "9px 10px 11px 10px",
                  justifyContent: "center",
                  alignItems: "center",
                  borderRadius: "24px",
                }}
              >
                {isYearApplied ? (
                  <CloseIcon
                    onClick={handleYearClear}
                    sx={{
                      width: 20,
                      height: 20,
                      color: "#FFF",
                      cursor: "pointer",
                    }}
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

            {yearOpen && (
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
                  gap: "12px",
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
                      gap: "16px",
                      flex: "1 0 0",
                    }}
                  >
                    <Typography
                      sx={{
                        display: "-webkit-box",
                        WebkitBoxOrient: "vertical",
                        WebkitLineClamp: 1,
                        overflow: "hidden",
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
            )}
          </Box>
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
          maxWidth: "100%",
          "&::-webkit-scrollbar": { display: "none" },
        }}
      >
        <DropdownFilter
          label="최신순"
          options={SORT_OPTIONS}
          selectedValue={effectiveSort}
          onSelect={(value) => {
            if (value === "__clear__") return;
            updateFilter({ sort: value as ResearcherPaperSortType });
          }}
          isMobile={true}
        />
        {/* 발행연도 */}
        <Box ref={yearRefMobile} sx={{ position: "relative" }}>
          <Box
            ref={yearMobileTriggerRef}
            onClick={handleYearToggle}
            sx={{
              display: "flex",
              height: "36px",
              padding: "0 8px 0 16px",
              alignItems: "center",
              gap: "4px",
              borderRadius: "216px",
              backgroundColor: isYearApplied ? "#1E2026" : "fill.normal",
              cursor: "pointer",
              flexShrink: 0,
            }}
          >
            <Typography
              sx={{
                color: isYearApplied ? "#FFF" : "label.alternative",
                fontSize: "13px",
                fontWeight: 400,
                lineHeight: "22px",
                letterSpacing: "-0.26px",
                whiteSpace: "nowrap",
                flexShrink: 0,
              }}
            >
              {isYearApplied
                ? `${filter.year_start} ~ ${filter.year_end}년`
                : "발행연도"}
            </Typography>
            <Box
              sx={{
                display: "flex",
                padding: "7px 8px 9px 8px",
                justifyContent: "center",
                alignItems: "center",
                borderRadius: "24px",
              }}
            >
              {isYearApplied ? (
                <CloseIcon
                  onClick={handleYearClear}
                  sx={{
                    width: 20,
                    height: 20,
                    color: "#FFF",
                    cursor: "pointer",
                  }}
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

          {yearOpen && mobilePanelPos && (
            <Box
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
                gap: "12px",
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
                    gap: "16px",
                    flex: "1 0 0",
                  }}
                >
                  <Typography
                    sx={{
                      display: "-webkit-box",
                      WebkitBoxOrient: "vertical",
                      WebkitLineClamp: 1,
                      overflow: "hidden",
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
            </Box>
          )}
        </Box>
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
