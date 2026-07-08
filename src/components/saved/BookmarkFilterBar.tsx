import { useState, useRef } from "react";
import { Box, Typography } from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { type SxProps, type Theme } from "@mui/material/styles";
import { type BookmarkFilter } from "../../types/saved";
import { type BookmarkPaperTypeFilter } from "../../api/bookmark";

interface BookmarkFilterBarProps {
  filter: BookmarkFilter;
  onFilterChange: (filter: BookmarkFilter) => void;
}

const filterPillSx: SxProps<Theme> = {
  display: "flex",
  width: "164px",
  height: "42px",
  padding: "8px 8px 8px 16px",
  justifyContent: "space-between",
  alignItems: "center",
  borderRadius: "216px",
  backgroundColor: "background.default",
  cursor: "pointer",
  flexShrink: 0,
};

const filterTextSx: SxProps<Theme> = {
  display: "-webkit-box",
  WebkitBoxOrient: "vertical",
  WebkitLineClamp: 1,
  overflow: "hidden",
  textOverflow: "ellipsis",
  color: "label.alternative",
  fontSize: "16px",
  fontWeight: 400,
  lineHeight: "24px",
  letterSpacing: "-0.336px",
};

const dropdownArrowSx: SxProps<Theme> = {
  display: "flex",
  width: "40px",
  height: "40px",
  padding: "9px 10px 11px 10px",
  justifyContent: "center",
  alignItems: "center",
  borderRadius: "24px",
  flexShrink: 0,
};

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
  minWidth: "164px",
};

const dropdownItemActiveSx: SxProps<Theme> = {
  display: "flex",
  height: "42px",
  padding: "8px",
  justifyContent: "center",
  alignItems: "center",
  gap: "16px",
  alignSelf: "stretch",
  borderRadius: "216px",
  backgroundColor: "background.paper",
  cursor: "pointer",
};

const dropdownItemSx: SxProps<Theme> = {
  display: "flex",
  height: "42px",
  padding: "8px",
  justifyContent: "center",
  alignItems: "center",
  gap: "16px",
  alignSelf: "stretch",
  borderRadius: "216px",
  backgroundColor: "background.default",
  cursor: "pointer",
  "&:hover": { backgroundColor: "background.paper" },
};

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
  flex: "1 0 0",
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
        <Box sx={filterPillSx} onClick={() => toggleDropdown("year")}>
          <Typography sx={filterTextSx}>
            {filter.year !== null ? `${filter.year}년` : "발행 연도"}
          </Typography>
          <Box sx={dropdownArrowSx}>
            <KeyboardArrowDownIcon
              sx={{ fontSize: 20, color: "label.alternative" }}
            />
          </Box>
        </Box>
        {openDropdown === "year" && (
          <Box sx={dropdownContainerSx}>
            {YEARS.map((year) => (
              <Box
                key={year}
                sx={
                  filter.year === year ? dropdownItemActiveSx : dropdownItemSx
                }
                onClick={() => handleYearSelect(year)}
              >
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    flex: "1 0 0",
                  }}
                >
                  <Typography sx={dropdownItemTextSx}>{year}</Typography>
                </Box>
              </Box>
            ))}
          </Box>
        )}
      </Box>

      {/* 논문 유형 */}
      <Box ref={typeRef} sx={{ position: "relative" }}>
        <Box sx={filterPillSx} onClick={() => toggleDropdown("type")}>
          <Typography sx={filterTextSx}>
            {filter.type ?? "논문 유형"}
          </Typography>
          <Box sx={dropdownArrowSx}>
            <KeyboardArrowDownIcon
              sx={{ fontSize: 20, color: "label.alternative" }}
            />
          </Box>
        </Box>
        {openDropdown === "type" && (
          <Box sx={dropdownContainerSx}>
            {PAPER_TYPES.map((type) => (
              <Box
                key={type}
                sx={
                  filter.type === type ? dropdownItemActiveSx : dropdownItemSx
                }
                onClick={() => handleTypeSelect(type)}
              >
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    flex: "1 0 0",
                  }}
                >
                  <Typography sx={dropdownItemTextSx}>{type}</Typography>
                </Box>
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
