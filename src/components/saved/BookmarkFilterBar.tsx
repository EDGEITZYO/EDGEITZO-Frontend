import { useState, useRef, useEffect } from "react";
import { Box, Typography, Slider } from "@mui/material";
import { type SxProps, type Theme } from "@mui/material/styles";
import CloseIcon from "@mui/icons-material/Close";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { type BookmarkFilter } from "../../types/saved";
import { type BookmarkPaperTypeFilter } from "../../api/bookmark";

// ─── 상수 ─────────────────────────────────────────────────

const YEAR_MIN = 2016;
const YEAR_MAX = 2025;

const PAPER_TYPES: BookmarkPaperTypeFilter[] = [
  "학술 저널",
  "박사학위 논문",
  "석사학위 논문",
];

// ─── 타입 ─────────────────────────────────────────────────

interface BookmarkFilterBarProps {
  filter: BookmarkFilter;
  onFilterChange: (filter: BookmarkFilter) => void;
}

// ─── 스타일 ───────────────────────────────────────────────

const dropdownContainerSx: SxProps<Theme> = {
  position: "absolute",
  top: "calc(100% + 4px)",
  left: 0,
  zIndex: 100,
  display: "flex",
  padding: "8px",
  flexDirection: "column",
  alignItems: "center",
  alignSelf: "stretch",
  borderRadius: "28px",
  border: "1px solid",
  borderColor: "label.alternative",
  backgroundColor: "background.default",
  minWidth: "100%",
};

const dropdownItemSx = (isActive: boolean): SxProps<Theme> => ({
  display: "flex",
  height: "42px",
  padding: "8px",
  alignItems: "center",
  alignSelf: "stretch",
  borderRadius: "216px",
  backgroundColor: isActive ? "background.paper" : "background.default",
  cursor: "pointer",
  "&:hover": { backgroundColor: "background.paper" },
});

const dropdownItemTextSx: SxProps<Theme> = {
  display: "-webkit-box",
  WebkitBoxOrient: "vertical",
  WebkitLineClamp: 1,
  overflow: "hidden",
  textOverflow: "ellipsis",
  color: "label.normal",
  fontSize: "16px",
  fontWeight: 400,
  lineHeight: "24px",
  letterSpacing: "-0.336px",
};

const togglePillSx = (isActive: boolean): SxProps<Theme> => ({
  display: "flex",
  padding: "8px 13px",
  justifyContent: "center",
  alignItems: "center",
  borderRadius: "24px",
  backgroundColor: isActive ? "primary.dark" : "background.default",
  cursor: "pointer",
  flexShrink: 0,
});

const toggleTextSx = (isActive: boolean): SxProps<Theme> => ({
  display: "-webkit-box",
  WebkitBoxOrient: "vertical",
  WebkitLineClamp: 1,
  overflow: "hidden",
  textOverflow: "ellipsis",
  color: isActive ? "static.white" : "label.alternative",
  fontSize: "16px",
  fontWeight: 400,
  lineHeight: "24px",
  letterSpacing: "-0.336px",
});

// ─── BookmarkFilterBar ────────────────────────────────────

