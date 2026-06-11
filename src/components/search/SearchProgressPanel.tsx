import { Box } from "@mui/material";
import { type SxProps, type Theme } from "@mui/material/styles";
import SpecificityCard from "./SpecificityCard";
import SearchResultPanel from "./SearchResultPanel";
import {
  type SearchStage,
  type SearchPaper,
  type FeedbackType,
} from "../../types/search";

interface SearchProgressPanelProps {
  completenessPct: number;
  searchStage: SearchStage;
  interimPapers: SearchPaper[];
  isStreaming: boolean;
  onSearchStart: () => void;
  onFeedback: (paperId: string, feedback: FeedbackType) => void;
  feedbacks: Record<string, FeedbackType>;
}

const containerSx: SxProps<Theme> = {
  display: "flex",
  flexDirection: "column",
  height: "100%",
  padding: "27px 20px 20px 20px",
  gap: "17px",
  overflow: "hidden",
};

const topRowSx: SxProps<Theme> = {
  display: "flex",
  gap: "17px",
  flexShrink: 0,
  alignItems: "flex-start",
};

const SearchProgressPanel = ({
  completenessPct,
  searchStage,
  interimPapers,
  isStreaming,
  onSearchStart,
  onFeedback,
  feedbacks,
}: SearchProgressPanelProps) => {
  return (
    <Box sx={containerSx}>
      <Box sx={topRowSx}>
        <SpecificityCard completenessPct={completenessPct} />
      </Box>
      <SearchResultPanel
        interimPapers={interimPapers}
        isStreaming={isStreaming}
        searchStage={searchStage}
        onSearchStart={onSearchStart}
        onFeedback={onFeedback}
        feedbacks={feedbacks}
      />
    </Box>
  );
};

export default SearchProgressPanel;
