import { Box, Typography, IconButton } from "@mui/material";
import { useState } from "react";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { type SxProps, type Theme } from "@mui/material/styles";
import { type KMNodePaper } from "../../types/keywordMap";
import PaperTypeBadge from "../common/PaperTypeBadge";

interface PaperCardProps {
  paper: KMNodePaper;
  onClick: (paperId: string) => void;
}

const cardSx: SxProps<Theme> = {
  padding: "18px 16px",
  borderRadius: "12px",
  border: "1px solid",
  borderColor: "#E8E9ED",
  backgroundColor: "background.default",
  cursor: "pointer",
  display: "flex",
  flexDirection: "column",
  gap: "2px",
  flexShrink: 0,
  alignSelf: "stretch",
  "&:hover": {
    backgroundColor: "background.paper",
  },
};

const PaperCard = ({ paper, onClick }: PaperCardProps) => {
  const [authorExpanded, setAuthorExpanded] = useState(false);

  return (
    <Box sx={cardSx} onClick={() => onClick(paper.paper_id)}>
      {/* 배지 + 북마크 */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
        }}
      >
        <PaperTypeBadge paperType={paper.paper_type} />
        {/* TODO: 백엔드 isBookmarked 필드 추가 후 북마크 기능 연동 */}
        <IconButton
          sx={{
            p: 0,
            width: 36,
            height: 36,
            borderRadius: "12px",
            backgroundColor: "#F6F7F8",
            flexShrink: 0,
            "&:hover": { backgroundColor: "fill.strong" },
          }}
          onClick={(e: React.MouseEvent<HTMLButtonElement>) =>
            e.stopPropagation()
          }
        >
          <BookmarkBorderIcon sx={{ fontSize: 24, color: "primary.main" }} />
        </IconButton>
      </Box>

      {/* 출처 + 연도 */}
      <Typography
        sx={{
          fontSize: "14px",
          fontWeight: 500,
          color: "label.assistive",
          letterSpacing: "-0.26px",
        }}
      >
        {paper.journal_name} {paper.pub_year}
      </Typography>

      {/* 제목 */}
      <Typography
        sx={{
          fontSize: "18px",
          fontWeight: 600,
          color: "label.strong",
          letterSpacing: "-0.34px",
        }}
      >
        {paper.title}
      </Typography>

      {/* 저자 */}
      <Box>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: "4px",
            cursor: paper.authors.length > 1 ? "pointer" : "default",
          }}
          onClick={(e: React.MouseEvent<HTMLDivElement>) => {
            e.stopPropagation();
            if (paper.authors.length > 1) setAuthorExpanded((prev) => !prev);
          }}
        >
          <Typography
            sx={{
              fontSize: "14px",
              fontWeight: 500,
              color: "label.normal",
              letterSpacing: "-0.26px",
            }}
          >
            {paper.authors[0]}
            {paper.authors.length > 1
              ? ` 외 ${paper.authors.length - 1}인`
              : ""}
          </Typography>
          {paper.authors.length > 1 &&
            (authorExpanded ? (
              <KeyboardArrowUpIcon
                sx={{ fontSize: 12, color: "label.normal" }}
              />
            ) : (
              <KeyboardArrowDownIcon
                sx={{ fontSize: 12, color: "label.normal" }}
              />
            ))}
        </Box>
        {authorExpanded && (
          <Typography
            sx={{
              fontSize: "14px",
              fontWeight: 500,
              color: "label.assistive",
              letterSpacing: "-0.26px",
            }}
          >
            {paper.authors.join(", ")}
          </Typography>
        )}
      </Box>

      {/* 키워드 */}
      <Box sx={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
        {paper.keywords.map((keyword, index) => (
          <Typography
            key={index}
            sx={{
              display: "inline-flex",
              padding: "0 6px",
              borderRadius: "7px",
              backgroundColor: "fill.normal",
              fontSize: "14px",
              fontWeight: 400,
              color: "label.alternative",
            }}
          >
            {keyword}
          </Typography>
        ))}
      </Box>
    </Box>
  );
};

export default PaperCard;
