import { Box, Typography } from "@mui/material";
import { type SxProps, type Theme } from "@mui/material/styles";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

export interface PaginationProps {
  total: number;
  page: number;
  size: number;
  onPageChange: (page: number) => void;
}

// ─── 유틸 ─────────────────────────────────────────────────

const getPaginationItems = (
  currentPage: number,
  totalPages: number,
): (number | "...")[] => {
  if (totalPages <= 5) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  if (totalPages === 6) {
    return currentPage <= 3 ? [1, 2, 3, 4, "...", 6] : [1, "...", 3, 4, 5, 6];
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

// ─── 스타일 ───────────────────────────────────────────────

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

// ─── Pagination ───────────────────────────────────────────

const Pagination = ({ total, page, size, onPageChange }: PaginationProps) => {
  const totalPages = Math.ceil(total / size);

  if (totalPages <= 1) return null;

  const items = getPaginationItems(page, totalPages);

  return (
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
        {items.map((item, i) =>
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
};

export default Pagination;
