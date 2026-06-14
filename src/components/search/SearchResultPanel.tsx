import { Box, Typography, Button, CircularProgress } from "@mui/material";
import { type SxProps, type Theme } from "@mui/material/styles";
import MiniPaperCard from "./MiniPaperCard";
import {
  type SearchStage,
  type SearchPaper,
  type SearchExecuteResult,
  type FeedbackType,
} from "../../types/search";

interface SearchResultPanelProps {
  interimPapers: SearchPaper[];
  executeResult?: SearchExecuteResult | null;
  isStreaming: boolean;
  searchStage: SearchStage;
  onSearchStart: () => void;
  onFeedback: (paperId: string, feedback: FeedbackType) => void;
  feedbacks: Record<string, FeedbackType>;
}

const containerSx: SxProps<Theme> = {
  display: "flex",
  flexDirection: "column",
  flex: 1,
  overflow: "hidden",
  gap: "8px",
};

const titleSx: SxProps<Theme> = {
  fontSize: "24px",
  fontWeight: 600,
  color: "#000",
  lineHeight: "150%",
};

const subTextSx: SxProps<Theme> = {
  fontSize: "16px",
  fontWeight: 500,
  color: "#5D6279",
  lineHeight: "150%",
};

const resultBoxSx = (hasResult: boolean): SxProps<Theme> => ({
  borderRadius: "12px",
  backgroundColor: "#F6F7F8",
  display: "flex",
  flexDirection: "column",
  ...(hasResult ? { flex: 1, overflow: "hidden" } : { height: 137 }),
});

const emptyBoxSx: SxProps<Theme> = {
  flex: 1,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  gap: "8px",
};

const emptyTextSx: SxProps<Theme> = {
  fontSize: "22px",
  fontWeight: 500,
  color: "#9195AB",
  lineHeight: "150%",
  textAlign: "center",
};

const totalCountSx: SxProps<Theme> = {
  fontSize: "20px",
  fontWeight: 600,
  color: "#000",
  lineHeight: "150%",
  px: "22px",
  pt: "21px",
  pb: "12px",
};

const paperListSx: SxProps<Theme> = {
  flex: 1,
  overflowY: "auto",
  display: "flex",
  flexDirection: "column",
  px: "20px",
  gap: "2px",
  pb: "15px",
};

const searchStartButtonSx = (canStart: boolean): SxProps<Theme> => ({
  display: "inline-flex",
  padding: "10px 32px 10px 33px",
  borderRadius: "50px",
  backgroundColor: canStart ? "primary.main" : "interaction.disable",
  color: "static.white",
  fontSize: "20px",
  fontWeight: 600,
  lineHeight: "150%",
  alignSelf: "flex-end",
  mx: "20px",
  mt: "18px",
  mb: "10px",
  pointerEvents: canStart ? "auto" : "none",
  "&:hover": {
    backgroundColor: canStart ? "primary.dark" : "interaction.disable",
  },
});

const SearchResultPanel = ({
  interimPapers,
  executeResult,
  isStreaming,
  searchStage,
  onSearchStart,
  onFeedback,
  feedbacks,
}: SearchResultPanelProps) => {
  const canSearchStart = searchStage !== "none";
  const hasInterim = interimPapers.length > 0;
  const hasResult = executeResult != null;
  const displayPapers = hasResult ? executeResult.papers : interimPapers;
  const hasDisplayPapers = displayPapers.length > 0;

  return (
    <Box sx={containerSx}>
      <Typography sx={titleSx}>검색 진행 결과</Typography>
      {(hasResult || hasInterim) && (
        <Typography sx={subTextSx}>
          좋아요, 싫어요 버튼을 통해 검색 결과를 유지하거나 삭제할 수 있어요
        </Typography>
      )}
      <Box sx={resultBoxSx(hasDisplayPapers)}>
        {isStreaming && !hasDisplayPapers ? (
          <Box sx={emptyBoxSx}>
            <CircularProgress size={48} sx={{ color: "#9195AB" }} />
            <Typography sx={emptyTextSx}>검색 진행 중</Typography>
          </Box>
        ) : !hasDisplayPapers ? (
          <Box sx={emptyBoxSx}>
            <Typography sx={emptyTextSx}>아직 검색이 진행중이에요</Typography>
          </Box>
        ) : (
          <>
            <Typography sx={totalCountSx}>
              총 {hasResult ? executeResult!.total : interimPapers.length}건
            </Typography>
            <Box sx={paperListSx}>
              {displayPapers.map((paper) => (
                <MiniPaperCard
                  key={paper.paper_id}
                  paper={paper}
                  feedback={feedbacks[paper.paper_id]}
                  onFeedback={onFeedback}
                />
              ))}
            </Box>
            {hasDisplayPapers && (
              <Button
                sx={searchStartButtonSx(canSearchStart)}
                onClick={onSearchStart}
              >
                바로 검색 시작
              </Button>
            )}
          </>
        )}
      </Box>
    </Box>
  );
};

export default SearchResultPanel;
