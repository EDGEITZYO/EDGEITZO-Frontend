import { Box } from "@mui/material";
import { type SxProps, type Theme } from "@mui/material/styles";
import { type CoauthoredPaperItem } from "../../types/researcher";
import CoauthoredPaperCard from "./CoauthoredPaperCard";

export interface CoauthoredPapersListProps {
  papers: CoauthoredPaperItem[];
  onPaperClick: (paper: CoauthoredPaperItem) => void;
  onBookmarkToggle: (paper: CoauthoredPaperItem) => void;
}

const listSx: SxProps<Theme> = {
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-start",
  gap: "12px",
  alignSelf: "stretch",
};

const CoauthoredPapersList = ({
  papers,
  onPaperClick,
  onBookmarkToggle,
}: CoauthoredPapersListProps) => {
  if (papers.length === 0) return null;

  return (
    <Box sx={listSx}>
      {papers.map((paper, index) => (
        <CoauthoredPaperCard
          key={paper.paper_id ?? paper.external_id ?? String(index)}
          paper={paper}
          onClick={() => onPaperClick(paper)}
          onBookmarkToggle={() => onBookmarkToggle(paper)}
        />
      ))}
    </Box>
  );
};

export default CoauthoredPapersList;
