import { useState } from "react";
import {
  Box,
  Typography,
  IconButton,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { type SxProps, type Theme } from "@mui/material/styles";
import { formatDistanceToNow } from "date-fns";
import { ko } from "date-fns/locale";
import { type BookmarkPaper, type RecentPaper } from "../../types/saved";
import PaperTypeBadge from "../common/PaperTypeBadge";

// ─── Props ────────────────────────────────────────────────

interface BookmarkCardProps {
  variant: "bookmark";
  paper: BookmarkPaper;
  onBookmarkToggle: (paperId: string) => void;
  onClick: (paperId: string) => void;
}

interface RecentCardProps {
  variant: "recent";
  paper: RecentPaper;
  onBookmarkToggle: (paperId: string) => void;
  onDelete: (paperId: string) => void;
  onClick: (paperId: string) => void;
}

type SavedPaperCardProps = BookmarkCardProps | RecentCardProps;

const NARROW_BREAKPOINT = "(max-width: 976px)";

// ─── Styles ───────────────────────────────────────────────

const containerSx: SxProps<Theme> = {
  width: "100%",
  padding: "16px",
  borderRadius: "8px",
  border: "1px solid",
  borderColor: "line.neutral",
  backgroundColor: "background.default",
  display: "flex",
  flexDirection: "column",
  gap: "12px",
  cursor: "pointer",
};

const topSectionSx: SxProps<Theme> = {
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "flex-start",
  gap: "12px",
  alignSelf: "stretch",
};

const metaAndButtonSectionSx: SxProps<Theme> = {
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-start",
  gap: "4px",
  alignSelf: "stretch",
};

const badgeAndButtonRowSx: SxProps<Theme> = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-start",
  alignSelf: "stretch",
};

const badgeAndJournalSx = (isMobile: boolean, isNarrow: boolean): SxProps<Theme> => ({
  display: "flex",
  flexDirection: isMobile || isNarrow ? "column" : "row",
  justifyContent: "center",
  alignItems: isMobile || isNarrow ? "flex-start" : "center",
  gap: "12px",
});

const badgesSx: SxProps<Theme> = {
  display: "flex",
  alignItems: "center",
  gap: "8px",
};

const kciSciBadgeSx: SxProps<Theme> = {
  display: "flex",
  padding: "3px 8px 4px 8px",
  justifyContent: "center",
  alignItems: "center",
  borderRadius: "6px",
  border: "1px solid",
  borderColor: "secondary.dark",
};

const kciSciTextSx: SxProps<Theme> = {
  display: "-webkit-box",
  WebkitBoxOrient: "vertical",
  WebkitLineClamp: 2,
  overflow: "hidden",
  textOverflow: "ellipsis",
  color: "secondary.dark",
  fontSize: "16px",
  fontWeight: 500,
  lineHeight: "24px",
  letterSpacing: "-0.336px",
};

const citationBadgeSx: SxProps<Theme> = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "3px 8px 4px 8px",
  borderRadius: "6px",
  border: "1px solid",
  borderColor: "label.normal",
  alignSelf: "flex-start",
};

const citationTextSx: SxProps<Theme> = {
  fontSize: "16px",
  fontWeight: 600,
  lineHeight: "24px",
  letterSpacing: "-0.336px",
  color: "label.normal",
};

const journalSx: SxProps<Theme> = {
  display: "-webkit-box",
  WebkitBoxOrient: "vertical",
  WebkitLineClamp: 2,
  overflow: "hidden",
  textOverflow: "ellipsis",
  color: "label.alternative",
  fontSize: "16px",
  fontWeight: 400,
  lineHeight: "24px",
  letterSpacing: "-0.336px",
};

const buttonRowSx: SxProps<Theme> = {
  display: "flex",
  gap: "4px",
  flexShrink: 0,
};

const iconButtonSx: SxProps<Theme> = {
  display: "flex",
  padding: "8px",
  alignItems: "center",
  borderRadius: "8px",
  p: "8px",
  "&:hover": { backgroundColor: "fill.normal" },
};

