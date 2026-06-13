import { Box, Typography } from "@mui/material";
import { type SxProps, type Theme } from "@mui/material/styles";
import FilterBar from "./FilterBar";
import PaperListCard from "./PaperListCard";
import { type SearchPaper } from "../../types/search";
import { type PaperType } from "../../types/paper";

interface PaperListPanelProps {
  papers: SearchPaper[];
  totalCount: number;
  filterPaperType: PaperType | null;
  filterYear: number | null;
  filterKci: boolean | null;
  filterSci: boolean | null;
  bookmarks: Record<string, boolean>;
  onFilterPaperTypeChange: (paperType: PaperType | null) => void;
  onFilterYearChange: (year: number | null) => void;
  onFilterKciChange: (kci: boolean | null) => void;
  onFilterSciChange: (sci: boolean | null) => void;
  onResetCondition: () => void;
  onBookmark: (paperId: string) => void;
  onPaperClick: (paperId: string) => void;
}

const containerSx: SxProps<Theme> = {
  display: "flex",
  flexDirection: "column",
  height: "100%",
  px: "94.5px",
  py: "27px",
  gap: "16px",
  overflow: "hidden",
};

const headerSx: SxProps<Theme> = {
  display: "flex",
  flexDirection: "column",
  gap: "16px",
  flexShrink: 0,
};

const totalCountSx: SxProps<Theme> = {
  fontSize: "24px",
  fontWeight: 600,
  color: "#000",
  lineHeight: "150%",
};

const paperListSx: SxProps<Theme> = {
  flex: 1,
  overflowY: "auto",
  display: "flex",
  flexDirection: "column",
  gap: "17px",
  pb: "20px",
};

const PaperListPanel = ({
  papers,
  totalCount,
  filterPaperType,
  filterYear,
  filterKci,
  filterSci,
  bookmarks,
  onFilterPaperTypeChange,
  onFilterYearChange,
  onFilterKciChange,
  onFilterSciChange,
  onResetCondition,
  onBookmark,
  onPaperClick,
}: PaperListPanelProps) => {
  return (
    <Box sx={containerSx}>
      <Box sx={headerSx}>
        <Typography sx={totalCountSx}>검색 결과 {totalCount}건</Typography>
        <FilterBar
          filterPaperType={filterPaperType}
          filterYear={filterYear}
          filterKci={filterKci}
          filterSci={filterSci}
          onFilterPaperTypeChange={onFilterPaperTypeChange}
          onFilterYearChange={onFilterYearChange}
          onFilterKciChange={onFilterKciChange}
          onFilterSciChange={onFilterSciChange}
          onResetCondition={onResetCondition}
        />
      </Box>
      <Box sx={paperListSx}>
        {papers.map((paper) => (
          <PaperListCard
            key={paper.paper_id}
            paper={paper}
            isBookmarked={bookmarks[paper.paper_id] ?? false}
            onBookmark={onBookmark}
            onClick={onPaperClick}
          />
        ))}
      </Box>
    </Box>
  );
};

export default PaperListPanel;
