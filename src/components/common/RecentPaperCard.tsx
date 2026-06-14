import { useState } from "react";
import { Box, Typography, IconButton } from "@mui/material";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { type SxProps, type Theme } from "@mui/material/styles";
import { type RecentPaper } from "../../types/saved";
import PaperTypeBadge from "./PaperTypeBadge";

interface RecentPaperCardProps {
  paper: RecentPaper;
  onBookmark: (paperId: string) => void;
  onDelete: (paperId: string) => void;
  onClick: (paperId: string) => void;
}

const containerSx: SxProps<Theme> = {
  width: "100%",
  padding: "18px 16px",
  borderRadius: "12px",
  border: "1px solid",
  borderColor: "line.normal",
  backgroundColor: "background.default",
  display: "flex",
  flexDirection: "column",
  gap: "8px",
  cursor: "pointer",
  "&:hover": { backgroundColor: "background.paper" },
};

const metaSx: SxProps<Theme> = {
  fontSize: "14px",
  fontWeight: 500,
  color: "label.assistive",
  lineHeight: "normal",
};

const titleSx: SxProps<Theme> = {
  fontSize: "18px",
  fontWeight: 600,
  color: "static.black",
  lineHeight: "normal",
};

const authorSx: SxProps<Theme> = {
  fontSize: "14px",
  fontWeight: 500,
  color: "label.normal",
  lineHeight: "normal",
};

const keywordTagSx: SxProps<Theme> = {
  display: "inline-flex",
  padding: "0 6px",
  borderRadius: "7px",
  backgroundColor: "fill.normal",
  fontSize: "14px",
  fontWeight: 400,
  color: "label.alternative",
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

const iconButtonSx: SxProps<Theme> = {
  p: 0,
  width: 36,
  height: 36,
  borderRadius: "12px",
  backgroundColor: "fill.normal",
  flexShrink: 0,
  "&:hover": { backgroundColor: "line.normal" },
};

const formatViewedAt = (viewedAt: string): string => {
  try {
    const date = new Date(viewedAt);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    return `${year}.${month}.${day}.${hours}:${minutes}`;
  } catch {
    return "";
  }
};

const RecentPaperCard = ({
  paper,
  onBookmark,
  onDelete,
  onClick,
}: RecentPaperCardProps) => {
  const [authorExpanded, setAuthorExpanded] = useState(false);

  const {
    paper_id,
    paper_type,
    journal_name,
    published_at,
    title,
    authors,
    keywords,
    trust_badge,
    viewed_at,
    bookmarked_at,
  } = paper;

  return (
    <Box sx={containerSx} onClick={() => onClick(paper_id)}>
      {/* 배지 + 북마크 + 삭제 */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
        }}
      >
        {paper_type ? <PaperTypeBadge paperType={paper_type} /> : <Box />}
        <Box sx={{ display: "flex", gap: "6px" }}>
          <IconButton
            sx={iconButtonSx}
            onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
              e.stopPropagation();
              onBookmark(paper_id);
            }}
          >
            {bookmarked_at !== null ? (
              <BookmarkIcon sx={{ fontSize: 24, color: "primary.main" }} />
            ) : (
              <BookmarkBorderIcon
                sx={{ fontSize: 24, color: "label.assistive" }}
              />
            )}
          </IconButton>
          <IconButton
            sx={iconButtonSx}
            onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
              e.stopPropagation();
              onDelete(paper_id);
            }}
          >
            <DeleteOutlinedIcon
              sx={{ fontSize: 24, color: "label.assistive" }}
            />
          </IconButton>
        </Box>
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
            if (authors.length > 1) setAuthorExpanded((prev) => !prev);
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

      {/* 키워드 태그 */}
      <Box sx={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
        {keywords.map((kw, index) => (
          <Typography key={`${kw}-${index}`} sx={keywordTagSx}>
            {kw}
          </Typography>
        ))}
      </Box>

      {/* 하단: 배지 + 읽음 시간 */}
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
        <Typography sx={{ ...metaSx, color: "label.assistive" }}>
          {formatViewedAt(viewed_at)} 읽음
        </Typography>
      </Box>
    </Box>
  );
};

export default RecentPaperCard;
