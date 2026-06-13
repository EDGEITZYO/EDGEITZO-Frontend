import { Box, Button } from "@mui/material";
import { useState } from "react";
import { type SxProps, type Theme } from "@mui/material/styles";
import { type PaperType } from "../../types/paper";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { Paper, Typography } from "@mui/material";

interface FilterBarProps {
  filterPaperType: PaperType | null;
  filterYear: number | null;
  filterKci: boolean | null;
  filterSci: boolean | null;
  onFilterPaperTypeChange: (paperType: PaperType | null) => void;
  onFilterYearChange: (year: number | null) => void;
  onFilterKciChange: (kci: boolean | null) => void;
  onFilterSciChange: (sci: boolean | null) => void;
  onResetCondition: () => void;
}

const containerSx: SxProps<Theme> = {
  display: "flex",
  alignItems: "center",
  gap: "6px",
  flexShrink: 0,
  justifyContent: "flex-end",
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

const resetButtonSx: SxProps<Theme> = {
  padding: "5px 13px",
  borderRadius: "7px",
  backgroundColor: "static.black",
  color: "static.white",
  fontSize: "17px",
  fontWeight: 600,
  lineHeight: "170%",
  letterSpacing: "-0.34px",
  textTransform: "none",
  "&:hover": { backgroundColor: "label.neutral" },
};

const dropdownSx: SxProps<Theme> = {
  position: "absolute",
  top: "calc(100% + 4px)",
  right: 0,
  zIndex: 100,
  borderRadius: "8px",
  border: "1px solid",
  borderColor: "line.normal",
  backgroundColor: "background.default",
  minWidth: "140px",
  overflow: "hidden",
  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
};

const CURRENT_YEAR = new Date().getFullYear();
const YEARS = Array.from(
  { length: CURRENT_YEAR - 2016 + 1 },
  (_, i) => CURRENT_YEAR - i,
);

const PAPER_TYPES: { label: string; value: PaperType | null }[] = [
  { label: "전체", value: null },
  { label: "학술 저널", value: "학술 저널" },
  { label: "박사학위 논문", value: "박사학위 논문" },
  { label: "석사학위 논문", value: "석사학위 논문" },
];

const FilterBar = ({
  filterPaperType,
  filterYear,
  filterKci,
  filterSci,
  onFilterPaperTypeChange,
  onFilterYearChange,
  onFilterKciChange,
  onFilterSciChange,
  onResetCondition,
}: FilterBarProps) => {
  const [openDropdown, setOpenDropdown] = useState<"year" | "type" | null>(
    null,
  );

  return (
    <Box sx={containerSx}>
      {/* 발행 연도 */}
      <Box sx={{ position: "relative" }}>
        <Button
          sx={filterButtonSx(filterYear !== null)}
          onClick={() =>
            setOpenDropdown((prev) => (prev === "year" ? null : "year"))
          }
        >
          {filterYear !== null ? `${filterYear}년` : "발행 연도"}
          <KeyboardArrowDownIcon sx={{ fontSize: 18 }} />
        </Button>
        {openDropdown === "year" && (
          <Paper sx={dropdownSx}>
            {YEARS.map((year) => (
              <Box
                key={year}
                sx={{
                  px: "16px",
                  py: "10px",
                  cursor: "pointer",
                  backgroundColor:
                    filterYear === year ? "fill.normal" : "transparent",
                  "&:hover": { backgroundColor: "fill.normal" },
                }}
                onClick={() => {
                  onFilterYearChange(filterYear === year ? null : year);
                  setOpenDropdown(null);
                }}
              >
                <Typography
                  sx={{
                    fontSize: "16px",
                    fontWeight: filterYear === year ? 600 : 400,
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
      <Box sx={{ position: "relative" }}>
        <Button
          sx={filterButtonSx(filterPaperType !== null)}
          onClick={() =>
            setOpenDropdown((prev) => (prev === "type" ? null : "type"))
          }
        >
          {filterPaperType ?? "논문 유형"}
          <KeyboardArrowDownIcon sx={{ fontSize: 18 }} />
        </Button>
        {openDropdown === "type" && (
          <Paper sx={dropdownSx}>
            {PAPER_TYPES.map((option) => (
              <Box
                key={option.value ?? "all"}
                sx={{
                  px: "16px",
                  py: "10px",
                  cursor: "pointer",
                  backgroundColor:
                    filterPaperType === option.value
                      ? "fill.normal"
                      : "transparent",
                  "&:hover": { backgroundColor: "fill.normal" },
                }}
                onClick={() => {
                  onFilterPaperTypeChange(option.value);
                  setOpenDropdown(null);
                }}
              >
                <Typography
                  sx={{
                    fontSize: "16px",
                    fontWeight: filterPaperType === option.value ? 600 : 400,
                    color: "label.strong",
                  }}
                >
                  {option.label}
                </Typography>
              </Box>
            ))}
          </Paper>
        )}
      </Box>

      {/* KCI 등재 */}
      <Button
        sx={filterButtonSx(filterKci === true)}
        onClick={() => onFilterKciChange(filterKci === true ? null : true)}
      >
        KCI 등재
      </Button>

      {/* SCI 등재 */}
      <Button
        sx={filterButtonSx(filterSci === true)}
        onClick={() => onFilterSciChange(filterSci === true ? null : true)}
      >
        SCI 등재
      </Button>

      {/* 탐색 조건 재설정하기 */}
      <Button sx={resetButtonSx} onClick={onResetCondition}>
        탐색 조건 재설정하기
      </Button>
    </Box>
  );
};

export default FilterBar;