const titleSx: SxProps<Theme> = {
  display: "-webkit-box",
  WebkitBoxOrient: "vertical",
  WebkitLineClamp: 1,
  alignSelf: "stretch",
  overflow: "hidden",
  textOverflow: "ellipsis",
  color: "label.normal",
  fontSize: "20px",
  fontWeight: 600,
  lineHeight: "30px",
  letterSpacing: "-0.42px",
};

const authorTextSx: SxProps<Theme> = {
  color: "#1B1C23",
  fontSize: "13px",
  fontWeight: 400,
  lineHeight: "22px",
  letterSpacing: "-0.26px",
};

const authorToggleBtnSx: SxProps<Theme> = {
  display: "flex",
  width: "20px",
  height: "20px",
  padding: "5px",
  justifyContent: "center",
  alignItems: "center",
  flexShrink: 0,
  borderRadius: "12px",
  p: "5px",
};

const abstractSx: SxProps<Theme> = {
  display: "flex",
  padding: "10px 12px",
  flexDirection: "column",
  alignItems: "flex-start",
  gap: "2px",
  alignSelf: "stretch",
  borderRadius: "6px",
  backgroundColor: "background.paper",
};

const abstractTextSx = (isMobile: boolean): SxProps<Theme> => ({
  alignSelf: "stretch",
  overflow: "hidden",
  color: "label.alternative",
  textOverflow: "ellipsis",
  fontSize: "16px",
  fontWeight: 400,
  lineHeight: "27px",
  letterSpacing: "-0.336px",
  display: "-webkit-box",
  WebkitBoxOrient: "vertical",
  WebkitLineClamp: isMobile ? 2 : 3,
});

const bottomRowSx = (isMobile: boolean): SxProps<Theme> => ({
  display: "flex",
  flexDirection: isMobile ? "column" : "row",
  justifyContent: isMobile ? "flex-start" : "space-between",
  alignItems: isMobile ? "flex-start" : "center",
  alignSelf: "stretch",
  gap: isMobile ? "10px" : 0,
});

const keywordsSx: SxProps<Theme> = {
  display: "flex",
  alignItems: "flex-start",
  gap: "8px",
  flexWrap: "wrap",
};

const keywordSx: SxProps<Theme> = {
  display: "flex",
  padding: "3px 8px 4px 8px",
  justifyContent: "center",
  alignItems: "center",
  borderRadius: "6px",
  backgroundColor: "background.paper",
};

const keywordTextSx: SxProps<Theme> = {
  display: "-webkit-box",
  WebkitBoxOrient: "vertical",
  WebkitLineClamp: 2,
  overflow: "hidden",
  textOverflow: "ellipsis",
  color: "label.normal",
  fontSize: "16px",
  fontWeight: 400,
  lineHeight: "24px",
  letterSpacing: "-0.336px",
};

const dateSx: SxProps<Theme> = {
  display: "-webkit-box",
  WebkitBoxOrient: "vertical",
  WebkitLineClamp: 2,
  overflow: "hidden",
  textOverflow: "ellipsis",
  color: "label.alternative",
  fontSize: "16px",
  fontWeight: 400,
  lineHeight: "24px",
  letterSpacing: "-0.336px",
  flexShrink: 0,
};

// ─── 날짜 포맷 ────────────────────────────────────────────

const formatBookmarkedAt = (bookmarkedAt: string): string => {
  try {
    return `${formatDistanceToNow(new Date(bookmarkedAt), { addSuffix: true, locale: ko })} 북마크`;
  } catch {
    return "";
  }
};

const formatViewedAt = (viewedAt: string): string => {
  try {
    const date = new Date(viewedAt);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    return `${year}.${month}.${day}. ${hours}:${minutes} 읽음`;
  } catch {
    return "";
  }
};

// ─── 컴포넌트 ─────────────────────────────────────────────

