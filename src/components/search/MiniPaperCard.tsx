import { Box, Typography, IconButton } from "@mui/material";
import ThumbUpOutlinedIcon from "@mui/icons-material/ThumbUpOutlined";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ThumbDownOutlinedIcon from "@mui/icons-material/ThumbDownOutlined";
import ThumbDownIcon from "@mui/icons-material/ThumbDown";
import { type SxProps, type Theme } from "@mui/material/styles";
import { type SearchPaper, type FeedbackType } from "../../types/search";

interface MiniPaperCardProps {
  paper: SearchPaper;
  feedback?: FeedbackType;
  onFeedback: (paperId: string, feedback: FeedbackType) => void;
}

const containerSx: SxProps<Theme> = {
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-start",
  gap: "6px",
  alignSelf: "stretch",
  padding: "12px",          // 여백도 추가하면 더 깔끔해
  borderRadius: "8px",      // 둥글게
  backgroundColor: "#FFF",
};

const metaSx: SxProps<Theme> = {
  fontSize: "12px",
  fontWeight: 500,
  color: "#757A94",
  lineHeight: "normal",
};

const titleSx: SxProps<Theme> = {
  fontSize: "16px",
  fontWeight: 600,
  color: "#000",
  lineHeight: "normal",
  alignSelf: "stretch",
};

const tagSx: SxProps<Theme> = {
  display: "inline-flex",
  padding: "4px 6.34px",
  borderRadius: "7.394px",
  backgroundColor: "#F6F7F8",
  fontSize: "12px",
  fontWeight: 400,
  color: "#1B1C23",
  lineHeight: "150%",
  letterSpacing: "-0.24px",
};

const feedbackRowSx: SxProps<Theme> = {
  display: "flex",
  width: "100%",
  justifyContent: "flex-end",
  gap: "6px",
};

const MiniPaperCard = ({ paper, feedback, onFeedback }: MiniPaperCardProps) => {
  const { paper_id, journal, pub_year, title, scope_badge, trust_badge } =
    paper;

  const tags = [scope_badge, trust_badge].filter((tag): tag is string => Boolean(tag));

  const handleThumbUp = () => {
    onFeedback(paper_id, "like");
  };
  // TODO: 백엔드에서 피드백 취소(null) 지원 시 토글 해제 로직 추가 필요
  const handleThumbDown = () => {
    onFeedback(paper_id, "dislike");
  };

  return (
    <Box sx={containerSx}>
      <Typography sx={metaSx}>
        {journal} {pub_year}
      </Typography>
      <Typography sx={titleSx}>{title}</Typography>
      <Box sx={{ display: "flex", gap: "9px", flexWrap: "wrap" }}>
        {tags.map((tag) => (
          <Typography key={tag} sx={tagSx}>
            {tag}
          </Typography>
        ))}
      </Box>
      <Box sx={feedbackRowSx}>
        <IconButton
          onClick={handleThumbUp}
          sx={{
            p: 0,
            width: 24,
            height: 24,
            color: feedback === "like" ? "primary.main" : "label.assistive",
          }}
        >
          {feedback === "like" ? (
            <ThumbUpIcon sx={{ fontSize: 24 }} />
          ) : (
            <ThumbUpOutlinedIcon sx={{ fontSize: 24 }} />
          )}
        </IconButton>
        <IconButton
          onClick={handleThumbDown}
          sx={{
            p: 0,
            width: 24,
            height: 24,
            color: feedback === "dislike" ? "error.main" : "label.assistive",
          }}
        >
          {feedback === "dislike" ? (
            <ThumbDownIcon sx={{ fontSize: 24 }} />
          ) : (
            <ThumbDownOutlinedIcon sx={{ fontSize: 24 }} />
          )}
        </IconButton>
      </Box>
    </Box>
  );
};

export default MiniPaperCard;
