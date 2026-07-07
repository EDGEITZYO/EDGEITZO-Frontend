import { useState, useRef } from "react";
import { Box, Button, Paper, Typography } from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { type SxProps, type Theme } from "@mui/material/styles";
import { type BookmarkFilter } from "../../types/saved";
import { type BookmarkPaperTypeFilter } from "../../api/bookmark";

interface BookmarkFilterBarProps {
  filter: BookmarkFilter;
  onFilterChange: (filter: BookmarkFilter) => void;
}

const containerSx: SxProps<Theme> = {
  display: "flex",
  alignItems: "center",
  gap: "6px",
  flexShrink: 0,
};

const filterButtonSx = (isActive: boolean): SxProps<Theme> => ({
  padding: "5px 13px",
  borderRadius: "7px",
  border: "1px solid",
  borderColor: isActive ? "static.black" : "line.normal",
  backgroundColor: isActive ? "static.black" : "background.default",
  color: isActive ? "static.white" : "label.normal",
  fontSize: "17px",
  fontWeight: 600,
  lineHeight: "170%",
  letterSpacing: "-0.34px",
  textTransform: "none",
  display: "flex",
  alignItems: "center",
  gap: "4px",
  "&:hover": { backgroundColor: isActive ? "label.neutral" : "fill.normal" },
});

const dropdownSx: SxProps<Theme> = {
  position: "absolute",
  top: "calc(100% + 4px)",
  left: 0,
  zIndex: 100,
  borderRadius: "8px",
  border: "1px solid",
  borderColor: "line.normal",
  backgroundColor: "background.default",
  minWidth: "140px",
  overflow: "hidden",
  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
};

const dropdownItemSx = (isActive: boolean): SxProps<Theme> => ({
  px: "16px",
  py: "10px",
  cursor: "pointer",
  backgroundColor: isActive ? "fill.normal" : "transparent",
  "&:hover": { backgroundColor: "fill.normal" },
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

  const toggleDropdown = (type: "year" | "type") => {
    setOpenDropdown((prev) => (prev === type ? null : type));
  };

  return (
    <Box sx={containerSx}>
      {/* 발행 연도 */}
      <Box ref={yearRef} sx={{ position: "relative" }}>
        <Button
          sx={filterButtonSx(filter.year !== null)}
          onClick={() => toggleDropdown("year")}
        >
          {filter.year !== null ? `${filter.year}년` : "발행 연도"}
          <KeyboardArrowDownIcon sx={{ fontSize: 18 }} />
        </Button>
        {openDropdown === "year" && (
          <Paper sx={dropdownSx}>
            {YEARS.map((year) => (
              <Box
                key={year}
                sx={dropdownItemSx(filter.year === year)}
                onClick={() => handleYearSelect(year)}
              >
                <Typography
                  sx={{
                    fontSize: "16px",
                    fontWeight: filter.year === year ? 600 : 400,
                    color: "label.strong",
                  }}
                >
                  {year}
                </Typography>
              </Box>
            ))}
          </Paper>
        )}
      </Box>

      {/* 논문 유형 */}
      <Box ref={typeRef} sx={{ position: "relative" }}>
        <Button
          sx={filterButtonSx(filter.type !== null)}
          onClick={() => toggleDropdown("type")}
        >
          {filter.type ?? "논문 유형"}
          <KeyboardArrowDownIcon sx={{ fontSize: 18 }} />
        </Button>
        {openDropdown === "type" && (
          <Paper sx={dropdownSx}>
            {PAPER_TYPES.map((type) => (
              <Box
                key={type}
                sx={dropdownItemSx(filter.type === type)}
                onClick={() => handleTypeSelect(type)}
              >
                <Typography
                  sx={{
                    fontSize: "16px",
                    fontWeight: filter.type === type ? 600 : 400,
                    color: "label.strong",
                  }}
                >
                  {type}
                </Typography>
              </Box>
            ))}
          </Paper>
        )}
      </Box>

      {/* KCI 등재 */}
      <Button
        sx={filterButtonSx(filter.kci === true)}
        onClick={handleKciToggle}
      >
        KCI 등재
      </Button>

      {/* SCI 등재 */}
      <Button
        sx={filterButtonSx(filter.sci === true)}
        onClick={handleSciToggle}
      >
        SCI 등재
      </Button>
    </Box>
  );
};

export default BookmarkFilterBar;