const SavedPaperCard = (props: SavedPaperCardProps) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [authorExpanded, setAuthorExpanded] = useState(false);

  const isNarrow = useMediaQuery(NARROW_BREAKPOINT);

  const { variant, paper, onBookmarkToggle, onClick } = props;

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
  } = paper;

  const isBookmarked =
    variant === "bookmark"
      ? true
      : (paper as RecentPaper).bookmarked_at !== null;

  const dateText =
    variant === "bookmark"
      ? formatBookmarkedAt((paper as BookmarkPaper).bookmarked_at)
      : formatViewedAt((paper as RecentPaper).viewed_at);

  return (
    <Box sx={containerSx} onClick={() => onClick(paper_id)}>
      {/* 상단 섹션 */}
      <Box sx={topSectionSx}>
        <Box sx={metaAndButtonSectionSx}>
          {/* 배지 + 저널정보 + 버튼 */}
          <Box sx={badgeAndButtonRowSx}>
            <Box sx={badgeAndJournalSx(isMobile, isNarrow)}>
              {/* 배지들 */}
              <Box sx={badgesSx}>
                {paper_type && <PaperTypeBadge paperType={paper_type} />}
                {trust_badge.citation_count !== null && (
                  <Box sx={citationBadgeSx}>
                    <Typography sx={citationTextSx}>
                      인용수 {trust_badge.citation_count}
                    </Typography>
                  </Box>
                )}
                {trust_badge.kci && (
                  <Box sx={kciSciBadgeSx}>
                    <Typography sx={kciSciTextSx}>KCI</Typography>
                  </Box>
                )}
                {trust_badge.sci && (
                  <Box sx={kciSciBadgeSx}>
                    <Typography sx={kciSciTextSx}>SCI</Typography>
                  </Box>
                )}
              </Box>
              {/* 저널 정보 */}
              {(journal_name || published_at) && (
                <Typography sx={journalSx}>
                  {[published_at, journal_name].filter(Boolean).join(" ")}
                </Typography>
              )}
            </Box>

            {/* 버튼 */}
            <Box sx={buttonRowSx}>
              <IconButton
                sx={iconButtonSx}
                onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                  e.stopPropagation();
                  onBookmarkToggle(paper_id);
                }}
              >
                {isBookmarked ? (
                  <BookmarkIcon sx={{ fontSize: 20, color: "primary.main" }} />
                ) : (
                  <BookmarkBorderIcon
                    sx={{ fontSize: 20, color: "label.assistive" }}
                  />
                )}
              </IconButton>
              {variant === "recent" && (
                <IconButton
                  sx={iconButtonSx}
                  onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                    e.stopPropagation();
                    (props as RecentCardProps).onDelete(paper_id);
                  }}
                >
                  <DeleteOutlinedIcon
                    sx={{ fontSize: 20, color: "label.assistive" }}
                  />
                </IconButton>
              )}
            </Box>
          </Box>

          {/* 제목 */}
          <Typography sx={titleSx}>{title}</Typography>
        </Box>

        {/* 저자 */}
        <Box>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              cursor: authors.length > 1 ? "pointer" : "default",
            }}
            onClick={(e: React.MouseEvent<HTMLDivElement>) => {
              e.stopPropagation();
              if (authors.length > 1) setAuthorExpanded((prev) => !prev);
            }}
          >
            <Typography sx={authorTextSx}>
              {authors.length > 1
                ? `${authors[0]} 외 ${authors.length - 1}인`
                : authors[0]}
            </Typography>
            {authors.length > 1 && (
              <IconButton sx={authorToggleBtnSx}>
                {authorExpanded ? (
                  <KeyboardArrowUpIcon sx={{ fontSize: 10 }} />
                ) : (
                  <KeyboardArrowDownIcon sx={{ fontSize: 10 }} />
                )}
              </IconButton>
            )}
          </Box>
          {authorExpanded && (
            <Typography
              sx={{ ...authorTextSx, color: "label.assistive", mt: "4px" }}
            >
              {authors.join(", ")}
            </Typography>
          )}
        </Box>

        {/* 초록 */}
        {abstract && (
          <Box sx={abstractSx}>
            <Typography sx={abstractTextSx(isMobile)}>{abstract}</Typography>
          </Box>
        )}
      </Box>

      {/* 하단: 키워드 + 일시 */}
      <Box sx={bottomRowSx(isMobile)}>
        <Box sx={keywordsSx}>
          {keywords.map((kw, index) => (
            <Box key={`${kw}-${index}`} sx={keywordSx}>
              <Typography sx={keywordTextSx}>{kw}</Typography>
            </Box>
          ))}
        </Box>
        <Typography sx={dateSx}>{dateText}</Typography>
      </Box>
    </Box>
  );
};

export default SavedPaperCard;
