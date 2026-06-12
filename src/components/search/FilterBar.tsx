import { Box, Button, Menu, MenuItem } from "@mui/material";
import { useState } from "react";
import { type SxProps, type Theme } from "@mui/material/styles";
import { type PaperType } from "../../types/paper";
import { type SortOrder } from "../../types/search";

interface FilterBarProps {
  sortOrder: SortOrder;
  filterPaperType: PaperType | null;
  onSortChange: (sort: SortOrder) => void;
  onFilterChange: (paperType: PaperType | null) => void;
  onResetCondition: () => void;
}

const containerSx: SxProps<Theme> = {
  display: "flex",
  alignItems: "center",
  gap: "6px",
  flexShrink: 0,
  justifyContent: "flex-end",
};

const filterButtonSx: SxProps<Theme> = {
  padding: "5px 13px",
  borderRadius: "7px",
  border: "1px solid",
  borderColor: "line.normal",
  backgroundColor: "background.default",
  color: "label.normal",
  fontSize: "17px",
  fontWeight: 600,
  lineHeight: "170%",
  letterSpacing: "-0.34px",
  textTransform: "none",
  "&:hover": { backgroundColor: "fill.normal" },
};

const activeFilterButtonSx: SxProps<Theme> = {
  ...filterButtonSx,
  backgroundColor: "#31333F",
  color: "#FFF",
  borderColor: "#31333F",
  "&:hover": { backgroundColor: "#474A55" },
};

const resetButtonSx: SxProps<Theme> = {
  padding: "5px 13px 5px 16px",
  borderRadius: "7px",
  backgroundColor: "#31333F",
  color: "#FFF",
  fontSize: "17px",
  fontWeight: 600,
  lineHeight: "170%",
  letterSpacing: "-0.34px",
  textTransform: "none",
  "&:hover": { backgroundColor: "#474A55" },
};

const SORT_OPTIONS: { label: string; value: SortOrder }[] = [
  { label: "관련도순", value: "relevance" },
  { label: "최신순", value: "year_desc" },
  { label: "오래된순", value: "year_asc" },
];

const PAPER_TYPE_OPTIONS: { label: string; value: PaperType | null }[] = [
  { label: "전체", value: null },
  { label: "학술 저널", value: "학술 저널" },
  { label: "박사 학위 논문", value: "박사 학위 논문" },
  { label: "석사 학위 논문", value: "석사 학위 논문" },
];

const FilterBar = ({
  sortOrder,
  filterPaperType,
  onSortChange,
  onFilterChange,
  onResetCondition,
}: FilterBarProps) => {
  const [sortAnchorEl, setSortAnchorEl] = useState<null | HTMLElement>(null);
  const [typeAnchorEl, setTypeAnchorEl] = useState<null | HTMLElement>(null);

  const currentSortLabel =
    SORT_OPTIONS.find((o) => o.value === sortOrder)?.label ?? "발행 연도";
  const currentTypeLabel =
    PAPER_TYPE_OPTIONS.find((o) => o.value === filterPaperType)?.label ??
    "논문 유형";

  return (
    <Box sx={containerSx}>
      {/* 정렬 */}
      <Button
        sx={sortOrder !== "relevance" ? activeFilterButtonSx : filterButtonSx}
        onClick={(e: React.MouseEvent<HTMLButtonElement>) =>
          setSortAnchorEl(e.currentTarget)
        }
      >
        {currentSortLabel}
      </Button>
      <Menu
        anchorEl={sortAnchorEl}
        open={Boolean(sortAnchorEl)}
        onClose={() => setSortAnchorEl(null)}
      >
        {SORT_OPTIONS.map((option) => (
          <MenuItem
            key={option.value}
            selected={sortOrder === option.value}
            onClick={() => {
              onSortChange(option.value);
              setSortAnchorEl(null);
            }}
          >
            {option.label}
          </MenuItem>
        ))}
      </Menu>

      {/* 논문 유형 */}
      <Button
        sx={filterPaperType !== null ? activeFilterButtonSx : filterButtonSx}
        onClick={(e: React.MouseEvent<HTMLButtonElement>) =>
          setTypeAnchorEl(e.currentTarget)
        }
      >
        {currentTypeLabel}
      </Button>
      <Menu
        anchorEl={typeAnchorEl}
        open={Boolean(typeAnchorEl)}
        onClose={() => setTypeAnchorEl(null)}
      >
        {PAPER_TYPE_OPTIONS.map((option) => (
          <MenuItem
            key={option.value ?? "all"}
            selected={filterPaperType === option.value}
            onClick={() => {
              onFilterChange(option.value);
              setTypeAnchorEl(null);
            }}
          >
            {option.label}
          </MenuItem>
        ))}
      </Menu>

      {/* TODO: SCI 등재 필터 — 백엔드 지원 확인 후 구현 */}
      <Button sx={filterButtonSx}>SCI 등재</Button>

      {/* TODO: 검색 필터 추가 — 추후 구현 */}
      <Button sx={filterButtonSx}>검색 필터 추가하기</Button>

      <Button sx={resetButtonSx} onClick={onResetCondition}>
        탐색 조건 재설정하기
      </Button>
    </Box>
  );
};

export default FilterBar;
