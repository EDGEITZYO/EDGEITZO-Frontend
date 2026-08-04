import { useState, useRef, useEffect } from "react";
import { Box, Typography } from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import CloseIcon from "@mui/icons-material/Close";
import { type SxProps, type Theme } from "@mui/material/styles";
import { type BookmarkFilter } from "../../types/saved";
import { type BookmarkPaperTypeFilter } from "../../api/bookmark";

interface BookmarkFilterBarProps {
  filter: BookmarkFilter;
  onFilterChange: (filter: BookmarkFilter) => void;
}

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

const CURRENT_YEAR = new Date().getFullYear();
const YEARS = Array.from(
  { length: CURRENT_YEAR - 2016 + 1 },
  (_, i) => CURRENT_YEAR - i,
);

const PAPER_TYPES: BookmarkPaperTypeFilter[] = [
  "학술 저널",
  "박사학위 논문",
  "석사학위 논문",
];

const BookmarkFilterBar = ({
  filter,
  onFilterChange,
}: BookmarkFilterBarProps) => {
  const [openDropdown, setOpenDropdown] = useState<"year" | "type" | null>(
    null,
  );
  const yearRef = useRef<HTMLDivElement>(null);
  const typeRef = useRef<HTMLDivElement>(null);

  const handleYearSelect = (year: number) => {
    onFilterChange({ ...filter, year: filter.year === year ? null : year });
    setOpenDropdown(null);
  };

  const handleTypeSelect = (type: BookmarkPaperTypeFilter) => {
    onFilterChange({ ...filter, type: filter.type === type ? null : type });
    setOpenDropdown(null);
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
        openDropdown === "year" &&
        yearRef.current &&
        !yearRef.current.contains(e.target as Node)
      ) {
        setOpenDropdown(null);
      }
      if (
        openDropdown === "type" &&
        typeRef.current &&
        !typeRef.current.contains(e.target as Node)
      ) {
        setOpenDropdown(null);
      }
    };
    if (openDropdown !== null) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [openDropdown]);

  const toggleDropdown = (type: "year" | "type") => {
    setOpenDropdown((prev) => (prev === type ? null : type));
  };

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
              filter.year !== null ? "#1E2026" : "background.default",
            cursor: filter.year !== null ? "default" : "pointer",
            flexShrink: 0,
          }}
          onClick={() => {
            if (filter.year !== null) return;
            toggleDropdown("year");
          }}
        >
          <Typography
            sx={{
              display: "-webkit-box",
              WebkitBoxOrient: "vertical",
              WebkitLineClamp: 1,
              overflow: "hidden",
              textOverflow: "ellipsis",
              color: filter.year !== null ? "#FFF" : "label.alternative",
              fontSize: "16px",
              fontWeight: 400,
              lineHeight: "24px",
              letterSpacing: "-0.336px",
            }}
          >
            {filter.year !== null ? `${filter.year}년` : "발행 연도"}
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
            {filter.year !== null ? (
              <CloseIcon
                onClick={(e: React.MouseEvent<SVGSVGElement>) => {
                  e.stopPropagation();
                  onFilterChange({ ...filter, year: null });
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
        {openDropdown === "year" && (
          <Box sx={dropdownContainerSx}>
            {YEARS.map((year) => (
              <Box
                key={year}
                sx={dropdownItemSx(filter.year === year)}
                onClick={() => handleYearSelect(year)}
              >
                <Typography sx={dropdownItemTextSx}>{year}</Typography>
              </Box>
            ))}
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
            toggleDropdown("type");
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
        {openDropdown === "type" && (
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