const BookmarkFilterBar = ({
  filter,
  onFilterChange,
}: BookmarkFilterBarProps) => {
  const [yearOpen, setYearOpen] = useState(false);
  const [tempRange, setTempRange] = useState<[number, number]>([
    YEAR_MIN,
    YEAR_MAX,
  ]);
  const [typeOpen, setTypeOpen] = useState(false);
  const yearRef = useRef<HTMLDivElement>(null);
  const typeRef = useRef<HTMLDivElement>(null);

  const isYearApplied = filter.year_start !== null && filter.year_end !== null;
  const isApplyDisabled =
    tempRange[0] === YEAR_MIN && tempRange[1] === YEAR_MAX;

  const handleYearToggle = () => {
    if (!yearOpen) {
      setTempRange([
        filter.year_start ?? YEAR_MIN,
        filter.year_end ?? YEAR_MAX,
      ]);
    }
    setYearOpen((prev) => !prev);
  };

  const handleYearClear = (e: React.MouseEvent<SVGSVGElement>) => {
    e.stopPropagation();
    setYearOpen(false);
    onFilterChange({ ...filter, year_start: null, year_end: null });
  };

  const handleSliderChange = (_: Event, newValue: number | number[]) => {
    const [s, e] = newValue as [number, number];
    setTempRange([s, e]);
  };

  const handleYearApply = () => {
    onFilterChange({
      ...filter,
      year_start: tempRange[0],
      year_end: tempRange[1],
    });
    setYearOpen(false);
  };

  const handleTypeSelect = (type: BookmarkPaperTypeFilter) => {
    onFilterChange({ ...filter, type: filter.type === type ? null : type });
    setTypeOpen(false);
  };

  const handleKciToggle = () => {
    onFilterChange({ ...filter, kci: filter.kci === true ? null : true });
  };

  const handleSciToggle = () => {
    onFilterChange({ ...filter, sci: filter.sci === true ? null : true });
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        yearOpen &&
        yearRef.current &&
        !yearRef.current.contains(e.target as Node)
      ) {
        setYearOpen(false);
      }
      if (
        typeOpen &&
        typeRef.current &&
        !typeRef.current.contains(e.target as Node)
      ) {
        setTypeOpen(false);
      }
    };
    if (yearOpen || typeOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [yearOpen, typeOpen]);

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: "12px",
        flexWrap: "wrap",
      }}
    >
      {/* 발행 연도 */}
      <Box ref={yearRef} sx={{ position: "relative" }}>
        {/* 트리거 */}
        <Box
          onClick={handleYearToggle}
          sx={{
            display: "flex",
            width: "240px",
            height: "42px",
            padding: "8px 8px 8px 16px",
            justifyContent: "space-between",
            alignItems: "center",
            borderRadius: "216px",
            backgroundColor: isYearApplied ? "#1E2026" : "background.default",
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
              textOverflow: "ellipsis",
              color: isYearApplied ? "#FFF" : "label.alternative",
              fontSize: "16px",
              fontWeight: 400,
              lineHeight: "24px",
              letterSpacing: "-0.336px",
            }}
          >
            {isYearApplied
              ? `${filter.year_start} ~ ${filter.year_end}년`
              : "발행 연도"}
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
              flexShrink: 0,
            }}
          >
            {isYearApplied ? (
              <CloseIcon
                onClick={handleYearClear}
                sx={{ fontSize: 20, color: "#FFF", cursor: "pointer" }}
              />
            ) : (
              <KeyboardArrowDownIcon
                sx={{
                  fontSize: 20,
                  color: "label.alternative",
                  transform: yearOpen ? "rotate(180deg)" : "none",
                }}
              />
            )}
          </Box>
        </Box>

        {/* 연도 범위 패널 */}
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
              gap: "0px",
              borderRadius: "16px",
              border: "1px solid",
              borderColor: "label.alternative",
              backgroundColor: "background.default",
            }}
          >
            {/* 연도 표시 + 슬라이더 묶음 */}
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

            {/* 적용 버튼 */}
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
                  display: "-webkit-box",
                  WebkitBoxOrient: "vertical",
                  WebkitLineClamp: 1,
                  overflow: "hidden",
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

      {/* 논문 유형 */}
      <Box ref={typeRef} sx={{ position: "relative" }}>
        <Box
          sx={{
            display: "flex",
            width: "164px",
            height: "42px",
            padding: "8px 8px 8px 16px",
            justifyContent: "space-between",
            alignItems: "center",
            borderRadius: "216px",
            backgroundColor:
              filter.type !== null ? "#1E2026" : "background.default",
            cursor: filter.type !== null ? "default" : "pointer",
            flexShrink: 0,
          }}
          onClick={() => {
            if (filter.type !== null) return;
            setTypeOpen((prev) => !prev);
          }}
        >
          <Typography
            sx={{
              display: "-webkit-box",
              WebkitBoxOrient: "vertical",
              WebkitLineClamp: 1,
              overflow: "hidden",
              textOverflow: "ellipsis",
              color: filter.type !== null ? "#FFF" : "label.alternative",
              fontSize: "16px",
              fontWeight: 400,
              lineHeight: "24px",
              letterSpacing: "-0.336px",
            }}
          >
            {filter.type ?? "논문 유형"}
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
              flexShrink: 0,
            }}
          >
            {filter.type !== null ? (
              <CloseIcon
                onClick={(e: React.MouseEvent<SVGSVGElement>) => {
                  e.stopPropagation();
                  onFilterChange({ ...filter, type: null });
                }}
                sx={{ fontSize: 20, color: "#FFF", cursor: "pointer" }}
              />
            ) : (
              <KeyboardArrowDownIcon
                sx={{ fontSize: 20, color: "label.alternative" }}
              />
            )}
          </Box>
        </Box>
        {typeOpen && (
          <Box sx={dropdownContainerSx}>
            {PAPER_TYPES.map((type) => (
              <Box
                key={type}
                sx={dropdownItemSx(filter.type === type)}
                onClick={() => handleTypeSelect(type)}
              >
                <Typography sx={dropdownItemTextSx}>{type}</Typography>
              </Box>
            ))}
          </Box>
        )}
      </Box>

      {/* KCI 등재 */}
      <Box sx={togglePillSx(filter.kci === true)} onClick={handleKciToggle}>
        <Typography sx={toggleTextSx(filter.kci === true)}>KCI 등재</Typography>
      </Box>

      {/* SCI 등재 */}
      <Box sx={togglePillSx(filter.sci === true)} onClick={handleSciToggle}>
        <Typography sx={toggleTextSx(filter.sci === true)}>SCI 등재</Typography>
      </Box>
    </Box>
  );
};

export default BookmarkFilterBar;
