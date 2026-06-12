import { useState } from "react";
import { Box, Typography, IconButton } from "@mui/material";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { type SxProps, type Theme } from "@mui/material/styles";
import { formatDistanceToNow } from "date-fns";
import { ko } from "date-fns/locale";
import { type BookmarkPaper } from "../../types/saved";
import PaperTypeBadge from "../common/PaperTypeBadge";

interface BookmarkPaperCardProps {
  paper: BookmarkPaper;
  onBookmarkRemove: (paperId: string) => void;
  onClick: (paperId: string) => void;
}

const containerSx: SxProps<Theme> = {
  width: "100%",
  padding: "18px 16px",
  borderRadius: "12px",
  border: "1px solid",
  borderColor: "line.normal",
  backgroundColor: "static.white",
  display: "flex",
  flexDirection: "column",
  gap: "8px",
  cursor: "pointer",
};

const metaSx: SxProps<Theme> = {
  fontSize: "14px",
  fontWeight: 500,
  color: "label.alternative",
  lineHeight: "normal",
};

const titleSx: SxProps<Theme> = {
  fontSize: "18px",
  fontWeight: 600,
  color: "static.black",
  lineHeight: "normal",
  alignSelf: "stretch",
};

const authorSx: SxProps<Theme> = {
  fontSize: "14px",
  fontWeight: 500,
  color: "label.normal",
  lineHeight: "normal",
};

const abstractSx: SxProps<Theme> = {
  fontSize: "14px",
  fontWeight: 500,
  color: "label.alternative",
  lineHeight: "150%",
  padding: "15px 12px",
  borderRadius: "12px",
  backgroundColor: "fill.normal",
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
  backgroundColor: "fill.normal",
  fontSize: "12px",
  fontWeight: 400,
  color: "label.normal",
  lineHeight: "150%",
  letterSpacing: "-0.24px",
};

const badgeSx: SxProps<Theme> = {
  display: "inline-flex",
  padding: "3px 8px",
  borderRadius: "68px",
  backgroundColor: "static.black",
  fontSize: "14px",
  fontWeight: 400,
  color: "static.white",
  lineHeight: "normal",
};

const bookmarkButtonSx: SxProps<Theme> = {
  p: 0,
  width: 37,
  height: 36,
  borderRadius: "12px",
  backgroundColor: "fill.normal",
  flexShrink: 0,
  "&:hover": { backgroundColor: "fill.strong" },
};

const formatBookmarkedAt = (bookmarkedAt: string): string => {
  try {
    return formatDistanceToNow(new Date(bookmarkedAt), {
      addSuffix: true,
      locale: ko,
    });
  } catch {
    return "";
  }
};

const BookmarkPaperCard = ({
  paper,
  onBookmarkRemove,
  onClick,
}: BookmarkPaperCardProps) => {
  const [authorExpanded, setAuthorExpanded] = useState(false);

  const {
    paper_id,
    paper_type,
    journal_name,
    published_at,
    title,
    authors,
    abstract,
    keywords,
    trust_badge,
    bookmarked_at,
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
            onBookmarkRemove(paper_id);
          }}
        >
          <BookmarkIcon sx={{ fontSize: 24, color: "label.normal" }} />
        </IconButton>
      </Box>

      {/* 출처/날짜 */}
      <Box sx={{ display: "flex", alignItems: "center", gap: "7px" }}>
        {journal_name && <Typography sx={metaSx}>{journal_name}</Typography>}
        {published_at && <Typography sx={metaSx}>{published_at}</Typography>}
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
          <Typography sx={{ ...authorSx, color: "label.assistive", mt: "4px" }}>
            {authors.join(", ")}
          </Typography>
        )}
      </Box>

      {/* 초록 */}
      {abstract && <Typography sx={abstractSx}>{abstract}</Typography>}

      {/* 키워드 태그 */}
      <Box sx={{ display: "flex", gap: "9px", flexWrap: "wrap" }}>
        {keywords.map((kw, index) => (
          <Typography key={`${kw}-${index}`} sx={keywordTagSx}>
            {kw}
          </Typography>
        ))}
      </Box>

      {/* 하단: 배지 + 북마크 날짜 */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Box sx={{ display: "flex", gap: "6px" }}>
          {trust_badge.kci && <Typography sx={badgeSx}>KCI</Typography>}
          {trust_badge.sci && <Typography sx={badgeSx}>SCI</Typography>}
          <Typography sx={badgeSx}>
            인용수 {trust_badge.citation_count}
          </Typography>
        </Box>
        <Typography
          sx={{
            fontSize: "14px",
            fontWeight: 500,
            color: "label.assistive",
            lineHeight: "normal",
          }}
        >
          {formatBookmarkedAt(bookmarked_at)} 북마크
        </Typography>
      </Box>
    </Box>
  );
};

export default BookmarkPaperCard;
