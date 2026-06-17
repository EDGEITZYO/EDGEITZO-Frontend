import { useState } from "react";
import { Box, Typography, IconButton } from "@mui/material";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { type SxProps, type Theme } from "@mui/material/styles";
import { type SearchPaper } from "../../types/search";
import PaperTypeBadge from "../common/PaperTypeBadge";

interface PaperListCardProps {
  paper: SearchPaper;
  isBookmarked: boolean;
  onBookmark: (paperId: string) => void;
  onClick: (paperId: string) => void;
}

const containerSx: SxProps<Theme> = {
  width: "100%",
  padding: "18px 16px",
  borderRadius: "12px",
  border: "1px solid #E8E9ED",
  backgroundColor: "#FFF",
  display: "flex",
  flexDirection: "column",
  gap: "8px",
  cursor: "pointer",
};

const metaSx: SxProps<Theme> = {
  fontSize: "14px",
  fontWeight: 500,
  color: "#757A94",
  lineHeight: "normal",
};

const titleSx: SxProps<Theme> = {
  fontSize: "18px",
  fontWeight: 600,
  color: "#000",
  lineHeight: "normal",
  alignSelf: "stretch",
};

const authorSx: SxProps<Theme> = {
  fontSize: "14px",
  fontWeight: 500,
  color: "#1B1C23",
  lineHeight: "normal",
};

// 1. 배경, 패딩, 테두리 둥글기를 담당하는 Wrapper 스타일
const abstractWrapperSx: SxProps<Theme> = {
  padding: "15px 12px",
  borderRadius: "12px",
  backgroundColor: "fill.normal",
};

// 2. 실제 텍스트 말줄임 및 폰트 스타일을 담당하는 스타일 (패딩 없음)
const abstractTextSx: SxProps<Theme> = {
  fontSize: "14px",
  fontWeight: 500,
  color: "label.alternative",
  lineHeight: "150%",
  overflow: "hidden",
  display: "-webkit-box",
  WebkitLineClamp: 2,
  WebkitBoxOrient: "vertical",
  textOverflow: "ellipsis",
};

const keywordTagSx: SxProps<Theme> = {
  display: "inline-flex",
  padding: "0 6.34px",
  borderRadius: "7.394px",
  backgroundColor: "#F6F7F8",
  fontSize: "12px",
  fontWeight: 400,
  color: "#1B1C23",
  lineHeight: "150%",
  letterSpacing: "-0.24px",
  height: "28px",
  alignItems: "center",
};

const badgeSx: SxProps<Theme> = {
  display: "inline-flex",
  padding: "3px 8px",
  borderRadius: "68px",
  backgroundColor: "#31333F",
  fontSize: "14px",
  fontWeight: 400,
  color: "#FFF",
  lineHeight: "normal",
  height: "26px",
  alignItems: "center",
};

const bookmarkButtonSx: SxProps<Theme> = {
  p: 0,
  width: 37,
  height: 36,
  borderRadius: "12px",
  backgroundColor: "#F6F7F8",
  flexShrink: 0,
  "&:hover": { backgroundColor: "#EBEBEB" },
};

const PaperListCard = ({
  paper,
  isBookmarked,
  onBookmark,
  onClick,
}: PaperListCardProps) => {
  const [authorExpanded, setAuthorExpanded] = useState(false);

  const {
    paper_id,
    journal,
    pub_year,
    title,
    authors,
    abstract,
    keywords,
    trust_badge,
    citation_count,
    paper_type,
  } = paper;

  return (
    <Box sx={containerSx} onClick={() => onClick(paper_id)}>
      {/* 배지 + 북마크 */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
        }}
      >
        {paper_type ? <PaperTypeBadge paperType={paper_type} /> : <Box />}
        <IconButton
          sx={bookmarkButtonSx}
          onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
            e.stopPropagation();
            onBookmark(paper_id);
          }}
        >
          {isBookmarked ? (
            <BookmarkIcon sx={{ fontSize: 24, color: "label.normal" }} />
          ) : (
            <BookmarkBorderIcon sx={{ fontSize: 24, color: "#9195AB" }} />
          )}
        </IconButton>
      </Box>

      {/* 출처/날짜 */}
      <Box sx={{ display: "flex", alignItems: "center", gap: "7px" }}>
        <Typography sx={metaSx}>{journal}</Typography>
        <Typography sx={metaSx}>{pub_year}</Typography>
      </Box>

      {/* 제목 */}
      <Typography sx={titleSx}>{title}</Typography>

      {/* 저자 */}
      <Box>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: "4px",
            cursor: authors.length > 1 ? "pointer" : "default",
          }}
          onClick={(e: React.MouseEvent<HTMLDivElement>) => {
            e.stopPropagation();
            if (authors.length > 1) {
              setAuthorExpanded((prev) => !prev);
            }
          }}
        >
          <Typography sx={authorSx}>
            {authors.length > 1
              ? `${authors[0]} 외 ${authors.length - 1}인`
              : authors[0]}
          </Typography>
          {authors.length > 1 &&
            (authorExpanded ? (
              <KeyboardArrowUpIcon sx={{ fontSize: 12, color: "#1B1C23" }} />
            ) : (
              <KeyboardArrowDownIcon sx={{ fontSize: 12, color: "#1B1C23" }} />
            ))}
        </Box>
        {authorExpanded && (
          <Typography sx={{ ...authorSx, color: "#9195AB", mt: "4px" }}>
            {authors.join(", ")}
          </Typography>
        )}
      </Box>

      {/* 초록 */}
      {abstract && (
        <Box sx={abstractWrapperSx}>
          <Typography sx={abstractTextSx}>{abstract}</Typography>
        </Box>
      )}

      {/* 키워드 태그 */}
      <Box sx={{ display: "flex", gap: "9px", flexWrap: "wrap" }}>
        {keywords.map((kw, index) => (
          <Typography key={`${kw}-${index}`} sx={keywordTagSx}>
            {kw}
          </Typography>
        ))}
      </Box>

      {/* 하단: 배지 */}
      <Box sx={{ display: "flex", gap: "6px" }}>
        {trust_badge && <Typography sx={badgeSx}>{trust_badge}</Typography>}
        <Typography sx={badgeSx}>인용수 {citation_count}</Typography>
      </Box>
    </Box>
  );
};

export default PaperListCard;
